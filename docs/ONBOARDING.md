# Guida Onboarding Sviluppatori

Benvenuto nel progetto **adv.nwdesigns.it**! Questa guida ti accompagnerà nell'installazione di tutti gli strumenti necessari per lavorare su questo progetto.

---

## Indice

1. [Prerequisiti](#1-prerequisiti)
2. [Installazione Homebrew](#2-installazione-homebrew)
3. [Installazione Pacchetti](#3-installazione-pacchetti)
4. [Configurazione Git](#4-configurazione-git)
5. [Registrazione GitLab](#5-registrazione-gitlab)
6. [Registrazione GitHub](#6-registrazione-github)
7. [Richiesta Accesso Repository](#7-richiesta-accesso-repository)
8. [Configurazione glab (GitLab CLI)](#8-configurazione-glab-gitlab-cli)
9. [Configurazione gh (GitHub CLI)](#9-configurazione-gh-github-cli)
10. [Installazione Claude Code Desktop](#10-installazione-claude-code-desktop)
11. [Clone e Setup Progetto](#11-clone-e-setup-progetto)
12. [Struttura Progetto](#12-struttura-progetto)
13. [Deploy](#13-deploy)
14. [Comandi Utili](#14-comandi-utili)
15. [Troubleshooting](#15-troubleshooting)
16. [Risorse Utili](#16-risorse-utili)

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
brew install git bun glab gh
```

Oppure puoi usare lo script di bootstrap (vedi sezione 11).

### Cosa viene installato

| Pacchetto | Descrizione                                            |
| --------- | ------------------------------------------------------ |
| **git**   | Sistema di controllo versione                          |
| **bun**   | Runtime JavaScript ultrarapido (alternativa a Node.js) |
| **glab**  | CLI ufficiale per GitLab (gestione MR da terminale)    |
| **gh**    | CLI ufficiale per GitHub (gestione PR da terminale)    |

### Verifica installazioni

```bash
git --version    # Dovrebbe mostrare git version 2.x.x
bun --version    # Dovrebbe mostrare 1.x.x
glab --version   # Dovrebbe mostrare glab version x.x.x
gh --version     # Dovrebbe mostrare gh version x.x.x
```

---

## 4. Configurazione Git

### Imposta nome e email

Questi dati appariranno nei tuoi commit:

```bash
git config --global user.name "Il Tuo Nome"
git config --global user.email "tua.email@esempio.com"
```

**Nota**: Usa la stessa email che userai per registrarti su GitLab e GitHub.

### Genera chiave SSH

La chiave SSH ti permette di autenticarti con GitLab e GitHub senza inserire la password ogni volta.

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

La chiave pubblica è ora copiata negli appunti. La userai nei prossimi passaggi per GitLab e GitHub.

---

## 5. Registrazione GitLab

GitLab è la piattaforma principale per il controllo versione del progetto.

Se non hai già un account GitLab, creane uno:

1. Vai su [https://gitlab.com/users/sign_up](https://gitlab.com/users/sign_up)
2. Compila il form di registrazione:
   - **Username**: scegli un nome utente professionale
   - **Email**: usa la stessa email configurata in Git
   - **Password**: almeno 8 caratteri
3. Completa la verifica email
4. (Opzionale) Completa il profilo con foto e informazioni

### Aggiungi la chiave SSH

1. Vai su [GitLab → Preferences → SSH Keys](https://gitlab.com/-/user_settings/ssh_keys)
2. Clicca **Add new key**
3. Nel campo **Key**, incolla la chiave pubblica (copiata prima con `pbcopy`)
4. Nel campo **Title**, inserisci un nome descrittivo (es. "MacBook Pro - Lavoro")
5. (Opzionale) Imposta una data di scadenza
6. Clicca **Add key**

### Verifica connessione SSH

```bash
ssh -T git@gitlab.com
```

Dovresti vedere: `Welcome to GitLab, @tuousername!`

---

## 6. Registrazione GitHub

GitHub è usato per il mirroring del repository e l'integrazione con Claude Code Desktop.

Se non hai già un account GitHub, creane uno:

1. Vai su [https://github.com/signup](https://github.com/signup)
2. Compila il form di registrazione:
   - **Username**: scegli un nome utente professionale
   - **Email**: usa la stessa email configurata in Git
   - **Password**: almeno 8 caratteri
3. Completa la verifica email
4. (Opzionale) Completa il profilo con foto e informazioni

### Aggiungi la chiave SSH

1. Vai su [GitHub → Settings → SSH and GPG keys](https://github.com/settings/keys)
2. Clicca **New SSH key**
3. Nel campo **Title**, inserisci un nome descrittivo (es. "MacBook Pro - Lavoro")
4. Nel campo **Key**, incolla la chiave pubblica (la stessa usata per GitLab)
5. Clicca **Add SSH key**

### Verifica connessione SSH

```bash
ssh -T git@github.com
```

Dovresti vedere: `Hi tuousername! You've successfully authenticated...`

---

## 7. Richiesta Accesso Repository

Il repository del progetto è privato su entrambe le piattaforme. Per ottenere l'accesso:

### Repository GitLab (Principale)

- **URL**: `gitlab.com/nwdesigns/adv.nwdesigns.it`
- **Admin**: lushano.perera

### Repository GitHub (Mirror)

- **URL**: `github.com/nwdesigns/landingpages`
- **Admin**: lushano.perera

### Come richiedere l'accesso

1. Accedi sia a [GitLab](https://gitlab.com) che a [GitHub](https://github.com)
2. Contatta **lushano.perera** con le seguenti informazioni:

```
Ciao,

sono [Il Tuo Nome] e avrei bisogno dell'accesso al repository
adv.nwdesigns.it per [motivo: es. "collaborare allo sviluppo delle landing page"].

I miei username sono:
- GitLab: [il_tuo_username_gitlab]
- GitHub: [il_tuo_username_github]

Grazie!
```

### Livelli di accesso

| Livello        | Permessi                              |
| -------------- | ------------------------------------- |
| **Read**       | Solo lettura (clone, visualizzazione) |
| **Write**      | Lettura + scrittura (push, MR/PR)     |
| **Maintainer** | Tutto + gestione progetto             |

Per contribuire attivamente, richiedi il livello **Write** su entrambe le piattaforme.

---

## 8. Configurazione glab (GitLab CLI)

glab ti permette di gestire Merge Request, issue e pipeline direttamente da terminale.

### Autenticazione

```bash
glab auth login
```

Segui le istruzioni interattive:

1. **What GitLab instance do you want to log into?** → Seleziona `gitlab.com`
2. **How would you like to authenticate?** → Scegli `Token`
3. Vai su [GitLab → Access Tokens](https://gitlab.com/-/user_settings/personal_access_tokens)
4. Crea un nuovo token con scope: `api`, `read_user`, `read_repository`, `write_repository`
5. Copia il token e incollalo nel terminale

### Verifica

```bash
glab auth status
```

Dovresti vedere:

```
gitlab.com
  ✓ Logged in to gitlab.com as il_tuo_username
  ✓ Git operations for gitlab.com configured to use ssh protocol.
```

---

## 9. Configurazione gh (GitHub CLI)

gh ti permette di gestire Pull Request, issue e Actions direttamente da terminale.

### Autenticazione

```bash
gh auth login
```

Segui le istruzioni interattive:

1. **What account do you want to log into?** → Seleziona `GitHub.com`
2. **What is your preferred protocol for Git operations?** → Scegli `SSH` (consigliato)
3. **How would you like to authenticate?** → Scegli `Login with a web browser`
4. Si aprirà il browser per completare l'autenticazione
5. Copia il codice mostrato nel terminale e incollalo nel browser
6. Autorizza l'accesso e torna al terminale

### Verifica

```bash
gh auth status
```

Dovresti vedere:

```
github.com
  ✓ Logged in to github.com as il_tuo_username
  ✓ Git operations for github.com configured to use ssh protocol.
  ✓ Token: gho_****
```

---

## 10. Installazione Claude Code Desktop

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

### Integrazione con Google Chrome (Consigliato)

L'estensione Claude per Chrome permette a Claude Code di interagire direttamente con il browser per testare le landing page, fare screenshot e debug visuale.

#### Installazione Estensione Chrome

1. Apri **Google Chrome**
2. Vai sul [Chrome Web Store - Claude](https://chromewebstore.google.com/detail/claude/hbpcpokfkfaicanmepfimpijbmdnhdjp)
3. Clicca **Aggiungi a Chrome**
4. Conferma cliccando **Aggiungi estensione**
5. L'icona di Claude apparirà nella barra delle estensioni

#### Configurazione Connessione con Claude Code

Per permettere a Claude Code Desktop di controllare Chrome:

1. **Abilita l'estensione**:

   - Clicca sull'icona di Claude nella barra delle estensioni
   - Accedi con lo stesso account Anthropic usato in Claude Code Desktop

2. **Verifica la connessione**:

   - Apri Claude Code Desktop
   - L'estensione Chrome dovrebbe connettersi automaticamente
   - Puoi verificare lo stato nella barra delle estensioni (icona verde = connesso)

3. **Permessi richiesti**:
   - L'estensione richiede accesso alle schede per poter navigare e fare screenshot
   - Accetta i permessi quando richiesto

#### Cosa può fare Claude con Chrome

Una volta configurato, Claude Code può:

| Funzionalità      | Descrizione                                                     |
| ----------------- | --------------------------------------------------------------- |
| **Navigazione**   | Aprire URL e navigare tra le pagine                             |
| **Screenshot**    | Catturare screenshot delle pagine per verifica visuale          |
| **Ispezione DOM** | Analizzare la struttura HTML delle pagine                       |
| **Console**       | Leggere errori e log dalla console JavaScript                   |
| **Network**       | Monitorare richieste di rete                                    |
| **Test visuale**  | Verificare che le landing page siano renderizzate correttamente |

#### Uso pratico per questo progetto

**In ambiente locale** (dopo `bun dev`), puoi chiedere a Claude:

- _"Apri http://localhost:3000/luxury/ e fammi uno screenshot"_
- _"Verifica che il form di contatto funzioni"_
- _"Controlla se ci sono errori nella console"_
- _"Testa la versione mobile della pagina"_

**In ambiente sandbox** (es. Claude Code remoto), usa il deploy di preview:

- _"Fai un deploy preview e apri la pagina luxury"_
- _"Verifica le modifiche sul preview"_

### Integrazione con GitHub (Consigliato)

L'integrazione GitHub permette a Claude Code di creare PR, push commit e accedere al contesto del repository direttamente.

#### Installazione GitHub App per Claude Code

1. Apri **Claude Code Desktop**
2. Vai su **Settings → Integrations → GitHub**
3. Clicca **Connect GitHub**
4. Si aprirà il browser per autorizzare l'app
5. Autorizza **Claude Code GitHub App**
6. Seleziona i repository a cui dare accesso:
   - Includi `nwdesigns/landingpages`
7. Conferma e torna a Claude Code Desktop

#### Cosa può fare Claude con GitHub

Una volta configurato, Claude Code può:

| Funzionalità       | Descrizione                                |
| ------------------ | ------------------------------------------ |
| **Creare PR**      | Aprire Pull Request direttamente da Claude |
| **Push commit**    | Caricare modifiche su GitHub               |
| **Leggere codice** | Accedere al contesto del repository        |
| **Review PR**      | Commentare e revisionare Pull Request      |
| **Issue**          | Creare e gestire issue                     |

#### Uso pratico per questo progetto

Con l'integrazione GitHub, puoi chiedere a Claude:

- _"Crea una PR con le modifiche al form di contatto"_
- _"Push questi cambiamenti su GitHub"_
- _"Mostrami le PR aperte su GitHub"_

---

## 11. Clone e Setup Progetto

### Metodo Automatico (Consigliato)

Usa lo script di bootstrap che installa tutto automaticamente:

```bash
# Scarica ed esegui lo script
curl -fsSL https://gitlab.com/nwdesigns/adv.nwdesigns.it/-/raw/main/scripts/bootstrap.sh | bash
```

Oppure, se hai già clonato il progetto:

```bash
cd adv.nwdesigns.it
./scripts/bootstrap.sh
```

### Metodo Manuale

Se preferisci procedere manualmente:

```bash
# Clona il repository da GitLab
git clone git@gitlab.com:nwdesigns/adv.nwdesigns.it.git

# Entra nella cartella del progetto
cd adv.nwdesigns.it

# Aggiungi GitHub come remote secondario (per il mirroring)
git remote add github git@github.com:nwdesigns/landingpages.git

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

## 12. Struttura Progetto

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
├── .github/                  # GitHub configuration
│   └── workflows/            # GitHub Actions
│       └── sync-gitlab.yml   # Sync bidirectional GitLab ↔ GitHub
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

| Verticale        | URL Locale                              | URL Produzione                             |
| ---------------- | --------------------------------------- | ------------------------------------------ |
| Luxury           | http://localhost:3000/luxury/           | https://adv.nwdesigns.it/luxury/           |
| Automotive       | http://localhost:3000/automotive/       | https://adv.nwdesigns.it/automotive/       |
| Gold Traders     | http://localhost:3000/gold-traders/     | https://adv.nwdesigns.it/gold-traders/     |
| Watch Dealers    | http://localhost:3000/watch-dealers/    | https://adv.nwdesigns.it/watch-dealers/    |
| Private Schools  | http://localhost:3000/private-schools/  | https://adv.nwdesigns.it/private-schools/  |
| Senior Living    | http://localhost:3000/senior-living/    | https://adv.nwdesigns.it/senior-living/    |
| Family Companies | http://localhost:3000/family-companies/ | https://adv.nwdesigns.it/family-companies/ |

---

## 13. Deploy

### Tramite Claude Code Desktop (Consigliato)

Il modo più semplice per fare deploy è chiedere a Claude Code:

- _"Deploy preview"_ → esegue `./deploy.sh --preview` (per testare)
- _"Deploy to production"_ → esegue `./deploy.sh` (va live)

### Preview vs Produzione

| Tipo           | Comando                 | URL                               | Quando usarlo                     |
| -------------- | ----------------------- | --------------------------------- | --------------------------------- |
| **Preview**    | `./deploy.sh --preview` | `adv-nwdesigns-it-xxx.vercel.app` | Test, revisione, ambienti sandbox |
| **Produzione** | `./deploy.sh`           | `adv.nwdesigns.it`                | Deploy finale, va online          |

**Best practice:** Fai sempre un deploy di preview prima di andare in produzione per verificare le modifiche.

### Quando usare Preview

Il deploy di preview è particolarmente utile quando:

- **Lavori in ambiente sandbox** (es. Claude Code remoto) dove `localhost` non è accessibile
- **Vuoi condividere** le modifiche con altri prima di andare live
- **Testi su mobile** o altri dispositivi
- **Verifichi** il comportamento in un ambiente simile alla produzione

Il preview genera un URL pubblico unico che puoi aprire in qualsiasi browser.

### Setup Token Vercel

Prima di poter fare deploy, devi configurare il token Vercel:

1. Contatta **lushano.perera** per ricevere il token Vercel
2. Crea il file `.env.deployment` nella root del progetto:

```bash
echo 'VERCEL_TOKEN=il_token_ricevuto' > .env.deployment
```

**Importante**:

- Questo file è nel `.gitignore` e non verrà committato
- Non condividere mai il token con altri
- Il token è necessario sia per preview che per produzione

### Deploy da Ambienti Sandbox

Se lavori in un ambiente sandbox (es. Claude Code remoto), il file `.env.deployment` non può essere aggiunto per motivi di sicurezza. Il workflow è:

1. **Nell'ambiente sandbox**: Fai le modifiche, commit e push su GitLab/GitHub
2. **Sul tuo computer locale**: Pull delle modifiche e deploy

```bash
# Sul tuo computer locale
git pull origin <nome-branch>
./deploy.sh --preview
```

Questo garantisce che il token Vercel resti sicuro sul tuo computer locale.

### Deploy Manuale

Se preferisci fare deploy manualmente:

```bash
# Deploy di preview (per testare) - genera URL pubblico
./deploy.sh --preview

# Deploy in produzione (va live su adv.nwdesigns.it)
./deploy.sh
```

---

## 14. Comandi Utili

### Sviluppo

| Comando     | Descrizione                                      |
| ----------- | ------------------------------------------------ |
| `bun dev`   | Avvia server di sviluppo (http://localhost:3000) |
| `bun build` | Build di produzione                              |
| `bun start` | Avvia server di produzione locale                |

### Git

| Comando                     | Descrizione                 |
| --------------------------- | --------------------------- |
| `git status`                | Mostra stato modifiche      |
| `git pull`                  | Scarica ultime modifiche    |
| `git add .`                 | Aggiungi tutte le modifiche |
| `git commit -m "messaggio"` | Crea commit                 |
| `git push`                  | Carica modifiche su GitLab  |
| `git push github main`      | Push anche su GitHub        |

### GitLab (glab)

| Comando                | Descrizione                   |
| ---------------------- | ----------------------------- |
| `glab mr list`         | Lista Merge Request aperte    |
| `glab mr create`       | Crea nuova MR                 |
| `glab mr view 123`     | Visualizza MR !123            |
| `glab mr checkout 123` | Checkout branch della MR !123 |
| `glab mr merge 123`    | Merge MR !123                 |
| `glab issue list`      | Lista issue                   |
| `glab ci status`       | Stato pipeline CI/CD          |

### GitHub (gh)

| Comando              | Descrizione                   |
| -------------------- | ----------------------------- |
| `gh pr list`         | Lista Pull Request aperte     |
| `gh pr create`       | Crea nuova PR                 |
| `gh pr view 123`     | Visualizza PR #123            |
| `gh pr checkout 123` | Checkout branch della PR #123 |
| `gh pr merge 123`    | Merge PR #123                 |
| `gh issue list`      | Lista issue                   |
| `gh run list`        | Stato workflow GitHub Actions |

### Deploy

| Comando                 | Descrizione                                      |
| ----------------------- | ------------------------------------------------ |
| `./deploy.sh --preview` | Deploy di preview (genera URL pubblico per test) |
| `./deploy.sh`           | Deploy in produzione (va live)                   |

---

## 15. Troubleshooting

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

### "command not found: gh"

gh non è installato. Soluzione:

```bash
brew install gh
```

### "Permission denied (publickey)" su GitLab

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

### "Permission denied (publickey)" su GitHub

GitHub non riconosce la tua chiave SSH. Verifica:

1. La chiave è stata aggiunta su GitHub?
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
   ssh -T git@github.com
   ```

### "glab auth: error authenticating"

Problemi con l'autenticazione glab:

1. **Riprova il login**:
   ```bash
   glab auth login --hostname gitlab.com
   ```
2. **Crea un nuovo token**:
   - Vai su GitLab → Settings → Access Tokens
   - Crea un token con scope `api`, `read_user`, `read_repository`, `write_repository`
   - Usa il token durante `glab auth login`

### "gh auth: error authenticating"

Problemi con l'autenticazione gh:

1. **Riprova il login**:
   ```bash
   gh auth login --hostname github.com
   ```
2. **Usa un Personal Access Token**:
   - Vai su GitHub → Settings → Developer settings → Personal access tokens
   - Crea un token con scope `repo`, `read:org`
   - Usa il token durante `gh auth login`

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

### Le modifiche non si vedono nel browser

1. **Ricarica la pagina** con ⌘+Shift+R (hard refresh)
2. **Pulisci la cache** del browser
3. **Riavvia il server**:
   ```bash
   # Ferma con Ctrl+C, poi riavvia
   bun dev
   ```

---

## 16. Risorse Utili

### Documentazione Ufficiale

- [Next.js Documentation](https://nextjs.org/docs)
- [Bun Documentation](https://bun.sh/docs)
- [GitLab glab CLI](https://gitlab.com/gitlab-org/cli)
- [GitHub gh CLI](https://cli.github.com/manual/)
- [Claude Code Documentation](https://docs.anthropic.com/claude-code)

### Design System

Il progetto usa il design system di nwdesigns:

| Colore     | Variabile     | Valore    |
| ---------- | ------------- | --------- |
| Background | `--nw-bg`     | `#F0F0F0` |
| Foreground | `--nw-fg`     | `#2B2B2B` |
| Accent     | `--nw-accent` | `#D61313` |
| Muted      | `--nw-muted`  | `#828282` |
| Dark       | `--nw-dark`   | `#1E1E1E` |

### Font

- **Headlines**: Aktiv Grotesk Extended
- **Body**: Mulish
- **Labels**: Space Mono (uppercase)

### Contatti

Per problemi o domande:

- **Repository Admin**: lushano.perera (GitLab e GitHub)
- **Sito principale**: [nwdesigns.it](https://www.nwdesigns.it)

---

## Checklist Finale

Prima di iniziare a lavorare, verifica di aver completato tutti i passaggi:

- [ ] Homebrew installato
- [ ] Git, Bun, glab e gh installati
- [ ] Git configurato (nome, email)
- [ ] Chiave SSH generata e aggiunta a GitLab e GitHub
- [ ] Account GitLab e GitHub creati
- [ ] Accesso ai repository ottenuto (GitLab + GitHub)
- [ ] glab autenticato
- [ ] gh autenticato
- [ ] Claude Code Desktop installato
- [ ] Estensione Claude per Chrome installata e connessa
- [ ] Progetto clonato da GitLab
- [ ] Dipendenze installate (`bun install`)
- [ ] Server di sviluppo funzionante (`bun dev`)
- [ ] (Opzionale) Token Vercel ricevuto e configurato

**Buon lavoro!**

---

_Ultimo aggiornamento: Gennaio 2026_
