#!/bin/bash

#
# bootstrap.sh - Script di setup automatico per adv.nwdesigns.it
#
# Uso:
#   ./scripts/bootstrap.sh          # Setup completo
#   ./scripts/bootstrap.sh --check  # Solo verifica dipendenze
#   ./scripts/bootstrap.sh --help   # Mostra aiuto
#

set -e

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Emoji per stato
CHECK="✓"
CROSS="✗"
ARROW="→"
ROCKET="🚀"
WRENCH="🔧"
PACKAGE="📦"
KEY="🔑"

# Funzioni di output
info() {
    echo -e "${BLUE}${ARROW}${NC} $1"
}

success() {
    echo -e "${GREEN}${CHECK}${NC} $1"
}

warning() {
    echo -e "${YELLOW}!${NC} $1"
}

error() {
    echo -e "${RED}${CROSS}${NC} $1"
}

header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Variabili
PROJECT_NAME="adv.nwdesigns.it"
REPO_URL="git@gitlab.com:nwdesigns/adv.nwdesigns.it.git"
GITHUB_URL="git@github.com:nwdesigns/landingpages.git"
MIN_MACOS_VERSION="12.0"

# Mostra aiuto
show_help() {
    cat << EOF
${ROCKET} Bootstrap Script per ${PROJECT_NAME}

Uso:
    ./scripts/bootstrap.sh [opzioni]

Opzioni:
    --check     Solo verifica dipendenze senza installare
    --deps      Installa solo dipendenze di sistema (Homebrew, git, bun, glab, gh)
    --project   Solo setup progetto (clone, install, verifica)
    --help      Mostra questo messaggio

Esempi:
    ./scripts/bootstrap.sh              # Setup completo
    ./scripts/bootstrap.sh --check      # Verifica cosa manca
    ./scripts/bootstrap.sh --deps       # Installa solo dipendenze

Per maggiori informazioni, leggi docs/ONBOARDING.md
EOF
}

# Verifica versione macOS
check_macos_version() {
    local current_version
    current_version=$(sw_vers -productVersion)

    if [[ "$(printf '%s\n' "$MIN_MACOS_VERSION" "$current_version" | sort -V | head -n1)" != "$MIN_MACOS_VERSION" ]]; then
        error "macOS $current_version non supportato. Richiesto almeno $MIN_MACOS_VERSION"
        exit 1
    fi
    success "macOS $current_version"
}

# Verifica se un comando esiste
command_exists() {
    command -v "$1" &> /dev/null
}

# Verifica Homebrew
check_homebrew() {
    if command_exists brew; then
        local version
        version=$(brew --version | head -n1)
        success "Homebrew installato ($version)"
        return 0
    else
        warning "Homebrew non installato"
        return 1
    fi
}

