window.addEventListener("DOMContentLoaded", function () {
    const nombre   = localStorage.getItem("nombreUsuario")   || "";
    const apellido = localStorage.getItem("apellidoUsuario") || "";

    const inicialNombre   = nombre.charAt(0).toUpperCase();
    const inicialApellido = apellido.charAt(0).toUpperCase();

    const avatar = document.getElementById("avatarInicial");
    if (avatar) {
        avatar.textContent = inicialNombre + inicialApellido;
    }
});