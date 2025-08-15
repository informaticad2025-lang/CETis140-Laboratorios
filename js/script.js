// 🔥 Configuración de Firebase (reemplaza con tus datos)
const firebaseConfig = {
  apiKey: "AIzaSyA55cPC69QmI1Hbe-D43JgWILajbAkAoK4",
  authDomain: "bitacora-accesos.firebaseapp.com",
  databaseURL: "https://bitacora-accesos-default-rtdb.firebaseio.com",
  projectId: "bitacora-accesos",
  storageBucket: "bitacora-accesos.appspot.com",
  messagingSenderId: "2275094027",
  appId: "1:2275094027:web:9cff8b0ab25dde647e610e"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const docentesRef = db.ref("docentes");

// Autenticación anónima
firebase.auth().signInAnonymously().catch((error) => {
  console.error("Error al iniciar sesión anónima: ", error.code, error.message);
});

// Contraseña requerida
const PASSWORD = "Pinguinos140";

// Escuchar cambios en la base de datos
let docentes = [];
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
      <td>
        <button class="edit-btn" onclick="editarDocente('${docente.id}')">
          <img src="img/icon_edit.png" alt="Editar" /> Editar
        </button>
        <button class="delete-btn" onclick="eliminarDocente('${docente.id}')">
          <img src="img/icon_delete.png" alt="Eliminar" /> Borrar
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Validar duplicados
function esDuplicado(nombre, id) {
  return docentes.some(docente => docente.nombre === nombre || docente.id === id);
}

// Registrar nuevo docente
document.getElementById("registrarDocente").addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombreDocente").value.trim();
  const especialidad = document.getElementById("especialidad").value;
  const id = document.getElementById("idDocente").value.trim();

  if (!nombre || !especialidad || !id) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  if (esDuplicado(nombre, id)) {
    alert("Ya existe un docente con este nombre o ID. Por favor, ingresa datos únicos.");
    return;
  }

  // Solicitar contraseña
  const passwordInput = prompt("Ingresa la contraseña para registrar el docente:");
  if (passwordInput !== PASSWORD) {
    alert("Contraseña incorrecta. Acceso denegado.");
    return;
  }

  docentesRef.push({ nombre, especialidad, id });
  document.getElementById("registroForm").reset();
});

// Buscar docentes
document.getElementById("buscador").addEventListener("input", () => {
  const term = document.getElementById("buscador").value.toLowerCase();
  if (!term) {
    mostrarDocentes(docentes);
    return;
  }
  const filtrados = docentes.filter(docente =>
    docente.nombre.toLowerCase().includes(term) ||
    docente.id.toLowerCase().includes(term)
  );
  mostrarDocentes(filtrados);
});

// Eliminar docente
function eliminarDocente(id) {
  // Solicitar contraseña
  const passwordInput = prompt("Ingresa la contraseña para eliminar el docente:");
  if (passwordInput !== PASSWORD) {
    alert("Contraseña incorrecta. Acceso denegado.");
    return;
  }

  if (confirm("¿Estás seguro de eliminar este docente?")) {
    docentesRef.child(id).remove()
      .then(() => alert("Docente eliminado"))
      .catch(err => alert("Error al eliminar: " + err.message));
  }
}

// Editar docente (implementación futura)
function editarDocente(id) {
  // Lógica para editar aquí
  alert("Función de edición no implementada aún.");
}