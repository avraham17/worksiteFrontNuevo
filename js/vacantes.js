$(function () {
   
    cargarVacantes();

    $("#btnFiltrar").on("click", cargarVacantes);
    $("#filtroBusqueda").on("keypress", function (e) {
        if (e.which === 13) cargarVacantes();
    });
});

function cargarVacantes() {
    $("#listaVacantes").html('<div class="estado-info">Cargando vacantes…</div>');
    $("#estadoInfo").hide();

    callApi("http://localhost:8080/oferta", "GET", null,
        function (response) {
            var ofertas = response.data;
            var busqueda  = $("#filtroBusqueda").val().toLowerCase();
            var modalidad = $("#filtroModalidad").val().toLowerCase();
            var sector    = $("#filtroSector").val().toLowerCase();

            ofertas = ofertas.filter(function (o) {
                var okTexto = !busqueda ||
                    (o.titulo     && o.titulo.toLowerCase().includes(busqueda)) ||
                    (o.empresa    && o.empresa.toLowerCase().includes(busqueda)) ||
                    (o.descripcion && o.descripcion.toLowerCase().includes(busqueda));
                var okModal  = !modalidad || (o.modalidad && o.modalidad.toLowerCase().includes(modalidad));
                var okSector = !sector    || (o.sector    && o.sector.toLowerCase().includes(sector));
                return okTexto && okModal && okSector && o.estado === "activa";
            });

            $("#listaVacantes").html("");

            if (ofertas.length === 0) {
                $("#contadorVacantes").text("0 vacantes encontradas");
                $("#estadoInfo").text("No se encontraron vacantes con esos criterios.").show();
                return;
            }

            $("#contadorVacantes").text(ofertas.length + " vacante" + (ofertas.length !== 1 ? "s" : "") + " disponible" + (ofertas.length !== 1 ? "s" : ""));
            ofertas.forEach(function (o) {
                $("#listaVacantes").append(crearTarjeta(o));
            });
        },
        function (error) {
            $("#listaVacantes").html("");
            $("#estadoInfo").text("Error al cargar las vacantes. Verifica que el servidor esté activo.").show();
        }
    );
}

function crearTarjeta(o) {
    var iconos = { "Tecnología · Software": "💻", "Marketing y Publicidad": "📣", "Finanzas y Contabilidad": "💰", "Recursos Humanos": "👥", "Diseño y Creatividad": "🎨", "Ventas y Comercial": "📈", "Salud y Medicina": "🏥", "Educación": "📚" };
    var icono = iconos[o.sector] || "💼";
    var salario = o.salario ? "💰 $" + parseFloat(o.salario).toLocaleString("es-CO") + " / mes" : "Salario a convenir";

    return `
      <div class="vacante-card" onclick="window.location.href='aplicar-oferta.html?id=${o.id}'">
        <div class="vc-top">
          <div class="vc-icon">${icono}</div>
          <div>
            <div class="vc-empresa">${o.empresa || "Empresa"} · ${o.ubicacion || ""}</div>
            <div class="vc-titulo">${o.titulo}</div>
          </div>
        </div>
        <div class="vc-tags">
          <span class="vc-tag tag-green">🟢 Activa</span>
          <span class="vc-tag tag-blue">${o.modalidad || ""}</span>
          <span class="vc-tag tag-blue">${o.jornada || ""}</span>
          <span class="vc-tag tag-gray">${o.sector || ""}</span>
        </div>
        <div class="vc-salario">${salario}</div>
        <div class="vc-meta">
          <span>🎓 ${o.nivelEducativo || "No especificado"}</span>
          <span>🕐 ${o.experiencia || "No especificado"}</span>
          <span>📅 Cierra: ${o.fechaDeCierre || "—"}</span>
          <span>👥 ${o.numOfertas || "1"} vacante(s)</span>
        </div>
        <div class="vc-footer">
          <a href="aplicar-oferta.html?id=${o.id}" class="btn-ver" onclick="event.stopPropagation()">Ver oferta →</a>
          <button class="btn-guardar-mini" onclick="event.stopPropagation()">🔖 Guardar</button>
        </div>
      </div>`;
}