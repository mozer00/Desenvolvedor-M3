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

function aplicarFiltro(type: string, value: any) {
  switch (type) {
    case "color":
      if (filtroSelecionado.colors.includes(value)) {
        filtroSelecionado.colors = filtroSelecionado.colors.filter(
          (c) => c !== value
        );
      } else {
        filtroSelecionado.colors.push(value);
      }
      break;
    case "size":
      if (filtroSelecionado.sizes.includes(value)) {
        filtroSelecionado.sizes = filtroSelecionado.sizes.filter(
          (t) => t !== value
        );
      } else {
        filtroSelecionado.sizes.push(value);
      }
      break;
    case "price":
      if (filtroSelecionado.prices.find((p) => p.id === value.id)) {
        filtroSelecionado.prices = filtroSelecionado.prices.filter(
          (p) => p.id !== value.id
        );
      } else {
        filtroSelecionado.prices.push(value);
      }
      break;
  }
  carregarProdutos();
}

const filtros = {
  colors: [
    "Amarelo",
    "Azul",
    "Branco",
    "Cinza",
    "Laranja",
    "Verde",
    "Vermelho",
    "Preto",
    "Rosa",
    "Vinho",
  ],
  sizes: ["P", "M", "G", "GG", "U", "36", "38", "40", "42", "44", "46"],
  prices: [
    { id: 1, max: 50 },
    { id: 2, min: 51, max: 150 },
    { id: 3, min: 151, max: 300 },
    { id: 4, min: 301, max: 500 },
    { id: 5, min: 501 },
  ],
};
const filtroSelecionado = {
  colors: Array<string>(),
  sizes: Array<string>(),
  prices: Array<{ id: number; min: number; max: number }>(),
};
const ordenacao = {
  sort: "",
  order: "",
};

async function carregarMais() {
  paginacao.end += paginacao.loadSize;
  await carregarProdutos();
}

function adicionarEvento(
  identificador: string,
  acao: (e: Event | any | undefined) => void,
  evento: string = "click"
) {
  const el = document.querySelector(identificador);
  if (el) {
    el.addEventListener(evento, acao);
  }
}

function registrarEventos() {
  adicionarEvento(".btn-carregar-mais", carregarMais);

  adicionarEvento(".dropdown", (e) => {
    e.stopPropagation();
    const dropdownContent = document.querySelector(".drop");
    dropdownContent.classList.toggle("show");
  });

  document.addEventListener("click", () => {
    const dropdownContent = document.querySelector(".drop");
    dropdownContent.classList.remove("show");
  });

  adicionarEvento(".drop", (e) => {
    const el = e.target as HTMLElement;
    e.stopPropagation();
    const dropdownContent = document.querySelector(".drop");
    dropdownContent.classList.remove("show");
    (document.querySelector("#selected-order") as HTMLElement).innerText =
      el.getAttribute("data-name");
    adicionarOrdenacao(
      el.getAttribute("data-sort"),
      el.getAttribute("data-order")
    );
  });

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

  filtros.colors.forEach((fc: string) => {
    adicionarEvento(
      ".filtro-cor-" + fc,
      () => aplicarFiltro("color", fc),
      "change"
    );
  });

  filtros.sizes.forEach((ft: string) => {
    adicionarEvento(
      ".filtro-tamanho-" + ft,
      () => aplicarFiltro("size", ft),
      "change"
    );
  });

  filtros.prices.forEach((fp: any) => {
    adicionarEvento(
      ".filtro-preco-" + fp.id,
      () => aplicarFiltro("price", fp),
      "change"
    );
  });

  const orderMobile = document.querySelectorAll(".order-by-mobile .order-btn");
  orderMobile.forEach((item) => {
    item.addEventListener("click", () => {
      (document.querySelector("#selected-order") as HTMLElement).innerText =
        item.getAttribute("data-name");
      adicionarOrdenacao(
        item.getAttribute("data-sort"),
        item.getAttribute("data-order")
      );
      document.querySelector(".order-by-mobile").classList.remove("open");
    });
  });

  const openMobilefilter = () => {
    (document.querySelector(".aside") as HTMLElement).classList.add("open");
    adicionarEvento(".action-btn-filter-mobile .close-icon", () => {
      (document.querySelector(".aside") as HTMLElement).classList.remove(
        "open"
      );
    });
  };
  adicionarEvento("#filterButton", openMobilefilter);

  const verifyIfButtonsNeeded = () => {
    let filtroAberto = false;
    const listasFiltros = [
      ".lista-container-cores",
      ".lista-container-tamanhos",
      ".lista-container-precos",
    ];
    for (const f of listasFiltros) {
      const el = document.querySelector(f) as HTMLElement;
      if (el.classList.contains("open")) {
        filtroAberto = true;
        break;
      }
    }
    return filtroAberto;
  };

  const openMobileorder = () => {
    (document.querySelector(".order-by-mobile") as HTMLElement).classList.add(
      "open"
    );
    adicionarEvento(".order-by-mobile .close-icon", () => {
      (
        document.querySelector(".order-by-mobile") as HTMLElement
      ).classList.remove("open");
    });
  };
  adicionarEvento("#orderButton", openMobileorder);

  const aplicar = () => {
    const asideMobile = document.querySelector(".aside");
    asideMobile.classList.remove("open");
  };

  adicionarEvento(".aplicar", aplicar);

  adicionarEvento(".limpar", limparFiltros);

  const openOrHideButtonsMobileFilter = () => {
    const buttonsMobile = document.querySelector(".btn-busca") as HTMLElement;
    if (verifyIfButtonsNeeded()) {
      buttonsMobile.classList.add("show");
    } else {
      buttonsMobile.classList.remove("show");
    }
  };
  adicionarEvento(".title-colors", () => {
    document.querySelector(".lista-container-cores").classList.toggle("open");
    openOrHideButtonsMobileFilter();
  });
  adicionarEvento(".title-sizes", () => {
    document
      .querySelector(".lista-container-tamanhos")
      .classList.toggle("open");
    openOrHideButtonsMobileFilter();
  });
  adicionarEvento(".title-prices", () => {
    document.querySelector(".lista-container-precos").classList.toggle("open");
    openOrHideButtonsMobileFilter();
  });

  const list = document.querySelector(".lista-container-cores");
  const showMore = document.querySelector(".btn-all-colors");
  const items = list.getElementsByTagName("li");

  Array.from(items).forEach((item, index) => {
    if (index >= 5) {
      item.style.display = "none";
    }
  });

  showMore.addEventListener("click", function () {
    Array.from(items).forEach((items, index) => {
      items.style.display = "block";
    });
    (showMore as HTMLElement).style.display = "none";
  });
}

