import { SearchManager } from './controller.js'
import { Modal } from 'bootstrap'
const searchManager = new SearchManager()

export function initSearchArea(element) {
    const loadingOverlay = document.createElement('div')
    loadingOverlay.className = 'details-loading-overlay'
    loadingOverlay.hidden = true
    loadingOverlay.setAttribute('role', 'status')
    loadingOverlay.setAttribute('aria-live', 'polite')
    loadingOverlay.innerHTML = `
        <span class="spinner-border text-light" aria-hidden="true"></span>
        <span class="visually-hidden">Caricamento dettagli del libro</span>
    `
    document.body.appendChild(loadingOverlay)

    const modalElement = document.createElement('div')
    modalElement.className = 'modal fade'
    modalElement.tabIndex = -1
    modalElement.setAttribute('aria-labelledby', 'bookDetailsModalLabel')
    modalElement.setAttribute('aria-hidden', 'true')
    modalElement.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title fs-5" id="bookDetailsModalLabel"></h2>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Chiudi"></button>
                </div>
                <div class="modal-body"></div>
            </div>
        </div>
    `
    // aggiungo al body la modale per i dettagli del libro, che sarà gestita da Bootstrap
    document.body.appendChild(modalElement)
    const detailsModal = new Modal(modalElement)
    const modalTitle = modalElement.querySelector('.modal-title')
    const modalBody = modalElement.querySelector('.modal-body')

    //un piccolo loader per la ricerca, che sarà mostrato solo durante la ricerca
    const loader = document.createElement('span')
    loader.className = 'search-loader'
    loader.hidden = true
    loader.setAttribute('role', 'status')
    loader.setAttribute('aria-label', 'Ricerca in corso')

    const searchButton = document.createElement('button')
    searchButton.type = 'button'
    searchButton.className = 'btn btn-primary btn-sm'
    searchButton.textContent = 'Cerca'
    searchButton.addEventListener('click', async () => {
        const term = element.value.trim()
        if (term) {
            await launchSearch(term)
        }
    })
    const searchControls = document.createElement('div')
    searchControls.className = 'search-controls input-group input-group-sm'
    element.classList.add('form-control')
    element.before(searchControls)
    searchControls.append(element, searchButton)
    searchControls.insertAdjacentElement('afterend', loader)

    const launchSearch = async (term) => {
        element.setAttribute('aria-busy', 'true')
        loader.hidden = false
        try {
            let booksFoundMapped = await searchManager.searchByTerm(term)
            reloadTable(booksFoundMapped)
        } finally {
            element.removeAttribute('aria-busy')
            loader.hidden = true
        }
    }

    element.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter' && element.value.trim()) {
            await launchSearch(element.value.trim())
        }
    });

    function reloadTable(books) {
        //mostro la tabella alla prima interrogazione
        document.getElementById('booksTable').classList.remove('d-none');

        const tableBody = document.querySelector('#tableBody')
        tableBody.innerHTML = ''
        if (books.length === 0) {
            const row = document.createElement('tr')
            const cell = document.createElement('td')
            cell.colSpan = 2
            cell.textContent = 'No books found'
            row.appendChild(cell)
            tableBody.appendChild(row)
        } else {
            books.forEach(book => {
                const row = document.createElement('tr')
                const titleCell = document.createElement('td')
                const link = document.createElement('a')
                link.href = '#'
                titleCell.addEventListener('click', (event) => {
                    event.preventDefault()
                    openBookDetails(book.key)
                })
                link.textContent = book.title
                titleCell.appendChild(link)
                const authorCell = document.createElement('td')
                authorCell.textContent = book.author
                row.appendChild(titleCell)
                row.appendChild(authorCell)
                tableBody.appendChild(row)
            })
        }
    }
    const openBookDetails = async (workKey) => {
        loadingOverlay.hidden = false
        document.querySelector('#app').inert = true

        try {
            const bookMapped = await searchManager.getBookDetails(workKey)
            modalTitle.textContent = bookMapped.title || 'Dettagli del libro'
            modalBody.textContent = typeof bookMapped.description === 'string'
                ? bookMapped.description
                : bookMapped.description?.value || 'Nessuna descrizione disponibile'
        } catch (error) {
            modalTitle.textContent = 'Errore'
            modalBody.textContent = `Impossibile caricare i dettagli del libro: ${error.message}`
        } finally {
            document.querySelector('#app').inert = false
            loadingOverlay.hidden = true
        }

        detailsModal.show()
    }
}