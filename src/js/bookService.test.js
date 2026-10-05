import { afterEach, describe, expect, test, vi } from 'vitest'
import { SearchManager } from './bookService.js'
import { Book, BookDetails } from './model.js'

afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
})

describe('SearchManager', () => {
    test('searches by category and maps results to books', async () => {
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
            { signal: expect.any(AbortSignal) },
        )
        expect(response.json).toHaveBeenCalledOnce()
        expect(result).toEqual([
            new Book('Dune', '/works/OL893415W', 'Frank Herbert'),
        ])
    })

    test('reports an HTTP error during search', async () => {
        const response = { ok: false, status: 503, json: vi.fn() }
        const fetchMock = vi.fn().mockResolvedValue(response)
        vi.stubGlobal('fetch', fetchMock)

        await expect(new SearchManager().searchByTerm('fantasy'))
            .rejects.toThrow('Search failed: 503')
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