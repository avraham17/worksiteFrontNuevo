var idEmpresaActual = null; // se llena desde la BD, no desde localStorage

$(function () {

    var rol = localStorage.getItem("rol");
    if (rol !== "EMPRESA" && rol !== "ADMIN") {
        alert("No tienes permiso para publicar ofertas");
        window.location.href = "inicio 2.html";
        return;
    }

    var idUsuario = localStorage.getItem("idUsuario");
    if (!idUsuario) {
        alert("Debes iniciar sesión");
        window.location.href = "sesion.html";
        return;
    }

    // Bloqueamos el botón hasta confirmar que el perfil empresarial existe y cargó bien
    $("#botonPublicar").prop("disabled", true);
    $("#empresa").val("Cargando...").prop("readonly", true);

    callApi("http://localhost:8080/empresa/usuario/" + idUsuario, "GET", null, function (response) {
        var miEmpresa = response.data;

        // Guardamos el id real de la empresa; el nombre solo se muestra como referencia visual
        idEmpresaActual = miEmpresa.id;
        $("#empresa").val(miEmpresa.nombre);
        $("#botonPublicar").prop("disabled", false);

    }, function (error) {
        console.log("El usuario aún no tiene perfil empresarial:", error);

        if (rol === "ADMIN") {
            // El admin puede explorar el formulario, pero no publicar sin una empresa a la cual vincular la oferta.
            $("#empresa").val("Sin perfil empresarial (cuenta ADMIN)");
            $("#botonPublicar")
                .prop("disabled", true)
                .attr("title", "No disponible: esta cuenta no tiene perfil empresarial");

            if ($("#avisoSinEmpresa").length === 0) {
                $("#empresa").after(
                    '<p id="avisoSinEmpresa" style="color:#b45309; font-size:12.5px; margin-top:6px;">' +
                    '⚠️ Esta cuenta de administrador no tiene un perfil empresarial, así que no puede publicar ofertas propias.' +
                    '</p>'
                );
            }
        } else {
            alert("Debes completar tu perfil empresarial antes de publicar una oferta");
            window.location.href = "perfil-empresa.html";
        }
    });

    $("#botonPublicar").on("click", function (e) {
        e.preventDefault();

        if (!idEmpresaActual) {
            alert("Aún no se ha cargado tu perfil empresarial, espera un momento");
            return;
        }

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
            "idEmpresa": idEmpresaActual, // relación real, ya no texto libre
            "salario": parseFloat($("#salario").val()),
            "fechaDePublicacion": $("#fechaDePublicacion").val(),
            "ubicacion": $("#ubicacion").val(),
            "estado": $("#estado").val()
        };

        console.log("Enviando oferta:", nuevaOferta);

        callApi(
            "http://localhost:8080/oferta", "POST", nuevaOferta,
            function (response) {
                alert("Oferta publicada correctamente");
                window.location.href = "perfil-empresa.html";
            },
            function (error) {
                console.error("Error al publicar la oferta:", error);
                alert("Error al publicar la oferta: " + JSON.stringify(error));
            }
        );
    });
});