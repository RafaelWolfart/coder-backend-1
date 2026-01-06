console.log("realTime.js funcionando");

const socket = io();

socket.on("connect", () => {
  console.log("Conectado al servidor vía WebSocket");
});

const createForm = document.getElementById("createForm");

createForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const product = {
    title: createForm.name.value,
    category: createForm.category.value,
    price: Number(createForm.price.value),
    description: "",
    code: "",
    stock: 0,
    status: true,
    thumbnails: [],
  };

  console.log("Enviando producto:", product);

  socket.emit("crearProducto", product);

  createForm.reset();
});

const deleteForm = document.getElementById("deleteForm");

if (deleteForm) {
  deleteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const productId = deleteForm.productId.value;

    console.log("Solicitando eliminación ID:", productId);

    socket.emit("eliminarProducto", productId);

    deleteForm.reset();
  });
}

socket.on("updateProducts", (products) => {
  console.log("Lista actualizada de productos:", products);

  const container = document.getElementById("products-container");
  container.innerHTML = "";

  products.forEach((p) => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <div class="product-info">
        <strong>${p.id}. ${p.title}</strong> — ${p.category}
        <span class="price">$${p.price}</span>
      </div>

      <button class="delete-btn" data-id="${p.id}">
        Eliminar
      </button>
    `;

    container.appendChild(card);
  });

  const buttons = container.querySelectorAll(".delete-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      console.log("Eliminando producto ID:", id);

      socket.emit("eliminarProducto", id);
    });
  });
});
