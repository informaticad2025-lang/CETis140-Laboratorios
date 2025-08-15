// 🔥 Configuración de Firebase (modo compatibilidad para proyectos web simples)
// Usamos las bibliotecas "compat" para mantener la sintaxis sencilla

// Inicialización de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA55cPC69QmI1Hbe-D43JgWILajbAkAoK4",
  authDomain: "bitacora-accesos.firebaseapp.com",
  databaseURL: "https://bitacora-accesos-default-rtdb.firebaseio.com", // ✅ Corregido: sin espacios
  projectId: "bitacora-accesos",
  storageBucket: "bitacora-accesos.firebasestorage.app",
  messagingSenderId: "2275094027",
  appId: "1:2275094027:web:9cff8b0ab25dde647e610e",
  measurementId: "G-2R28CFWYLP"
};

// Inicializar Firebase (modo compatibilidad)
firebase.initializeApp(firebaseConfig);

// Referencias a servicios
const db = firebase.database(); // Realtime Database
const auth = firebase.auth();   // Autenticación

// Autenticación anónima (requerida para acceso a la base de datos)
auth.signInAnonymously().catch((error) => {
  console.error("Error al iniciar sesión anónima:", error.code, "–", error.message);
});

// Referencia a la base de datos (por ejemplo, nodo "docentes")
const docentesRef = db.ref("docentes");

// Escuchar cambios en tiempo real
docentesRef.on("value", (snapshot) => {
  const data = snapshot.val();
  console.log("Datos recibidos:", data);
  // Aquí procesas los datos (mostrar en tabla, etc.)
});
