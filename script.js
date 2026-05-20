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

// 2. Filtros por categoría y precio
const filtros = document.querySelectorAll(".filtros select");

filtros.forEach(filtro => {
  filtro.addEventListener("change", () => {
    const categoria = filtros[0].value;
    const precio = filtros[1].value;

    productos.forEach(prod => {
      let mostrar = true;

      // Categoría
      if (categoria && !prod.classList.contains(categoria)) {
        mostrar = false;
      }

      // Precio (ejemplo con data-atributos)
      const precioProd = parseInt(prod.getAttribute("data-precio"));
      if (precio === "bajo" && precioProd >= 100) mostrar = false;
      if (precio === "medio" && (precioProd < 100 || precioProd > 500)) mostrar = false;
      if (precio === "alto" && precioProd <= 500) mostrar = false;

      prod.style.display = mostrar ? "block" : "none";
    });
  });
});

// 3. Animación hover (solo con CSS, pero JS puede añadir clases)
productos.forEach(prod => {
  prod.addEventListener("mouseenter", () => prod.classList.add("hover"));
  prod.addEventListener("mouseleave", () => prod.classList.remove("hover"));
});
