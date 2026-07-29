function irARegistroEmpresa() {
    window.location.href = "empresa.html";
}

document.addEventListener("DOMContentLoaded", function () {
    var btnRegistrarEmpresa = document.getElementById("botonRegistrarEmpresa");
    if (btnRegistrarEmpresa) {
        btnRegistrarEmpresa.addEventListener("click", function (e) {
            e.preventDefault();
            irARegistroEmpresa();
        });
    }
});