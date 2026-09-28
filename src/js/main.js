import '../css/style.css'
import { initSearchArea } from './view.js'
import 'bootstrap/dist/css/bootstrap.min.css'
document.querySelector('#app').innerHTML = `
<section id="center">
  <div>
    <h1>Insert a book category</h1>
    <p>and press enter</p>
  </div>
  <input type="text" id="mainSearch" />
</section>

<section id="sectionTable">
<table id="booksTable" class="table table-striped table-hover d-none">
<thead>
  <tr>
    <th>Title</th>
    <th>Author</th>
  </tr>
</thead>
<tbody id="tableBody" class="hidden">
</tbody>
</table>
</section>

<footer class="app-footer">elearning platform</footer>
`

initSearchArea(document.querySelector('#mainSearch'))



