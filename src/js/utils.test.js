import { describe, expect, test } from 'vitest'
import { Book, BookDetails } from './model.js'
import { Costants, JsonMapper, Utils } from './utils.js'

describe('Costants', () => {
	test('exposes the Open Library endpoint templates', () => {
		expect(Costants.urlBase).toBe('https://openlibrary.org/subjects/##.json')
		expect(Costants.urlWorkBase).toBe('https://openlibrary.org/works/##.json')
	})
})


describe('JsonMapper', () => {
	test('maps search results into Book instances', async () => {
		const results = JsonMapper.mapBooks([
			{
				title: 'Dune',
				key: '/works/OL893415W',
				authors: [{ name: 'Frank Herbert' }, { name: 'Another Author' }],
			},
			{
				title: 'Foundation',
				key: '/works/OL262758W',
			},
		], 'mapBooks')

		expect(results).toEqual([
			new Book('Dune', '/works/OL893415W', 'Frank Herbert, Another Author'),
			new Book('Foundation', '/works/OL262758W', 'Unknown'),
		])
		expect(results[0]).toBeInstanceOf(Book)
		expect(results[1]).toBeInstanceOf(Book)
	})

	test('maps a text description into a BookDetails instance', async () => {
		const result = JsonMapper.mapBookDetails({
			title: 'Dune',
			description: 'A science fiction novel.',
		}, 'mapBookDetails')

		expect(result).toEqual(new BookDetails('Dune', 'A science fiction novel.'))
		expect(result).toBeInstanceOf(BookDetails)
	})

})
