import { Product } from "./Product";

const serverUrl = "http://localhost:5000";

async function main() {
  registrarEventos();
  await carregarProdutos();
}
document.addEventListener("DOMContentLoaded", main);

const paginacao: { end: number; loadSize: number } = {
  end: window.innerWidth < 768 ? 4 : 9,
  loadSize: window.innerWidth < 768 ? 4 : 9,
};

const filtros = {};

async function carregarMais() {
  paginacao.end = paginacao.end + paginacao.loadSize;
  await carregarProdutos();
}

function registrarEventos() {
  //#region product event
  const btnCarregarMais = document.querySelector(".btn-carregar-mais");
  btnCarregarMais.addEventListener("click", carregarMais);
  //#endregion

  //#region dropdown events
  const dropdownButton = document.querySelector(".dropdown");
  const dropdownContent = document.querySelector(".drop");
  dropdownButton.addEventListener("click", () => {
    dropdownContent.classList.toggle("show");
  });

  document.addEventListener("mousedown", () => {
    const dropdown = document.querySelector(".drop");
    dropdown.classList.remove("show");
  });

  //#endregion

  const tamanhoItems = document.querySelectorAll(".tamanho-item");
  tamanhoItems.forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("border");
      const checkbox = item.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;
      checkbox.checked = !checkbox.checked;
    });
  });

  const menuBtn = document.querySelector(".menu-btn-mobile");
  const aside = document.querySelector("aside");

  menuBtn.addEventListener("click", () => {
    aside.classList.toggle("hide-aside");
    document.querySelector(".main-content").classList.toggle("menu-open");
  });
}

async function carregarProdutos() {
  try {
    const parametrosPag = `_start=0&_end=${paginacao.end}`;
    const response = await fetch(serverUrl + `/products?${parametrosPag}`);

    const total = response.headers.get("X-Total-Count") as unknown as number;
    const btnCarregarMais = document.querySelector(
      ".btn-carregar-mais"
    ) as HTMLElement;
    btnCarregarMais.style.display = total < paginacao.end ? "none" : "block";

    const products: Array<Product> = await response.json();
    const productDiv = document.querySelector(".produtos");

    let renderedHtml = "";
    products.forEach((x) => {
      renderedHtml += renderProductHtmlTemplate(x);
    });

    if (productDiv) {
      productDiv.innerHTML = renderedHtml;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

function renderProductHtmlTemplate(produto: Product) {
  return `
    <div class="card-produto">
      <img src="${produto.image}" alt="${produto.name}"/>
      <h4>${produto.name}</h4>
      <span>R$ ${produto.price.toFixed(2).replace(".", ",")}</span>
      <p>até ${produto.parcelamento[0]}x de R$ ${produto.parcelamento[1]
    .toFixed(2)
    .replace(".", ",")}</p>
      <button>
        <p>COMPRAR</p>
      </button>
    </div>
  `;
}
