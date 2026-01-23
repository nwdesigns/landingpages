# Guida Onboarding Sviluppatori

Benvenuto nel progetto **adv.nwdesigns.it**! Questa guida ti accompagnerà nell'installazione di tutti gli strumenti necessari per lavorare su questo progetto.

**Tempo stimato**: ~30 minuti

---

## Indice

1. [Prerequisiti](#1-prerequisiti)
2. [Installazione Homebrew](#2-installazione-homebrew)
3. [Installazione Pacchetti](#3-installazione-pacchetti)
4. [Configurazione Git](#4-configurazione-git)
5. [Registrazione GitLab](#5-registrazione-gitlab)
6. [Richiesta Accesso Repository](#6-richiesta-accesso-repository)
7. [Configurazione glab (GitLab CLI)](#7-configurazione-glab-gitlab-cli)
8. [Installazione Claude Code Desktop](#8-installazione-claude-code-desktop)
9. [Clone e Setup Progetto](#9-clone-e-setup-progetto)
10. [Struttura Progetto](#10-struttura-progetto)
11. [Configurazione Deploy](#11-configurazione-deploy-opzionale)
12. [Comandi Utili](#12-comandi-utili)
13. [Troubleshooting](#13-troubleshooting)
14. [Risorse Utili](#14-risorse-utili)

---

## 1. Prerequisiti

Prima di iniziare, assicurati di avere:

- **macOS 12+** (Monterey o successivo)
- **Accesso amministratore** sul tuo Mac (per installare software)
- **Connessione internet** stabile

Per verificare la versione di macOS:
```bash
sw_vers -productVersion
```

---

## 2. Installazione Homebrew

[Homebrew](https://brew.sh) è il package manager per macOS. Lo useremo per installare tutti gli altri strumenti.

### Installazione

Apri il **Terminale** (Applicazioni → Utility → Terminale) ed esegui:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Segui le istruzioni a schermo. Ti verrà chiesta la password di amministratore.

### Configurazione PATH

Dopo l'installazione, Homebrew mostrerà dei comandi da eseguire. Dipendono dal tipo di Mac:

**Per Mac con Apple Silicon (M1/M2/M3/M4):**
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

**Per Mac con Intel:**
```bash
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/usr/local/bin/brew shellenv)"
```

### Verifica

```bash
brew --version
```

Dovresti vedere qualcosa come `Homebrew 4.x.x`.

---

## 3. Installazione Pacchetti

Installa tutti i pacchetti necessari con un singolo comando:

```bash
brew install git bun glab
```

Oppure puoi usare lo script di bootstrap (vedi sezione 9).

### Cosa viene installato

| Pacchetto | Descrizione |
|-----------|-------------|
| **git** | Sistema di controllo versione |
| **bun** | Runtime JavaScript ultrarapido (alternativa a Node.js) |
| **glab** | CLI ufficiale per GitLab (gestione MR da terminale) |

### Verifica installazioni

```bash
git --version    # Dovrebbe mostrare git version 2.x.x
bun --version    # Dovrebbe mostrare 1.x.x
glab --version   # Dovrebbe mostrare glab version x.x.x
```

---

## 4. Configurazione Git

### Imposta nome e email

Questi dati appariranno nei tuoi commit:

```bash
git config --global user.name "Il Tuo Nome"
git config --global user.email "tua.email@esempio.com"
```

**Nota**: Usa la stessa email che userai per registrarti su GitLab.

### Genera chiave SSH

La chiave SSH ti permette di autenticarti con GitLab senza inserire la password ogni volta.

```bash
# Genera una nuova chiave SSH
ssh-keygen -t ed25519 -C "tua.email@esempio.com"
```

Quando ti viene chiesto dove salvare la chiave, premi **Invio** per accettare il percorso predefinito (`~/.ssh/id_ed25519`).

Puoi impostare una passphrase per maggiore sicurezza, oppure lasciare vuoto premendo **Invio**.

### Avvia SSH Agent e aggiungi la chiave

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### Copia la chiave pubblica

```bash
pbcopy < ~/.ssh/id_ed25519.pub
```

La chiave pubblica è ora copiata negli appunti. La userai nel prossimo passaggio.

---

## 5. Registrazione GitLab

Se non hai già un account GitLab, creane uno:

1. Vai su [https://gitlab.com/users/sign_up](https://gitlab.com/users/sign_up)
2. Compila il form di registrazione:
   - **Username**: scegli un nome utente professionale
   - **Email**: usa la stessa email configurata in Git
   - **Password**: almeno 8 caratteri
3. Completa la verifica email
4. (Opzionale) Completa il profilo con foto e informazioni

### Aggiungi la chiave SSH

1. Vai su [GitLab → Settings → SSH Keys](https://gitlab.com/-/user_settings/ssh_keys)
2. Nel campo **Key**, incolla la chiave pubblica (copiata prima con `pbcopy`)
3. Nel campo **Title**, inserisci un nome descrittivo (es. "MacBook Pro - Lavoro")
4. Lascia **Expiration date** vuoto (o imposta una data se preferisci)
5. Clicca **Add key**

### Verifica connessione SSH

```bash
ssh -T git@gitlab.com
```

Dovresti vedere: `Welcome to GitLab, @tuousername!`

---

## 6. Richiesta Accesso Repository

Il repository del progetto è privato. Per ottenere l'accesso:

### Informazioni Repository

- **URL**: `gitlab.com/nwdesigns/adv.nwdesigns.it`
- **Admin**: lushano.perera

### Come richiedere l'accesso

1. Vai su [GitLab](https://gitlab.com) e accedi con il tuo account
2. Cerca l'utente **lushano.perera**
3. Invia un messaggio con le seguenti informazioni:

```
Ciao,

sono [Il Tuo Nome] e avrei bisogno dell'accesso al repository
adv.nwdesigns.it per [motivo: es. "collaborare allo sviluppo
delle landing page"].

Il mio username GitLab è: [il_tuo_username]

Grazie!
```

### Livelli di accesso

| Livello | Permessi |
|---------|----------|
| **Reporter** | Solo lettura (clone, visualizzazione) |
| **Developer** | Lettura + scrittura (push, MR) |
| **Maintainer** | Tutto + gestione progetto |

Per contribuire attivamente, richiedi il livello **Developer**.

---

## 7. Configurazione glab (GitLab CLI)

glab ti permette di gestire Merge Request, issue e pipeline direttamente da terminale.

### Autenticazione

```bash
glab auth login
```

Segui le istruzioni interattive:

1. **What GitLab instance do you want to log into?** → Seleziona `gitlab.com`
2. **How would you like to login?** → Scegli `Login with a web browser` (consigliato)
3. Si aprirà il browser per completare l'autenticazione
4. Torna al terminale quando richiesto

### Verifica

```bash
glab auth status
```

Dovresti vedere:
```
gitlab.com
  ✓ Logged in to gitlab.com as il_tuo_username
  ✓ Git operations for gitlab.com configured to use https protocol.
  ✓ Token found
```

### Configurazione protocollo (opzionale)

Se preferisci usare SSH invece di HTTPS:
```bash
glab config set git_protocol ssh
```

---

## 8. Installazione Claude Code Desktop

Claude Code è l'assistente AI che ti aiuterà nello sviluppo.

### Download

1. Vai su [https://claude.ai/download](https://claude.ai/download)
2. Scarica la versione per macOS
3. Apri il file `.dmg` scaricato
4. Trascina **Claude** nella cartella **Applicazioni**

### Primo avvio

1. Apri Claude dalle Applicazioni
2. macOS potrebbe chiedere conferma per aprire l'app → Clicca **Apri**
3. Accedi con il tuo account Anthropic (o creane uno)
4. Completa l'onboarding iniziale

### Integrazione con VSCode (opzionale)

Se usi Visual Studio Code:

1. Apri VSCode
2. Vai su Extensions (⌘+Shift+X)
3. Cerca "Claude" o "Claude Code"
4. Installa l'estensione ufficiale

---

## 9. Clone e Setup Progetto

### Metodo Automatico (Consigliato)

Usa lo script di bootstrap che installa tutto automaticamente:

```bash
# Scarica ed esegui lo script
curl -fsSL https://raw.githubusercontent.com/nwdesigns/adv.nwdesigns.it/main/scripts/bootstrap.sh | bash
```

Oppure, se hai già clonato il progetto:

```bash
cd adv.nwdesigns.it
./scripts/bootstrap.sh
```

### Metodo Manuale

Se preferisci procedere manualmente:

```bash
# Clona il repository
git clone git@gitlab.com:nwdesigns/adv.nwdesigns.it.git

# Entra nella cartella del progetto
cd adv.nwdesigns.it

# Installa le dipendenze
bun install

# Avvia il server di sviluppo
bun dev
```

### Verifica

1. Apri il browser e vai su [http://localhost:3000](http://localhost:3000)
2. Dovresti vedere la landing page "Luxury"
3. Naviga tra le varie pagine per verificare che tutto funzioni

---

## 10. Struttura Progetto

```
adv.nwdesigns.it/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Layout principale
│   └── page.tsx              # Redirect a /luxury/
│
├── public/                   # Landing page statiche
│   ├── _shared/              # Asset condivisi
│   │   ├── css/main.css      # Stili globali
│   │   ├── js/main.js        # JavaScript globale
│   │   ├── js/modules/       # Moduli JS
│   │   ├── img/              # Immagini e SVG
│   │   └── video/            # Video background
│   │
│   ├── luxury/               # Landing Luxury
│   │   ├── index.html        # Pagina principale
│   │   ├── grazie.html       # Pagina ringraziamento
│   │   ├── css/custom.css    # Stili specifici
│   │   └── js/main.js        # JS specifico
│   │
│   ├── automotive/           # Landing Automotive
│   ├── gold-traders/         # Landing Gold Traders
│   ├── watch-dealers/        # Landing Watch Dealers
│   ├── private-schools/      # Landing Private Schools
│   ├── senior-living/        # Landing Senior Living
│   └── family-companies/     # Landing Family Companies
│
├── docs/                     # Documentazione
│   └── ONBOARDING.md         # Questa guida
│
├── scripts/                  # Script di utilità
│   └── bootstrap.sh          # Setup automatico
│
├── package.json              # Dipendenze progetto
├── bun.lock                  # Lockfile Bun
├── next.config.ts            # Configurazione Next.js
├── vercel.json               # Configurazione Vercel
├── deploy.sh                 # Script deploy
├── .env.deployment           # Token Vercel (non committato)
├── CLAUDE.md                 # Istruzioni per Claude AI
└── README.md                 # README progetto
```

### Verticali (Landing Page)

| Verticale | URL Locale | URL Produzione |
|-----------|------------|----------------|
| Luxury | http://localhost:3000/luxury/ | https://adv.nwdesigns.it/luxury/ |
| Automotive | http://localhost:3000/automotive/ | https://adv.nwdesigns.it/automotive/ |
| Gold Traders | http://localhost:3000/gold-traders/ | https://adv.nwdesigns.it/gold-traders/ |
| Watch Dealers | http://localhost:3000/watch-dealers/ | https://adv.nwdesigns.it/watch-dealers/ |
| Private Schools | http://localhost:3000/private-schools/ | https://adv.nwdesigns.it/private-schools/ |
| Senior Living | http://localhost:3000/senior-living/ | https://adv.nwdesigns.it/senior-living/ |
| Family Companies | http://localhost:3000/family-companies/ | https://adv.nwdesigns.it/family-companies/ |

---

## 11. Configurazione Deploy (Opzionale)

Questa sezione è necessaria solo se devi effettuare deploy in produzione.

### Prerequisiti

1. **Account Vercel**: Registrati su [vercel.com/signup](https://vercel.com/signup)
2. **Accesso al team**: Richiedi l'accesso al team nwdesigns su Vercel

### Generazione Token

1. Vai su [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Clicca **Create Token**
3. **Name**: "adv.nwdesigns.it deploy"
4. **Scope**: Seleziona il team appropriato
5. **Expiration**: Scegli la durata (o "No expiration")
6. Clicca **Create**
7. **IMPORTANTE**: Copia subito il token, non sarà più visibile!

### Configurazione locale

Crea il file `.env.deployment` nella root del progetto:

```bash
echo 'VERCEL_TOKEN=il_tuo_token_qui' > .env.deployment
```

**Nota**: Questo file è nel `.gitignore` e non verrà committato.

### Test Deploy

```bash
# Deploy di preview (per testare)
./deploy.sh --preview

# Deploy in produzione
./deploy.sh
```

---

## 12. Comandi Utili

### Sviluppo

| Comando | Descrizione |
|---------|-------------|
| `bun dev` | Avvia server di sviluppo (http://localhost:3000) |
| `bun build` | Build di produzione |
| `bun start` | Avvia server di produzione locale |

### Git

| Comando | Descrizione |
|---------|-------------|
| `git status` | Mostra stato modifiche |
| `git pull` | Scarica ultime modifiche |
| `git add .` | Aggiungi tutte le modifiche |
| `git commit -m "messaggio"` | Crea commit |
| `git push` | Carica modifiche su GitLab |

### GitLab (glab)

| Comando | Descrizione |
|---------|-------------|
| `glab mr list` | Lista Merge Request aperte |
| `glab mr create` | Crea nuova MR |
| `glab mr view 123` | Visualizza MR #123 |
| `glab mr checkout 123` | Checkout branch della MR #123 |
| `glab mr merge 123` | Merge MR #123 |
| `glab issue list` | Lista issue |
| `glab ci status` | Stato pipeline CI/CD |

### Deploy

| Comando | Descrizione |
|---------|-------------|
| `./deploy.sh` | Deploy in produzione |
| `./deploy.sh --preview` | Deploy di preview |

---

## 13. Troubleshooting

### "command not found: bun"

Il terminale non trova Bun. Soluzioni:

1. **Riavvia il terminale** (chiudi e riapri)
2. Se non funziona, aggiungi manualmente al PATH:
   ```bash
   echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

### "command not found: glab"

glab non è installato. Soluzione:
```bash
brew install glab
```

### "Permission denied (publickey)"

GitLab non riconosce la tua chiave SSH. Verifica:

1. La chiave è stata aggiunta su GitLab?
   ```bash
   # Mostra la chiave pubblica
   cat ~/.ssh/id_ed25519.pub
   ```
2. L'SSH agent è attivo?
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```
3. Testa la connessione:
   ```bash
   ssh -T git@gitlab.com
   ```

### "Error: EADDRINUSE: address already in use :::3000"

La porta 3000 è già occupata. Soluzioni:

1. **Chiudi l'altra applicazione** che usa la porta
2. **Usa una porta diversa**:
   ```bash
   bun dev --port 3001
   ```
3. **Trova e termina il processo**:
   ```bash
   lsof -i :3000
   kill -9 <PID>
   ```

### "glab auth: error authenticating"

Problemi con l'autenticazione glab:

1. **Riprova il login**:
   ```bash
   glab auth login --hostname gitlab.com
   ```
2. **Usa un Personal Access Token**:
   - Vai su GitLab → Settings → Access Tokens
   - Crea un token con scope `api`, `read_api`, `read_repository`, `write_repository`
   - Usa il token durante `glab auth login`

### Le modifiche non si vedono nel browser

1. **Ricarica la pagina** con ⌘+Shift+R (hard refresh)
2. **Pulisci la cache** del browser
3. **Riavvia il server**:
   ```bash
   # Ferma con Ctrl+C, poi riavvia
   bun dev
   ```

---

## 14. Risorse Utili

### Documentazione Ufficiale

- [Next.js Documentation](https://nextjs.org/docs)
- [Bun Documentation](https://bun.sh/docs)
- [GitLab glab CLI](https://gitlab.com/gitlab-org/cli/-/blob/main/README.md)
- [Claude Code Documentation](https://docs.anthropic.com/claude-code)

### Design System

Il progetto usa il design system di nwdesigns:

| Colore | Variabile | Valore |
|--------|-----------|--------|
| Background | `--nw-bg` | `#F0F0F0` |
| Foreground | `--nw-fg` | `#2B2B2B` |
| Accent | `--nw-accent` | `#D61313` |
| Muted | `--nw-muted` | `#828282` |
| Dark | `--nw-dark` | `#1E1E1E` |

### Font

- **Headlines**: Aktiv Grotesk Extended
- **Body**: Mulish
- **Labels**: Space Mono (uppercase)

### Contatti

Per problemi o domande:

- **Repository Admin**: lushano.perera (GitLab)
- **Sito principale**: [nwdesigns.it](https://www.nwdesigns.it)

---

## Checklist Finale

Prima di iniziare a lavorare, verifica di aver completato tutti i passaggi:

- [ ] Homebrew installato
- [ ] Git, Bun e glab installati
- [ ] Git configurato (nome, email)
- [ ] Chiave SSH generata e aggiunta a GitLab
- [ ] Account GitLab creato
- [ ] Accesso al repository ottenuto
- [ ] glab autenticato
- [ ] Claude Code Desktop installato
- [ ] Progetto clonato
- [ ] Dipendenze installate (`bun install`)
- [ ] Server di sviluppo funzionante (`bun dev`)
- [ ] (Opzionale) Token Vercel configurato

**Buon lavoro!**

---

*Ultimo aggiornamento: Gennaio 2026*
