$(function () {

    // Toma el id de la oferta desde la URL: aplicar-oferta.html?id=1
    var params = new URLSearchParams(window.location.search);
    var idOferta = params.get("id");

    if (!idOferta) {
        // Si no hay id, carga la primera oferta por defecto
        idOferta = 1;
    }

    callApi(
        "http://localhost:8080/oferta/" + idOferta,
        "GET",
        null,
        cargarOferta,
        function (error) {
            console.log("Error al cargar oferta:", error);
        }
    );

    $("#btnPostular").on("click", function () {
        var idUsuario = localStorage.getItem("idUsuario");

        if (!idUsuario) {
            alert("Debes iniciar sesión para postularte");
            window.location.href = "sesion.html";
            return;
        }

        var postulacion = {
            "oferta": idOferta,
            "candidato": idUsuario,
            "fechaPostulacion": new Date().toISOString().split("T")[0], // fecha de hoy
            "estadoPostulacion": "PENDIENTE"
        };

        callApi(
            "http://localhost:8080/postulacion",
            "POST",
            postulacion,
            function (response) {
                alert("Te has postulado exitosamente");
            },
            function (error) {
                alert("Error al postularse: " + JSON.stringify(error));
            }
        );
    });
});

function cargarOferta(response) {
    var o = response.data;
    console.log(o);

    // Encabezado
    $(".hero-banner h1").text(o.titulo);
    $(".hero-banner .sub").text(o.empresa + " · " + o.modalidad + " · Publicada el " + o.fechaDePublicacion);

    // Info principal
    $(".company-name-lbl").text(o.empresa);
    $(".job-title-big").text(o.titulo);
    $(".salary-badge").text("💰 $" + o.salario.toLocaleString() + " / mes");

    // Meta grid
    var metas = $(".meta-item");
    $(metas[0]).text("📍 " + o.ubicacion);
    $(metas[1]).text("🎓 " + o.nivelEducativo);
    $(metas[2]).text("🕐 " + o.jornada);
    $(metas[3]).text("📅 Cierra: " + o.fechaDeCierre);
    $(metas[4]).text("👥 " + o.numOfertas + " vacantes disponibles");
    $(metas[5]).text("📂 " + o.sector);

    // Detalles tabla
    var cells = $(".d-value");
    $(cells[0]).text(o.tipoDeContrato);
    $(cells[1]).text(o.modalidad);
    $(cells[2]).text(o.jornada);
    $(cells[3]).text(o.experiencia);
    $(cells[4]).text(o.nivelEducativo);
    $(cells[5]).text(o.sector);
    $(cells[6]).text("$" + o.salario.toLocaleString() + " COP / mes");

    // Descripción, responsabilidades, requisitos
    $(".prose p:first").text(o.descripcion);
    $(".card-title:contains('Responsabilidades')").next("ul").html(
        o.responsabilidades.split("\n").map(r => `<li>${r}</li>`).join("")
    );
    $(".card-title:contains('Requisitos')").next("ul").html(
        o.requisitos.split("\n").map(r => `<li>${r}</li>`).join("")
    );

    // Badge estado
    if (o.estado === "activa") {
        $(".tag-green").text("🟢 Activa");
    } else {
        $(".tag-green").text("⏸ " + o.estado);
    }
}