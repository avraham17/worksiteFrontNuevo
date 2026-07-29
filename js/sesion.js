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

    if (response.data.rolNombre === "EMPRESA") {
        cargarNombreEmpresaYRedirigir(response.data.correoElectronico);
    } else {
        window.location.href = "inicio 2.html";
    }
}

function cargarNombreEmpresaYRedirigir(correoUsuario) {
    callApi("http://localhost:8080/empresa", "GET", null, function (response) {
        var empresas = response.data || [];
        var miEmpresa = empresas.find(function (e) {
            return e.correo === correoUsuario;
        });

        if (miEmpresa) {
            localStorage.setItem("nombreEmpresa", miEmpresa.nombre);
        } else {
            // El usuario tiene rol EMPRESA pero aún no completó su perfil empresarial
            localStorage.removeItem("nombreEmpresa");
        }

        window.location.href = "inicio 2.html";
    }, function (error) {
        console.error("No se pudo cargar el perfil empresarial:", error);
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
