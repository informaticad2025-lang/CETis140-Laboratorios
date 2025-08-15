// 🔥 Configuración de Firebase (corregida y sin espacios)
const firebaseConfig = {
  apiKey: "AIzaSyA55cPC69QmI1Hbe-D43JgWILajbAkAoK4",
  authDomain: "bitacora-accesos.firebaseapp.com",
  databaseURL: "https://bitacora-accesos-default-rtdb.firebaseio.com", // ✅ sin espacios
  projectId: "bitacora-accesos",
  storageBucket: "bitacora-accesos.firebasestorage.app",
  messagingSenderId: "2275094027",
  appId: "1:2275094027:web:9cff8b0ab25dde647e610e"
};

// Inicializar Firebase (modo compatibilidad)
firebase.initializeApp(firebaseConfig);

// Servicios de Firebase
const db = firebase.database();
const auth = firebase.auth();
const docentesRef = db.ref("docentes");

// Autenticación anónima (necesaria para acceso a la DB)
auth.signInAnonymously().catch((error) => {
  console.error("Error de autenticación: ", error.code, error.message);
});

// Contraseña para acciones sensibles
const CONTRASENA = "Pinguinos140";

// Almacenar datos locales para validaciones
let docentes = [];

// Escuchar cambios en tiempo real
docentesRef.on("value", (snapshot) => {
  docentes = [];
  const data = snapshot.val();
  if (data) {
    Object.keys(data).forEach(key => {
      docentes.push({ id: key, ...data[key] });
    });
  }
  mostrarDocentes(docentes);
});

// Mostrar docentes en la tabla
function mostrarDocentes(lista) {
  const tbody = document.querySelector("#tablaHistorial tbody");
  tbody.innerHTML = "";
  lista.forEach(docente => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${docente.id}</td>
      <td>${docente.nombre}</td>
      <td>${docente.especialidad}</td>
      <td class="actions">
        <button class="edit-btn" onclick="editarDocente('${docente.id}')">✏️ Editar</button>
        <button class="delete-btn" onclick="eliminarDocente('${docente.id}')">🗑️ Borrar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Validar si ya existe (por ID o nombre)
function esDuplicado(nombre, id) {
  return docentes.some(d => d.nombre === nombre || d.id === id);
}

// Solicitar contraseña
function solicitarContrasena() {
  const pass = prompt("🔐 Ingresa la contraseña para continuar:");
  return pass === CONTRASENA;
}

// Registrar docente
document.getElementById("registrarDocente").addEventListener("click", () => {
  const nombre = document.getElementById("nombreDocente").value.trim();
  const especialidad = document.getElementById("especialidad").value;
  const id = document.getElementById("idDocente").value.trim();

  if (!nombre || !especialidad || !id) {
    alert("⚠️ Por favor, completa todos los campos.");
    return;
  }

  if (esDuplicado(nombre, id)) {
    alert("🚫 Ya existe un docente con ese nombre o ID.");
    return;
  }

  if (!solicitarContrasena()) {
    alert("❌ Contraseña incorrecta. Acceso denegado.");
    return;
  }

  docentesRef.push({ nombre, especialidad, id });
  alert("✅ Docente registrado exitosamente.");
  document.getElementById("nombreDocente").value = "";
  document.getElementById("especialidad").value = "";
  document.getElementById("idDocente").value = "";
});

// Buscar docentes
document.getElementById("buscador").addEventListener("input", () => {
  const term = document.getElementById("buscador").value.toLowerCase();
  if (!term) {
    mostrarDocentes(docentes);
    return;
  }
  const filtrados = docentes.filter(d =>
    d.nombre.toLowerCase().includes(term) ||
    d.id.toLowerCase().includes(term)
  );
  mostrarDocentes(filtrados);
});

// Eliminar docente
window.eliminarDocente = function(id) {
  if (!solicitarContrasena()) {
    alert("❌ Contraseña incorrecta.");
    return;
  }
  if (confirm("⚠️ ¿Estás seguro de eliminar este docente?")) {
    docentesRef.child(id).remove()
      .then(() => alert("🗑️ Docente eliminado."))
      .catch(err => alert("Error: " + err.message));
  }
};

// Editar docente (ejemplo básico)
window.editarDocente = function(id) {
  if (!solicitarContrasena()) {
    alert("❌ Contraseña incorrecta.");
    return;
  }
  const docente = docentes.find(d => d.id === id);
  const nuevoNombre = prompt("✏️ Nombre actual:", docente.nombre);
  const nuevaEspecialidad = prompt("📚 Especialidad actual:", docente.especialidad);

  if (nuevoNombre && nuevaEspecialidad) {
    docentesRef.child(id).update({
      nombre: nuevoNombre.trim(),
      especialidad: nuevaEspecialidad
    });
    alert("✅ Registro actualizado.");
  }
};
