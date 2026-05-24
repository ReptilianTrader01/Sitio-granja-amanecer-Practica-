//Index
//Resaltar enlace 
document.addEventListener("DOMContentLoaded", () => {
  const currentLocation = window.location.pathname.split("/").pop();
  const menuItems = document.querySelectorAll(".nav-links a");

  menuItems.forEach(item => {
    if(item.getAttribute("href") === currentLocation){
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
});

//Scroll suave 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

//Animación del hero al cargar
window.addEventListener("load", () => {
  const heroContent = document.querySelector(".hero-content");
  heroContent.style.opacity = 0;
  setTimeout(() => {
    heroContent.style.transition = "opacity 1.5s ease-in-out";
    heroContent.style.opacity = 1;
  }, 300);
});

//Productos
// Buscador dinámico
const buscadorInput = document.querySelector(".buscador input");
const productos = document.querySelectorAll(".producto");

buscadorInput.addEventListener("keyup", () => {
  const texto = buscadorInput.value.toLowerCase();
  productos.forEach(prod => {
    const nombre = prod.querySelector("h3").textContent.toLowerCase();
    prod.style.display = nombre.includes(texto) ? "block" : "none";
  });
});

//Filtros por categoría y precio
const filtros = document.querySelectorAll(".filtros select");

filtros.forEach(filtro => {
  filtro.addEventListener("change", () => {
    const categoria = filtros[0].value;
    const precio = filtros[1].value;

    productos.forEach(prod => {
      let mostrar = true;

      //Categoría
      if (categoria && !prod.classList.contains(categoria)) {
        mostrar = false;
      }

      //Precio 
      const precioProd = parseInt(prod.getAttribute("data-precio"));
      if (precio === "bajo" && precioProd >= 100) mostrar = false;
      if (precio === "medio" && (precioProd < 100 || precioProd > 500)) mostrar = false;
      if (precio === "alto" && precioProd <= 500) mostrar = false;

      prod.style.display = mostrar ? "block" : "none";
    });
  });
});

// Añadido al carrito
const botonesCarrito = document.querySelectorAll(".btn-carrito");

botonesCarrito.forEach(boton => {
  boton.addEventListener("click", () => {
    const producto = boton.closest(".producto");
    const nombre = producto.querySelector("h3").textContent;
    const precioTexto = producto.querySelector(".precio").textContent.replace("$","").replace("MXN","");
    const precio = parseInt(precioTexto.trim());
    const cantidad = parseInt(producto.querySelector(".cantidad").value);

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push({ nombre, precio, cantidad });
    localStorage.setItem("carrito", JSON.stringify(carrito));

    actualizarContadorCarrito();
    alert(`Agregaste ${cantidad} x ${nombre} ($${precio} MXN) al carrito`);
  });
});


function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  document.getElementById("contador-carrito").textContent = totalItems;
}

// Llamar al inicio
actualizarContadorCarrito();

//Animación hover
productos.forEach(prod => {
  prod.addEventListener("mouseenter", () => prod.classList.add("hover"));
  prod.addEventListener("mouseleave", () => prod.classList.remove("hover"));
});

//Contacto
const form = document.querySelector(".contacto-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();

  if (!nombre || !email || !mensaje) {
    alert("Por favor completa todos los campos.");
    return;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    alert("Por favor ingresa un correo válido.");
    return;
  }

  // Simulación de envío
  alert("¡Gracias por contactarnos! Te responderemos pronto.");
  form.reset();
});

// Funciones del carrito
const listaCarrito = document.getElementById("lista-carrito");
const totalPrecio = document.getElementById("total-precio");

function mostrarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  listaCarrito.innerHTML = "";
  let total = 0;

  if (carrito.length === 0) {
    listaCarrito.innerHTML = "<p>Tu carrito está vacío</p>";
    totalPrecio.textContent = "$0 MXN";
    return;
  }

  carrito.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("item-carrito");
    div.innerHTML = `
      <span>${item.cantidad} x ${item.nombre}</span>
      <span>$${item.precio} MXN</span>
      <button onclick="eliminarItem(${index})">❌</button>
    `;
    listaCarrito.appendChild(div);
    total += item.cantidad * item.precio;
  });

  totalPrecio.textContent = `$${total} MXN`;
}


function eliminarItem(index) {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

document.getElementById("btn-finalizar").addEventListener("click", () => {
  alert("¡Gracias por tu compra!");
  localStorage.removeItem("carrito");
  mostrarCarrito();
});

mostrarCarrito();



