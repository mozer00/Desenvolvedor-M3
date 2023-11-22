import { Product } from "./Product";

const serverUrl = "http://localhost:5000";

async function main() {
  await loadProducts();


  const dropdownButton = document.querySelector('.dropdown');
  const dropdownContent = document.querySelector('.drop');
  dropdownButton.addEventListener('click', () => {
    dropdownContent.classList.toggle('show');
  });

}
document.addEventListener("DOMContentLoaded", main);

async function loadProducts() {
  const response = await fetch(serverUrl + "/products");
  const products: Array<Product> = await response.json();
  const productDiv = document.querySelector('.produtos');

  let renderedHtml = "";
  products.forEach(x => {
    renderedHtml += renderproductHtmlTemplate(x);
  });

  productDiv.innerHTML = renderedHtml;
}

function renderproductHtmlTemplate(produto: Product) {
  return `
  <div class="card-produto">
    <img src="${produto.image}" alt="${produto.name}"/>
    <h4>${produto.name}</h4>
    <span>R$ ${produto.price.toFixed(2).replace('.', ',')}</span>
    <p>até ${produto.parcelamento[0]}x de R$ ${produto.parcelamento[1].toFixed(2).replace('.', ',')}</p>
    <button>
      <p>COMPRAR</p>
    </button>
  </div>
  `
}

const dropdownButton = document.querySelector('.dropdown');
const dropdownContent = document.querySelector('.dropdown-content');

dropdownButton.addEventListener('click', () => {
  dropdownContent.classList.toggle('show');
});



