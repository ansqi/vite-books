# Vite Books

Applicazione web per cercare libri per categoria usando l'API di [Open Library](https://openlibrary.org/). I risultati mostrano titolo e autori; selezionando un titolo vengono caricati i dettagli disponibili e mostrati in una modale.

## Tecnologie

- JavaScript con moduli ES
- [Vite](https://vite.dev/) per sviluppo e build
- [Bootstrap 5](https://getbootstrap.com/) per componenti e stili
- Open Library API per i dati dei libri

## Prerequisiti

- Node.js
- npm

## Installazione e avvio

Dalla cartella principale del progetto:

```bash
npm install
npm run dev
```

Vite avvia il server di sviluppo e mostra nel terminale l'indirizzo locale da aprire nel browser.

## Comandi disponibili

```bash
npm run dev      # avvia il server di sviluppo
npm run build    # crea la build di produzione nella cartella dist/
npm run preview  # serve localmente la build di produzione
```

Per provare la build con `npm run preview`, eseguire prima `npm run build`.

## Utilizzo

1. Inserire una categoria di libri nel campo di ricerca.
2. Premere Invio per caricare i risultati.
3. Selezionare il titolo di un libro per aprire la modale con i dettagli.

La disponibilità dei risultati e delle descrizioni dipende dai dati forniti da Open Library.

## pubblicazione online
[Link alla pubblicazione](https://jsadvancedasqui.netlify.app/)

## Struttura del progetto

```text
.
├── index.html
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── assets/
    ├── css/
    │   └── style.css
    └── js/
        ├── main.js
        ├── ui.js
        ├── bookService.js
        ├── model.js
        └── utils.js
```

## Organizzazione del codice

- `main.js` importa gli stili, prepara il markup iniziale e inizializza la vista.
- `ui.js` gestisce gli eventi dell'interfaccia, la tabella dei risultati, il loader e la modale.
- `bookService.js` contiene `SearchManager`, che interroga gli endpoint Open Library e gestisce gli errori HTTP.
- `model.js` definisce i modelli `Book` e `BookDetails`.
- `utils.js` raccoglie gli URL, le utility e `JsonMapper`, che trasforma le risposte dell'API nei modelli dell'applicazione.
- `style.css` contiene gli stili personalizzati.

La ricerca usa l'endpoint `/subjects/{categoria}.json`; i dettagli di un'opera sono richiesti tramite `/works/{id}.json`.
