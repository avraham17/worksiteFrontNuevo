function requireAuth(rolesPermitidos) {
    var idUsuario = localStorage.getItem("idUsuario");
    var rol = localStorage.getItem("rol");

    
    if (!idUsuario || !rol) {
        alert("Debes iniciar sesión para acceder a esta página");
        window.location.href = "sesion.html";
        return false;
    }

    if (rol === "ADMIN") {
        return true;
    }

    if (rolesPermitidos && rolesPermitidos.length > 0) {
        if (rolesPermitidos.indexOf(rol) === -1) {
            alert("No tienes permiso para acceder a esta página");
            window.location.href = "inicio 2.html";
            return false;
        }
    }

    return true;
}

function cerrarSesion() {
    localStorage.removeItem("idUsuario");
    localStorage.removeItem("correoUsuario");
    localStorage.removeItem("nombreUsuario");
    localStorage.removeItem("apellidoUsuario");
    localStorage.removeItem("rol");
    window.location.href = "worksite-inicio.html";
}

document.addEventListener("DOMContentLoaded", function () {
    var btnLogout = document.getElementById("botonCerrarSesion");
    if (btnLogout) {
        btnLogout.addEventListener("click", function (e) {
            e.preventDefault();
            cerrarSesion();
        });
    }
});