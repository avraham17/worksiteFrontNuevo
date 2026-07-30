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
    localStorage.setItem("token", response.data.token); // necesario para que callApi mande Authorization

    if (response.data.rolNombre === "EMPRESA") {
        cargarNombreEmpresaYRedirigir(response.data.id);
    } else {
        window.location.href = "inicio 2.html";
    }
}

function cargarNombreEmpresaYRedirigir(idUsuario) {
    callApi("http://localhost:8080/empresa/usuario/" + idUsuario, "GET", null, function (response) {
        var miEmpresa = response.data;

        if (miEmpresa) {
            localStorage.setItem("nombreEmpresa", miEmpresa.nombre);
        } else {
            localStorage.removeItem("nombreEmpresa");
        }

        window.location.href = "inicio 2.html";
    }, function (error) {
        // Es normal recibir error aquí si el usuario EMPRESA aún no completó su perfil
        console.log("El usuario aún no tiene perfil empresarial:", error);
        localStorage.removeItem("nombreEmpresa");
        window.location.href = "inicio 2.html";
    });
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