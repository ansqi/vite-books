import { Costants } from './utils.js'
import { JsonMapper } from './utils.js'
export class SearchManager {
  currentAbortController = null;

  async searchByTerm(term) {
    // Abort any ongoing search request
    this.currentAbortController?.abort();
    const abortController = new AbortController();
    this.currentAbortController = abortController;
    let url = Costants.urlBase.replace("##", encodeURIComponent(term));
    try {
      const response = await fetch(url, {
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }
      const data = await response.json();
      return JsonMapper.mapBooks(data.works);
    } finally {
      if (this.currentAbortController === abortController) {
        this.currentAbortController = null;
      }
    }
  }
  async getBookDetails(workKey) {
        const workId = workKey.replace(/^\/works\//, '')
        let url = Costants.urlWorkBase.replace('##', encodeURIComponent(workId))
        const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Book details failed: ${response.status}`);
    }
    const data = await response.json();
    let mapped = JsonMapper.mapBookDetails(data);

    return mapped;
  }
}
