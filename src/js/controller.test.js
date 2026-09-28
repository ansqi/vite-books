import { afterEach, describe, expect, test, vi } from 'vitest'
import { SearchManager } from './controller.js'
import { Book, BookDetails } from './model.js'

afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
})

describe('SearchManager', () => {
    test('cerca per categoria e mappa i risultati in libri', async () => {
        const response = {
            ok: true,
            json: vi.fn().mockResolvedValue({
                works: [
                    {
                        title: 'Dune',
                        key: '/works/OL893415W',
                        authors: [{ name: 'Frank Herbert' }],
                    },
                ],
            }),
        }
        const fetchMock = vi.fn().mockResolvedValue(response)
        vi.stubGlobal('fetch', fetchMock)

        const result = await new SearchManager().searchByTerm('science fiction')

        expect(fetchMock).toHaveBeenCalledWith(
            'https://openlibrary.org/subjects/science%20fiction.json',
        )
        expect(response.json).toHaveBeenCalledOnce()
        expect(result).toEqual([
            new Book('Dune', '/works/OL893415W', 'Frank Herbert'),
        ])
    })

    test('segnala un errore HTTP durante la ricerca', async () => {
        const response = { ok: false, status: 503, json: vi.fn() }
        const fetchMock = vi.fn().mockResolvedValue(response)
        vi.stubGlobal('fetch', fetchMock)

        await expect(new SearchManager().searchByTerm('fantasy'))
            .rejects.toThrow('Ricerca non riuscita: 503')
        expect(response.json).not.toHaveBeenCalled()
    })

    test("carica i dettagli usando la chiave dell'opera e li mappa", async () => {
        const response = {
            ok: true,
            json: vi.fn().mockResolvedValue({
                title: 'Dune',
                description: { value: 'A science fiction novel.' },
            }),
        }
        const fetchMock = vi.fn().mockResolvedValue(response)
        vi.stubGlobal('fetch', fetchMock)
        vi.spyOn(console, 'log').mockImplementation(() => {})

        const result = await new SearchManager().getBookDetails('/works/OL893415W')

        expect(fetchMock).toHaveBeenCalledWith(
            'https://openlibrary.org/works/OL893415W.json',
        )
        expect(response.json).toHaveBeenCalledOnce()
        expect(result).toEqual(new BookDetails('Dune', 'A science fiction novel.'))
    })

})