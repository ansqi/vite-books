import { Book, BookDetails } from './model.js'

export class Costants {
	static urlBase = 'https://openlibrary.org/subjects/##.json'
	static urlWorkBase = 'https://openlibrary.org/works/##.json'
}
// utility class to map JSON objects to JavaScript objects
export class JsonMapper {
	static mapBooks(json) {
		return json.map(book => {
			return new Book(book.title, book.key, book.authors ? book.authors.map(author => author.name).join(', ') : 'Unknown')
		});
	}
	static mapBookDetails(json) {
		return new BookDetails(json.title, json.description ? (typeof json.description === 'string' ? json.description : json.description.value) : 'No description available')
	}
}
