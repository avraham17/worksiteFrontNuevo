$(function () {
    
    var rol = localStorage.getItem("rol");
    if (rol !== "EMPRESA") {
        alert("No tienes permiso para publicar ofertas");
        window.location.href = "inicio 2.html";
    }

    $("#botonPublicar").on("click", function (e) {
        e.preventDefault();

        var nuevaOferta = {
        "titulo": $("#titulo").val(),
        "descripcion": $("#descripcion").val(),
        "sector": $("#sector").val(),
        "modalidad": $("#modalidad").val(),
        "responsabilidades": $("#responsabilidades").val(),
        "requisitos": $("#requisitos").val(),
        "jornada": $("#jornada").val(),
        "tipoDeContrato": $("#contrato").val(),
        "experiencia": $("#experiencia").val(),
        "nivelEducativo": $("#nivel").val(),
        "numOfertas": $("#vacantes").val(),
        "fechaDeCierre": $("#cierre").val(),
        "empresa": $("#empresa").val(),
        "salario": parseFloat($("#salario").val()),
        "fechaDePublicacion": $("#fechaDePublicacion").val(),
        "ubicacion": $("#ubicacion").val(),
        "estado": $("#estado").val()
    };

    callApi(
        "http://localhost:8080/oferta", "POST",nuevaOferta,

        
        function (response) {
            alert("Oferta publicada correctamente");
            window.location.href = "aplicar-oferta.html";
        },
        function (error) {
            alert("Error al publicar la oferta: " + JSON.stringify(error));
        }
    );
    });
});