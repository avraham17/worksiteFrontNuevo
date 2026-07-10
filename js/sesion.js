
function cbError(error) {
    console.error("Error en la petición:", error);
    alert("Correo o contraseña incorrectos");
}

function cargarUsuario(response) {
    console.log("Datos completos:", response.data);
    
    localStorage.setItem("idUsuario", response.data.id);
    localStorage.setItem("correoUsuario", response.data.correoElectronico);
    localStorage.setItem("nombreUsuario", response.data.nombres);  
    localStorage.setItem("apellidoUsuario", response.data.apellidos);
    localStorage.setItem("rol", response.data.rolNombre);
    window.location.href = "inicio 2.html";
}

document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault(); 

    const correo = document.getElementById("email").value;
    const contrasenia = document.getElementById("password").value;

    const body = {
        correo: correo,
        contrasenia: contrasenia
    };

    callApi(
  "http://localhost:8080/ResgistroUsuario/login", "POST", body, cargarUsuario, cbError
    );
    
    
});

