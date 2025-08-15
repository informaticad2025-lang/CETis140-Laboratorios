// 🔥 Configuración de Firebase (modo compatibilidad para GitHub Pages)
const firebaseConfig = {
  apiKey: "AIzaSyA55cPC69QmI1Hbe-D43JgWILajbAkAoK4",
  authDomain: "bitacora-accesos.firebaseapp.com",
  databaseURL: "https://bitacora-accesos-default-rtdb.firebaseio.com", // ✅ sin espacios
  projectId: "bitacora-accesos",
  storageBucket: "bitacora-accesos.firebasestorage.app",
  messagingSenderId: "2275094027",
  appId: "1:2275094027:web:9cff8b0ab25dde647e610e"
};

// Inicializar Firebase en modo compatibilidad
firebase.initializeApp(firebaseConfig);

// Servicios de Firebase
const db = firebase.database();
const auth = firebase.auth();
const docentesRef = db.ref("docentes"); // 👈 Asegúrate de que sea el mismo nodo donde guardas

// Autenticación anónima (necesaria para acceso)
auth.signInAnonymously().catch((error) => {
  console.error("Error de autenticación anónima:", error.code, error.message);
});

// Almacenar lista local de docentes
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

// Función para solicitar contraseña
function solicitarContrasena() {
  const pass = prompt("🔐 Ingresa la contraseña para continuar:");
  return pass === "Pinguinos140";
}

// ✅ Eliminar registro (CORREGIDO)
window.eliminarDocente = function(id) {
  // 1. Validar ID
  if (!id) {
    alert("❌ ID no válido.");
    console.error("ID no proporcionado");
    return;
  }

  // 2. Solicitar contraseña
  if (!solicitarContrasena()) {
    alert("❌ Contraseña incorrecta. Acceso denegado.");
    return;
  }

  // 3. Confirmar eliminación
  if (!confirm("⚠️ ¿Estás seguro de eliminar este docente?")) return;

  // 4. Eliminar de Firebase
  docentesRef.child(id).remove()
    .then(() => {
      alert("✅ Docente eliminado correctamente.");
      console.log("🗑️ Registro eliminado con ID:", id);
    })
    .catch((error) => {
      console.error("❌ Error al eliminar:", error);
      alert("Error al eliminar: " + error.message);
    });
};

// ✅ Editar docente
window.editarDocente = function(id) {
  if (!solicitarContrasena()) {
    alert("❌ Contraseña incorrecta.");
    return;
  }

  const docente = docentes.find(d => d.id === id);
  if (!docente) {
    alert("Docente no encontrado.");
    return;
  }

  const nuevoNombre = prompt("✏️ Nombre:", docente.nombre);
  const nuevaEspecialidad = prompt("📚 Especialidad:", docente.especialidad);

  if (nuevoNombre && nuevaEspecialidad) {
    docentesRef.child(id).update({
      nombre: nuevoNombre.trim(),
      especialidad: nuevaEspecialidad
    })
    .then(() => alert("✅ Actualizado"))
    .catch(err => alert("Error: " + err.message));
  }
};

// ✅ Registrar nuevo docente
document.getElementById("registrarDocente").addEventListener("click", () => {
  const nombre = document.getElementById("nombreDocente").value.trim();
  const especialidad = document.getElementById("especialidad").value;
  const id = document.getElementById("idDocente").value.trim();

  if (!nombre || !especialidad || !id) {
    alert("⚠️ Completa todos los campos.");
    return;
  }

  // Validar duplicados
  const duplicado = docentes.some(d => d.nombre === nombre || d.id === id);
  if (duplicado) {
    alert("🚫 Ya existe un docente con ese nombre o ID.");
    return;
  }

  if (!solicitarContrasena()) {
    alert("❌ Contraseña incorrecta.");
    return;
  }

  // Guardar en Firebase
  docentesRef.push({ nombre, especialidad, id })
    .then(() => {
      alert("✅ Docente registrado.");
      document.getElementById("nombreDocente").value = "";
      document.getElementById("especialidad").value = "";
      document.getElementById("idDocente").value = "";
    })
    .catch(err => {
      console.error("❌ Error al registrar:", err);
      alert("Error: " + err.message);
    });
});

// ✅ Buscar docentes
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

