import { describe, expect, test } from 'vitest'
import { Book, BookDetails } from './model.js'
import { Costants, JsonMapper, Utils } from './utils.js'

describe('Costants', () => {
	test('espone i template degli endpoint Open Library', () => {
		expect(Costants.urlBase).toBe('https://openlibrary.org/subjects/##.json')
		expect(Costants.urlWorkBase).toBe('https://openlibrary.org/works/##.json')
	})
})

describe('Utils', () => {
	test('serializza un oggetto in JSON', () => {
		const value = { title: 'Dune', pages: 412 }

		expect(Utils.objectToJson(value)).toBe('{"title":"Dune","pages":412}')
	})
})

describe('JsonMapper', () => {
	test('mappa i risultati della ricerca in istanze Book', async () => {
		const results = await JsonMapper.mapObject([
			{
				title: 'Dune',
				key: '/works/OL893415W',
				authors: [{ name: 'Frank Herbert' }, { name: 'Another Author' }],
			},
			{
				title: 'Foundation',
				key: '/works/OL262758W',
			},
		], 'book')

		expect(results).toEqual([
			new Book('Dune', '/works/OL893415W', 'Frank Herbert|Another Author'),
			new Book('Foundation', '/works/OL262758W', 'Unknown'),
		])
		expect(results[0]).toBeInstanceOf(Book)
		expect(results[1]).toBeInstanceOf(Book)
	})

	test('mappa una descrizione testuale in un’istanza BookDetails', async () => {
		const result = await JsonMapper.mapObject({
			title: 'Dune',
			description: 'A science fiction novel.',
		}, 'bookDetails')

		expect(result).toEqual(new BookDetails('Dune', 'A science fiction novel.'))
		expect(result).toBeInstanceOf(BookDetails)
	})

})
