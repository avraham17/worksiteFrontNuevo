var ofertaActual = null; // guardamos la oferta cargada para usarla al postularse

$(function () {

    var params = new URLSearchParams(window.location.search);
    var idOferta = params.get("id");

    if (!idOferta) {
        idOferta = 1;
    }

    callApi(
        "http://localhost:8080/oferta/" + idOferta,
        "GET",
        null,
        cargarOferta,
        function (error) {
            console.log("Error al cargar oferta:", error);
            $("#ofTitulo").text("No se pudo cargar la oferta");
        }
    );

    $("#btnPostular").on("click", function (e) {
        e.preventDefault();

        var idUsuario = localStorage.getItem("idUsuario");

        if (!idUsuario) {
            alert("Debes iniciar sesión para postularte");
            window.location.href = "sesion.html";
            return;
        }

        if (!ofertaActual) {
            alert("La oferta aún no ha cargado, intenta de nuevo en un momento");
            return;
        }

        $("#btnPostular").css("pointer-events", "none").text("Enviando...");

        var postulacion = {
            "idOferta": ofertaActual.id,
            "idCandidato": parseInt(idUsuario),
            "fechaPostulacion": new Date().toISOString().split("T")[0],
            "estadoPostulacion": "PENDIENTE"
        };

        callApi(
            "http://localhost:8080/postulacion",
            "POST",
            postulacion,
            function (response) {
                alert("Te has postulado exitosamente");
                window.location.href = "perfil.html";
            },
            function (error) {
                $("#btnPostular").css("pointer-events", "auto").text("Postularme ahora →");

                // El backend devuelve un mensaje claro si ya te habías postulado antes
                var mensaje = (error && error.message) ? error.message : JSON.stringify(error);
                alert("Error al postularse: " + mensaje);
            }
        );
    });
});

function cargarOferta(response) {
    var o = response.data;
    ofertaActual = o; // se guarda para usarlo al postularse
    console.log(o);

    var salarioTexto = o.salario
        ? "$" + o.salario.toLocaleString("es-CO") + " / mes"
        : "Salario a convenir";

    // Hero banner
    $("#ofTitulo").text(o.titulo);
    $("#ofSubtitulo").text(o.empresa + " · " + o.modalidad + " · Publicada el " + o.fechaDePublicacion);
    $("#ofBadgeEstado").text(o.estado === "activa" ? "🟢 Oferta activa" : "⏸ " + o.estado);

    // Card principal
    $("#ofEmpresa").text(o.empresa);
    $("#ofUbicacion").text(o.ubicacion);
    $("#ofTituloCard").text(o.titulo);
    $("#ofTagEstado").text(o.estado === "activa" ? "🟢 Activa" : "⏸ " + o.estado);
    $("#ofTagJornada").text(o.jornada);
    $("#ofTagModalidad").text(o.modalidad);
    $("#ofTagSector").text(o.sector);
    $("#ofSalario").text("💰 " + salarioTexto);

    // Meta grid
    $("#ofMetaUbicacion").text(o.ubicacion);
    $("#ofMetaNivel").text(o.nivelEducativo);
    $("#ofMetaJornada").text(o.jornada);
    $("#ofMetaCierre").text(o.fechaDeCierre);
    $("#ofMetaVacantes").text(o.numOfertas);

    // Barra de postulación
    $("#ofFechaCierreBadge").text(o.fechaDeCierre);
    $("#ofVacantesTxt").text(o.numOfertas);

    // Detalles
    $("#ofDetalleContrato").text(o.tipoDeContrato);
    $("#ofDetalleModalidad").text(o.modalidad);
    $("#ofDetalleJornada").text(o.jornada);
    $("#ofDetalleExperiencia").text(o.experiencia);
    $("#ofDetalleNivel").text(o.nivelEducativo);
    $("#ofDetalleSector").text(o.sector);
    $("#ofDetalleSalario").text(salarioTexto);
    $("#ofDetallePublicacion").text(o.fechaDePublicacion);

    // Descripción
    $("#ofDescripcion").text(o.descripcion);

    var responsabilidadesHtml = (o.responsabilidades || "")
        .split("\n")
        .filter(function (linea) { return linea.trim() !== ""; })
        .map(function (linea) { return "<li>" + linea + "</li>"; })
        .join("");
    $("#ofResponsabilidades").html(responsabilidadesHtml);

    var requisitosHtml = (o.requisitos || "")
        .split("\n")
        .filter(function (linea) { return linea.trim() !== ""; })
        .map(function (linea) { return "<li>" + linea + "</li>"; })
        .join("");
    $("#ofRequisitos").html(requisitosHtml);
}
