import { Costants } from './utils.js'
import { JsonMapper } from './utils.js'
export class SearchManager {
    async searchByTerm(term) {
        let url = Costants.urlBase.replace('##', encodeURIComponent(term))
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Ricerca non riuscita: ${response.status}`)
        }
        const data = await response.json();
        let mapped = JsonMapper.mapObject(data.works,'book')

        return  mapped
    }
    async getBookDetails(workKey) {
        const workId = workKey.replace(/^\/works\//, '')
        let url = Costants.urlWorkBase.replace('##', encodeURIComponent(workId))
        console.log('url', url)
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Dettagli libro non riusciti: ${response.status}`)
        }
        const data = await response.json();
        let mapped = JsonMapper.mapObject(data,'bookDetails')

        return mapped
    }
}