function limparFiltros() {
  filtros.colors.forEach((color) => {
    const input = document.querySelector(
      `.filtro-cor-${color}`
    ) as HTMLInputElement;
    if (input) {
      input.checked = false;
    }
  });

  const tamanhoItems = document.querySelectorAll(".tamanho-item");
  tamanhoItems.forEach((item) => {
    item.classList.remove("border");
    const checkbox = item.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;
    checkbox.checked = false;
  });

  filtros.prices.forEach((price) => {
    const input = document.querySelector(
      `.filtro-preco-${price.id}`
    ) as HTMLInputElement;
    if (input) {
      input.checked = false;
    }
  });

  filtroSelecionado.colors = [];
  filtroSelecionado.sizes = [];
  filtroSelecionado.prices = [];

  carregarProdutos();
}

function adicionarOrdenacao(sort: string, order: string) {
  ordenacao.sort = sort;
  ordenacao.order = order;
  carregarProdutos();
}

function gerarFiltrosParametros() {
  let parametros = "";

  filtroSelecionado.colors.forEach((cor) => {
    parametros += `&color=${cor}`;
  });

  filtroSelecionado.sizes.forEach((tamanho) => {
    parametros += `&size_like=${tamanho}`;
  });

  filtroSelecionado.prices.forEach((preco) => {
    if (preco.min) {
      parametros += `&price_gte=${preco.min}`;
    }
    if (preco.max) {
      parametros += `&price_lte=${preco.max}`;
    }
  });
  return parametros;
}

function gerarOrdenacaoParametros() {
  let parametrosOrdenacao = "";

  if (ordenacao.sort) {
    parametrosOrdenacao += `&_sort=${ordenacao.sort}`;
  }
  if (ordenacao.order) {
    parametrosOrdenacao += `&_order=${ordenacao.order}`;
  }

  return parametrosOrdenacao;
}

function gerarPaginacaoParametros() {
  let parametrosPaginacao = "_start=0";

  if (paginacao.end) {
    parametrosPaginacao += `&_end=${paginacao.end}`;
  }

  return parametrosPaginacao;
}
async function carregarProdutos() {
  try {
    const parametrosPaginacao = gerarPaginacaoParametros();
    const parametrosOrdenacao = gerarOrdenacaoParametros();
    const parametrosFiltro = gerarFiltrosParametros();
    const response = await fetch(
      serverUrl +
        `/products?${parametrosPaginacao}${parametrosFiltro}${parametrosOrdenacao}`
    );
    const total = response.headers.get("X-Total-Count") as unknown as number;
    const btnCarregarMais = document.querySelector(
      ".btn-carregar-mais"
    ) as HTMLElement;
    btnCarregarMais.style.display = total < paginacao.end ? "none" : "block";

    const products: Array<Product> = await response.json();
    const productDiv = document.querySelector(".produtos");

    let renderedHtml = "";
    products.forEach((x) => {
      renderedHtml += renderizarProdutoHtml(x);
    });

    if (productDiv) {
      productDiv.innerHTML = renderedHtml;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}
function renderizarProdutoHtml(produto: Product) {
  return `
    <div class="card-produto">
      <img src="${produto.image}" alt="${produto.name}"/>
      <h4>${produto.name}</h4>
      <span>R$ ${produto.price.toFixed(2).replace(".", ",")}</span>
      <p class='parcelamento'>até ${
        produto.parcelamento[0]
      }x de R$ ${produto.parcelamento[1].toFixed(2).replace(".", ",")} </p>
      <button onclick="adicionarAoCarrinho()">
        <p>COMPRAR</p>
      </button>
    </div>
  `;
}

const carrinho = {
  totalItens: 0,
};
function adicionarAoCarrinho() {
  const elementoCarrinho = document.querySelector(
    ".numero-carrinho"
  ) as HTMLElement;
  carrinho.totalItens++;
  elementoCarrinho.innerText = carrinho.totalItens as unknown as string;
}
(window as any).adicionarAoCarrinho = adicionarAoCarrinho;
