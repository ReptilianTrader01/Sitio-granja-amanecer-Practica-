//Index
//Resaltar enlace 
document.addEventListener("DOMContentLoaded", () => {
  const currentLocation = window.location.pathname.split("/").pop();
  const menuItems = document.querySelectorAll(".nav-links a");

  menuItems.forEach(item => {
    if (item.getAttribute("href") === currentLocation) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
});

//Scroll suave 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
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

if (buscadorInput) {
  buscadorInput.addEventListener("keyup", () => {
    const texto = buscadorInput.value.toLowerCase();

    productos.forEach(prod => {
      const nombre = prod.querySelector("h3").textContent.toLowerCase();
      prod.style.display = nombre.includes(texto) ? "block" : "none";
    });
  });
}

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
    const precioTexto = producto.querySelector(".precio").textContent.replace("$", "").replace("MXN", "");
    const precio = parseInt(precioTexto.trim());
    const cantidad = parseInt(producto.querySelector(".cantidad").value);
    const imagen = producto.querySelector("img").src;

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push({ nombre, precio, cantidad, imagen });
    localStorage.setItem("carrito", JSON.stringify(carrito));

    actualizarContadorCarrito();
    alert(`Agregaste ${cantidad} x ${nombre} ($${precio} MXN) al carrito`);
  });
});


function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const contador = document.getElementById("contador-carrito");

  if (contador) {
    contador.textContent = totalItems;
  }
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
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    limpiarErrores();
    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const mensaje = document.getElementById("mensaje");
    let valido = true;

    /* Nombre */
    if (nombre.value.trim() === "") {
      mostrarError(nombre, "error-nombre", "Ingresa tu nombre");
      valido = false;
    }
    else if (
      !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(nombre.value)) {
      mostrarError(nombre, "error-nombre", "Solo se permiten letras");
      valido = false;
    }
    else if (nombre.value.trim().length < 3) {
      mostrarError(nombre, "error-nombre", "Debe tener mínimo 3 caracteres");
      valido = false;
    } else {
      correcto(nombre);
    }

    /* Email */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === "") {
      mostrarError(
        email,"error-email","Ingresa un correo");
      valido = false;
    }
    else if (!emailRegex.test(email.value)) {
      mostrarError(email,"error-email","Correo inválido");
      valido = false;
    } else {
      correcto(email);
    }

    /* Mensaje */
    if (mensaje.value.trim() === "") {
      mostrarError(mensaje,"error-mensaje","Escribe un mensaje");
      valido = false;
    }
    else if (mensaje.value.trim().length < 10) {
      mostrarError(mensaje,"error-mensaje","Debe contener al menos 10 caracteres");
      valido = false;
    } else {
      correcto(mensaje);
    }

    /* Enviar */
    if (valido) {
      alert("¡Gracias por contactarnos!");
      form.reset();
      document.querySelectorAll(".correcto").forEach(campo => campo.classList.remove("correcto"));
    }
  });
  function mostrarError(input,id,mensaje) {
    document.getElementById(id).textContent = mensaje;
      input.classList.add("input-error");
  }
  function correcto(input) {
    input.classList.add("correcto");
  }
  function limpiarErrores() {
    document.querySelectorAll(".error").forEach(e => e.textContent = "");
    document.querySelectorAll("input,textarea").forEach(campo => {
      campo.classList.remove("input-error", "correcto");
    });
  }
}

// Funciones del carrito
const listaCarrito = document.getElementById("lista-carrito");
function mostrarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const agrupados = {};
  carrito.forEach(item => {
    if (agrupados[item.nombre]) {
      agrupados[item.nombre].cantidad += item.cantidad;
    } else {
      agrupados[item.nombre] = {
        ...item,
        imagen: item.imagen || "Recursos/default.png"
      };
    }
  });

  listaCarrito.innerHTML = "";
  let subtotal = 0;
  let totalItems = 0;
  Object.values(agrupados).forEach((item, index) => {
    subtotal += item.precio * item.cantidad;
    totalItems += item.cantidad;
    listaCarrito.innerHTML += `
<div class="item-carrito">
<div class="item-info">
<img src="${item.imagen}">
<div>
<h3>${item.nombre}</h3>
<p>$${item.precio} MXN c/u</p>
</div>
</div>
<div class="controles">
<button onclick="cambiarCantidad('${item.nombre}',-1)">
−
</button>
<span>${item.cantidad}</span>
<button onclick="cambiarCantidad('${item.nombre}',1)">
+</button>
</div>
<h2>$${item.precio * item.cantidad} MXN</h2>
<button
class="eliminar"
onclick="eliminarProducto('${item.nombre}')">🗑️</button></div>`;
  });
  document.getElementById("productos-unicos").textContent = Object.keys(agrupados).length;
  document.getElementById("cantidad-total").textContent = totalItems;
  document.getElementById("subtotal").textContent = `$${subtotal} MXN`;
  document.getElementById("total-precio").textContent = `$${subtotal} MXN`;
}

function cambiarCantidad(nombre, cambio) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const producto = carrito.find(p => p.nombre === nombre);
  if (!producto) return;
  producto.cantidad += cambio;
  if (producto.cantidad <= 0) {
    carrito = carrito.filter(p => p.nombre !== nombre);
  }

  localStorage.setItem("carrito",JSON.stringify(carrito));
  mostrarCarrito();
}

function eliminarProducto(nombre) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito = carrito.filter(p => p.nombre !== nombre);
  localStorage.setItem("carrito",JSON.stringify(carrito));
  mostrarCarrito();
}

mostrarCarrito();



