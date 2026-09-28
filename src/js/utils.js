import { Book, BookDetails } from './model.js'

export class Costants {
	static urlBase = 'https://openlibrary.org/subjects/##.json'
	static urlWorkBase = 'https://openlibrary.org/works/##.json'
}
export class Utils {
	static objectToJson(object) {
		return JSON.stringify(object)
	}
}
//classe di utilità per mappare gli oggetti JSON in oggetti JavaScript
export class JsonMapper {
	static async mapObject(json, type) {
		if (type === 'book') {
			return json.map(book => {
				return new Book(book.title, book.key, book.authors ? book.authors.map(author => author.name).join('|') : 'Unknown')
			});
		}
		if (type === 'bookDetails') {
			return new BookDetails(json.title, json.description ? (typeof json.description === 'string' ? json.description : json.description.value) : 'No description available')

		}
	}
}