# Installa Homebrew
install_homebrew() {
    info "Installazione Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # Aggiungi al PATH
    if [[ $(uname -m) == "arm64" ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    else
        echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/usr/local/bin/brew shellenv)"
    fi

    success "Homebrew installato"
}

# Verifica Git
check_git() {
    if command_exists git; then
        local version
        version=$(git --version | awk '{print $3}')
        success "Git installato (v$version)"
        return 0
    else
        warning "Git non installato"
        return 1
    fi
}

# Verifica Bun
check_bun() {
    if command_exists bun; then
        local version
        version=$(bun --version)
        success "Bun installato (v$version)"
        return 0
    else
        warning "Bun non installato"
        return 1
    fi
}

# Verifica glab
check_glab() {
    if command_exists glab; then
        local version
        version=$(glab --version | head -n1 | awk '{print $3}')
        success "glab installato (v$version)"
        return 0
    else
        warning "glab non installato"
        return 1
    fi
}

# Verifica gh
check_gh() {
    if command_exists gh; then
        local version
        version=$(gh --version | head -n1 | awk '{print $3}')
        success "gh installato (v$version)"
        return 0
    else
        warning "gh non installato"
        return 1
    fi
}

# Verifica configurazione Git
check_git_config() {
    local name email
    name=$(git config --global user.name 2>/dev/null || echo "")
    email=$(git config --global user.email 2>/dev/null || echo "")

    if [[ -n "$name" && -n "$email" ]]; then
        success "Git configurato ($name <$email>)"
        return 0
    else
        warning "Git non configurato (nome o email mancante)"
        return 1
    fi
}

# Verifica chiave SSH
check_ssh_key() {
    if [[ -f ~/.ssh/id_ed25519.pub ]] || [[ -f ~/.ssh/id_rsa.pub ]]; then
        success "Chiave SSH presente"
        return 0
    else
        warning "Chiave SSH non trovata"
        return 1
    fi
}

# Verifica autenticazione glab
check_glab_auth() {
    if glab auth status &> /dev/null; then
        local user
        user=$(glab auth status 2>&1 | grep "Logged in" | awk '{print $NF}')
        success "glab autenticato ($user)"
        return 0
    else
        warning "glab non autenticato"
        return 1
    fi
}

# Verifica autenticazione gh
check_gh_auth() {
    if gh auth status &> /dev/null; then
        local user
        user=$(gh auth status 2>&1 | grep "Logged in" | awk '{print $NF}')
        success "gh autenticato ($user)"
        return 0
    else
        warning "gh non autenticato"
        return 1
    fi
}

# Installa pacchetti con Homebrew
install_packages() {
    local packages=("git" "bun" "glab" "gh")
    local to_install=()

    for pkg in "${packages[@]}"; do
        if ! command_exists "$pkg"; then
            to_install+=("$pkg")
        fi
    done

    if [[ ${#to_install[@]} -gt 0 ]]; then
        info "Installazione pacchetti: ${to_install[*]}"
        brew install "${to_install[@]}"
        success "Pacchetti installati"
    else
        success "Tutti i pacchetti già installati"
    fi
}

# Configura Git
configure_git() {
    local name email

    echo ""
    read -p "Inserisci il tuo nome completo: " name
    read -p "Inserisci la tua email: " email

    git config --global user.name "$name"
    git config --global user.email "$email"

    success "Git configurato"
}

# Genera chiave SSH
generate_ssh_key() {
    local email
    email=$(git config --global user.email)

    if [[ -z "$email" ]]; then
        read -p "Inserisci la tua email per la chiave SSH: " email
    fi

    info "Generazione chiave SSH..."
    ssh-keygen -t ed25519 -C "$email" -f ~/.ssh/id_ed25519 -N ""

    # Avvia SSH agent
    eval "$(ssh-agent -s)" &> /dev/null
    ssh-add ~/.ssh/id_ed25519 &> /dev/null

    success "Chiave SSH generata"
    echo ""
    echo -e "${YELLOW}${KEY} IMPORTANTE: Aggiungi questa chiave a GitLab e GitHub${NC}"
    echo -e "${YELLOW}   GitLab: https://gitlab.com/-/user_settings/ssh_keys${NC}"
    echo -e "${YELLOW}   GitHub: https://github.com/settings/keys${NC}"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    cat ~/.ssh/id_ed25519.pub
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    # Copia negli appunti
    pbcopy < ~/.ssh/id_ed25519.pub
    success "Chiave copiata negli appunti (⌘+V per incollare)"

    echo ""
    read -p "Premi INVIO dopo aver aggiunto la chiave su GitLab e GitHub..."
}

# Autentica glab
authenticate_glab() {
    info "Autenticazione glab..."
    echo ""
    echo -e "${YELLOW}Per autenticarti con GitLab:${NC}"
    echo "1. Vai su https://gitlab.com/-/user_settings/personal_access_tokens"
    echo "2. Crea un token con scope: api, read_user, read_repository, write_repository"
    echo "3. Copia il token e incollalo quando richiesto"
    echo ""
    glab auth login --hostname gitlab.com
    success "glab autenticato"
}

# Autentica gh
authenticate_gh() {
    info "Autenticazione gh..."
    gh auth login --hostname github.com
    success "gh autenticato"
}

# Clone del progetto
clone_project() {
    local target_dir="${1:-$PROJECT_NAME}"

    if [[ -d "$target_dir" ]]; then
        if [[ -d "$target_dir/.git" ]]; then
            success "Progetto già clonato in $target_dir"
            return 0
        else
            error "La directory $target_dir esiste ma non è un repository Git"
            return 1
        fi
    fi

    info "Clone del repository da GitLab..."
    git clone "$REPO_URL" "$target_dir"

    # Aggiungi GitHub come remote secondario
    cd "$target_dir"
    info "Aggiunta GitHub come remote secondario..."
    git remote add github "$GITHUB_URL" 2>/dev/null || true
    cd - > /dev/null

    success "Repository clonato in $target_dir (con remote GitHub)"
}

# Installa dipendenze progetto
install_dependencies() {
    local project_dir="${1:-.}"

    if [[ ! -f "$project_dir/package.json" ]]; then
        error "package.json non trovato in $project_dir"
        return 1
    fi

    info "Installazione dipendenze..."
    cd "$project_dir"
    bun install
    success "Dipendenze installate"
}

# Verifica che il server funzioni
verify_server() {
    local project_dir="${1:-.}"

    info "Verifica server di sviluppo..."

    cd "$project_dir"

    # Avvia il server in background
    bun dev &
    local server_pid=$!

    # Aspetta che il server sia pronto
    sleep 5

    # Verifica che risponda
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|301\|302"; then
        success "Server funzionante su http://localhost:3000"
    else
        warning "Server avviato ma potrebbero esserci problemi"
    fi

    # Ferma il server
    kill $server_pid 2>/dev/null
}

# Verifica completa dipendenze
check_all() {
    header "${WRENCH} Verifica Dipendenze"

    local all_ok=true

    info "Sistema operativo"
    check_macos_version || all_ok=false

    echo ""
    info "Strumenti di sviluppo"
    check_homebrew || all_ok=false
    check_git || all_ok=false
    check_bun || all_ok=false
    check_glab || all_ok=false
    check_gh || all_ok=false

    echo ""
    info "Configurazione"
    check_git_config || all_ok=false
    check_ssh_key || all_ok=false
    check_glab_auth || all_ok=false
    check_gh_auth || all_ok=false

    echo ""
    if $all_ok; then
        success "Tutte le dipendenze sono soddisfatte!"
        return 0
    else
        warning "Alcune dipendenze mancano. Esegui './scripts/bootstrap.sh' per installarle."
        return 1
    fi
}

# Setup dipendenze di sistema
setup_deps() {
    header "${PACKAGE} Installazione Dipendenze"

    # Homebrew
    if ! check_homebrew; then
        install_homebrew
    fi

    # Pacchetti
    install_packages

    # Configurazione Git
    if ! check_git_config; then
        configure_git
    fi

    # Chiave SSH
    if ! check_ssh_key; then
        generate_ssh_key
    fi

    # Autenticazione glab
    if ! check_glab_auth; then
        authenticate_glab
    fi

    # Autenticazione gh
    if ! check_gh_auth; then
        authenticate_gh
    fi

    success "Dipendenze di sistema configurate!"
}

# Setup progetto
setup_project() {
    header "${ROCKET} Setup Progetto"

    local script_dir
    script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local project_dir
    project_dir="$(dirname "$script_dir")"

    # Se siamo già nel progetto
    if [[ -f "$project_dir/package.json" ]]; then
        info "Progetto trovato in $project_dir"
        install_dependencies "$project_dir"
    else
        # Clone
        clone_project
        install_dependencies "$PROJECT_NAME"
        project_dir="$PROJECT_NAME"
    fi

    success "Progetto configurato!"

    echo ""
    echo -e "${GREEN}${ROCKET} Setup completato!${NC}"
    echo ""
    echo "Per avviare il server di sviluppo:"
    echo -e "  ${BLUE}cd $project_dir${NC}"
    echo -e "  ${BLUE}bun dev${NC}"
    echo ""
    echo "Poi apri http://localhost:3000 nel browser"
}

# Main
main() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  ${ROCKET} Bootstrap - ${PROJECT_NAME}${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    case "${1:-}" in
        --help|-h)
            show_help
            ;;
        --check)
            check_all
            ;;
        --deps)
            setup_deps
            ;;
        --project)
            setup_project
            ;;
        *)
            # Setup completo
            setup_deps
            setup_project
            ;;
    esac
}

main "$@"
