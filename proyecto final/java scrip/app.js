let productos = [], carrito = [], grafico;

fetch("json/productos.json")
    .then(r => r.json())
    .then(data => {
        productos = data;
        mostrar(productos, "productos");
        mostrar(productos.slice(0, 3), "destacados");
        dashboard();
    });

function verSeccion(id) {
    ["sec-inicio", "sec-tienda", "sec-nosotros", "sec-dashboard", "sec-contacto"].forEach(s => {
        document.getElementById(s).style.display = s === id ? "block" : "none";
    });
}

function irCarrito() {
    verSeccion('sec-tienda');
    document.getElementById('caja-carrito').scrollIntoView({ behavior: 'smooth' });
}

function mostrar(lista, contenedor) {
    document.getElementById(contenedor).innerHTML = lista.map(p => `
        <div class="card" style="color:white;">
            <img src="${p.imagen}">
            <h4>${p.nombre}</h4>
            <p style="font-size:13px;">${p.descripcion}</p>
            <p><b>Bs. ${p.precio}</b></p>
            <p style="font-size:12px;">Categoria: ${p.categoria}<br>Stock: ${p.stock}</p>
            <button onclick="verDetalle(${p.id})">Ver detalles</button>
            <button onclick="agregar(${p.id})">Agregar</button>
        </div>
    `).join("");
}

function verDetalle(id) {
    const p = productos.find(x => x.id === id);
    alert("Producto: " + p.nombre + "\nDetalle: " + p.descripcion + "\nCategoria: " + p.categoria + "\nPrecio: Bs. " + p.precio + "\nStock: " + p.stock);
}

function filtrar() {
    const txt = document.getElementById("buscador").value.toLowerCase();
    const cat = document.getElementById("categoria").value;
    mostrar(productos.filter(p => p.nombre.toLowerCase().includes(txt) && (cat === "Todas" || p.categoria === cat)), "productos");
}

function agregar(id) {
    const p = productos.find(x => x.id === id);
    if (p && p.stock > 0) {
        p.stock--;
        carrito.push(p);
        filtrar();
        mostrar(productos.slice(0, 3), "destacados");
        renderCarrito();
        dashboard();
    }
}

function renderCarrito() {
    document.getElementById("carrito").innerHTML = carrito.map((p, i) => 
        `<li>${p.nombre} - Bs. ${p.precio} <button onclick="quitar(${i})">X</button></li>`
    ).join("");
    document.getElementById("total").textContent = carrito.reduce((s, p) => s + p.precio, 0);
    document.getElementById("cant-carrito").textContent = carrito.length;
}

function quitar(i) {
    productos.find(x => x.id === carrito[i].id).stock++;
    carrito.splice(i, 1);
    filtrar();
    mostrar(productos.slice(0, 3), "destacados");
    renderCarrito();
    dashboard();
}

function comprar() {
    if (carrito.length === 0) {
        alert("El carrito esta vacio");
    } else {
        alert("¡Compra realizada con exito! Total pagado: Bs. " + document.getElementById("total").textContent);
        carrito = [];
        renderCarrito();
    }
}

function vaciar() {
    carrito.forEach(item => productos.find(x => x.id === item.id).stock++);
    carrito = [];
    filtrar();
    mostrar(productos.slice(0, 3), "destacados");
    renderCarrito();
    dashboard();
}

function dashboard() {
    document.getElementById("d-cant").textContent = productos.length;
    document.getElementById("d-stock").textContent = productos.reduce((s, p) => s + p.stock, 0);
    document.getElementById("d-prom").textContent = (productos.reduce((s, p) => s + p.precio, 0) / productos.length).toFixed(0);
    
    if (grafico) grafico.destroy();
    grafico = new Chart(document.getElementById("grafico"), {
        type: "bar",
        data: {
            labels: productos.map(p => p.nombre),
            datasets: [{ label: "Stock", data: productos.map(p => p.stock), backgroundColor: "#7C3AED" }]
        }
    });
}

function validar(e) {
    e.preventDefault();
    const n = document.getElementById("nombre").value;
    const c = document.getElementById("correo").value;
    const cel = document.getElementById("celular").value;
    const a = document.getElementById("asunto").value;
    const m = document.getElementById("mensaje").value;
    document.getElementById("aviso").textContent = (n && c.includes("@") && cel && a && m) ? "Mensaje enviado correctamente" : "Por favor completa todos los campos";
}

