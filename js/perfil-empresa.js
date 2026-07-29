var empresaId = null;
var nombreEmpresaActual = "";
var empresaActual = null; // objeto completo, para precargar el modal de edición
var mapaUsuarios = {}; // correoElectronico -> "Nombres Apellidos"

function cbError(error) {
    console.error("Error en la petición:", error);
}

function loadData() {
    callApi("http://localhost:8080/empresa", "GET", null, function (response) {
        var idUsuario = localStorage.getItem("idUsuario");
        var empresas = response.data || [];

        var miEmpresa = empresas.find(function (e) {
            return String(e.idUsuario) === String(idUsuario);
        });

        if (!miEmpresa) {
            alert("No se encontró un perfil empresarial asociado a tu cuenta.");
            return;
        }

        cargarPerfil({ data: miEmpresa });
    }, cbError);
}

function updateData(datos) {
    if (!empresaId) {
        alert("Aún no se ha cargado tu perfil empresarial");
        return;
    }
    callApi("http://localhost:8080/empresa/" + empresaId, "PUT", datos, actualizarPerfil, cbError);
}

function deleteData(correo) {
    callApi("http://localhost:8080/empresa/correo/" + correo, "DELETE", null, eliminarPerfil, cbError);
}

function cargarPerfil(response) {
    var e = response.data;
    empresaId = e.id;
    nombreEmpresaActual = e.nombre;
    empresaActual = e; // guardamos todo el objeto para precargar el modal de edición

    $("#nombreMostrar").text(e.nombre);
    $("#cargoMostrar").text(e.sector);
    $("#mostrarNombre").text(e.nombre);
    $("#mostrarCorreo").text(e.correo);
    $("#mostrarTelefono").text(e.telefono);
    $("#mostrarUbicacion").text(e.ubicacion);
    $("#mostrarSector").text(e.sector);
    $("#empAvatarCircle").text((e.nombre || "?").trim().charAt(0).toUpperCase());

    cargarOfertasEmpresa();
}

function actualizarPerfil(response) {
    alert("Datos actualizados correctamente");
    loadData();
}

function eliminarPerfil(response) {
    alert("Perfil eliminado correctamente");
    localStorage.clear();
    window.location.href = "sesion.html";
}

function cargarOfertasEmpresa() {
    callApi("http://localhost:8080/oferta/empresa/" + empresaId, "GET", null, function (response) {
        var misOfertas = response.data || [];

        // Activas primero, y dentro de cada grupo, las más recientes primero
        misOfertas.sort(function (a, b) {
            if (a.estado === "activa" && b.estado !== "activa") return -1;
            if (a.estado !== "activa" && b.estado === "activa") return 1;
            return b.id - a.id;
        });

        var activas = misOfertas.filter(function (o) { return o.estado === "activa"; });

        $("#statOfertas").text(misOfertas.length);
        $("#statActivas").text(activas.length);

        var contenedor = $("#listaOfertasEmpresa");
        contenedor.empty();

        if (misOfertas.length === 0) {
            $("#sinOfertas").show();
            $("#statPostulantes").text(0);
            return;
        }

        $("#sinOfertas").hide();

        renderOfertas(misOfertas);
    }, cbError);
}

function renderOfertas(misOfertas) {
    var contenedor = $("#listaOfertasEmpresa");
    contenedor.empty();

    var totalPostulantesGlobal = 0;
    var pendientes = misOfertas.length;

    misOfertas.forEach(function (o) {
        var esActiva = o.estado === "activa";
        var claseEstado = esActiva ? "badge-aceptado" : "badge-pendiente";
        var textoEstado = esActiva ? "🟢 Activa" : (o.estado === "pausada" ? "⏸ Pausada" : "📝 " + o.estado);

        var card = $('<div class="emp-oferta-card"></div>');

        // Encabezado: título + estado
        var header = $('<div class="emp-oferta-header"></div>');
        header.append($('<span class="emp-oferta-titulo"></span>').text(o.titulo));
        header.append($('<span class="badge-estado ' + claseEstado + '"></span>').text(textoEstado));

        // Etiquetas rápidas: sector, modalidad, jornada
        var tags = $('<div class="emp-oferta-tags"></div>');
        if (o.sector) tags.append($('<span class="emp-oferta-tag"></span>').text("🗂️ " + o.sector));
        if (o.modalidad) tags.append($('<span class="emp-oferta-tag"></span>').text("🌐 " + o.modalidad));
        if (o.jornada) tags.append($('<span class="emp-oferta-tag"></span>').text("🕐 " + o.jornada));

        // Salario
        var salarioTexto = o.salario
            ? "💰 $" + o.salario.toLocaleString("es-CO") + " / mes"
            : "💰 Salario a convenir";
        var salario = $('<div class="emp-oferta-salario"></div>').text(salarioTexto);

        // Meta: ubicación, vacantes, cierre
        var meta = $('<div class="emp-oferta-meta"></div>').html(
            "📍 " + (o.ubicacion || "—") + "<br>" +
            "👥 " + o.numOfertas + " vacante(s)<br>" +
            "📅 Cierra: " + (o.fechaDeCierre || "—")
        );

        // Conteo de postulantes (se llena de forma asíncrona)
        var postulantesBadge = $('<div class="emp-oferta-postulantes">⏳ Consultando postulantes...</div>');

        // Botonera
        var acciones = $('<div class="emp-oferta-acciones"></div>');

        var btnVer = $('<button class="emp-btn-ver">👁️ Ver postulantes</button>');
        btnVer.on("click", function () {
            mostrarPostulantes(o.id, o.titulo);
        });

        var btnToggle = esActiva
            ? $('<button class="emp-btn-pausar">⏸ Pausar</button>')
            : $('<button class="emp-btn-reactivar">▶️ Reactivar</button>');
        btnToggle.on("click", function () {
            toggleEstadoOferta(o, esActiva ? "pausada" : "activa");
        });

        acciones.append(btnVer, btnToggle);

        card.append(header, tags, salario, meta, postulantesBadge, acciones);
        contenedor.append(card);

        // Trae el conteo real de postulantes para esta oferta específica
        callApi("http://localhost:8080/postulacion/oferta/" + o.id, "GET", null, function (resp) {
            var cantidad = (resp.data || []).length;
            totalPostulantesGlobal += cantidad;

            if (cantidad === 0) {
                postulantesBadge.html("🙋 Sin postulantes aún");
            } else {
                postulantesBadge.html("🙋 <strong>" + cantidad + "</strong> postulante" + (cantidad !== 1 ? "s" : ""));
                btnVer.append('<span class="emp-btn-badge">' + cantidad + '</span>');
            }

            pendientes--;
            if (pendientes === 0) {
                $("#statPostulantes").text(totalPostulantesGlobal);
            }
        }, function () {
            postulantesBadge.html("🙋 —");
            pendientes--;
            if (pendientes === 0) {
                $("#statPostulantes").text(totalPostulantesGlobal);
            }
        });
    });
}

function toggleEstadoOferta(o, nuevoEstado) {
    var datosActualizados = {
        "titulo": o.titulo,
        "descripcion": o.descripcion,
        "sector": o.sector,
        "modalidad": o.modalidad,
        "responsabilidades": o.responsabilidades,
        "requisitos": o.requisitos,
        "jornada": o.jornada,
        "tipoDeContrato": o.tipoDeContrato,
        "experiencia": o.experiencia,
        "nivelEducativo": o.nivelEducativo,
        "numOfertas": o.numOfertas,
        "fechaDeCierre": o.fechaDeCierre,
        "idEmpresa": o.idEmpresa,
        "salario": o.salario,
        "fechaDePublicacion": o.fechaDePublicacion,
        "ubicacion": o.ubicacion,
        "estado": nuevoEstado
    };

    callApi("http://localhost:8080/oferta/" + o.id, "PUT", datosActualizados, function () {
        cargarOfertasEmpresa();
    }, cbError);
}

function mostrarPostulantes(idOferta, tituloOferta) {
    $("#modalPostulantesTitulo").text("Postulantes: " + tituloOferta);
    $("#listaPostulantes").html('<p class="emp-cargando">Cargando postulantes...</p>');

    var modal = new bootstrap.Modal(document.getElementById('modalPostulantes'));
    modal.show();

    callApi("http://localhost:8080/postulacion/oferta/" + idOferta, "GET", null, function (response) {
        var postulantes = response.data || [];

        var contenedor = $("#listaPostulantes");
        contenedor.empty();

        if (postulantes.length === 0) {
            contenedor.html(
                '<div class="emp-empty-state">' +
                    '<div class="emp-empty-icon">🙋</div>' +
                    '<p class="emp-empty-title">Aún no hay postulantes para esta oferta</p>' +
                '</div>'
            );
            return;
        }

        postulantes.forEach(function (p) {
            var nombreCandidato = p.candidato || p.correoCandidato;
            var inicial = nombreCandidato.trim().charAt(0).toUpperCase();
            var estado = (p.estadoPostulacion || "").toLowerCase();

            var claseBadge = "badge-pendiente";
            if (estado === "aceptado" || estado === "aceptada") claseBadge = "badge-aceptado";
            else if (estado === "rechazado" || estado === "rechazada") claseBadge = "badge-rechazado";

            var fila = $('<div class="emp-postulante-row"></div>');

            var avatar = $('<div class="emp-postulante-avatar"></div>').text(inicial);

            var izquierda = $('<div class="emp-postulante-info"></div>').html(
                "<strong>" + nombreCandidato + "</strong><br>" +
                "<small>" + p.correoCandidato + " · Postulado el " + p.fechaPostulacion + "</small>"
            );

            var infoRow = $('<div class="emp-postulante-left"></div>');
            infoRow.append(avatar, izquierda);

            var derecha = $('<div class="emp-postulante-right"></div>');
            var badge = $('<span class="badge-estado ' + claseBadge + '"></span>').text(p.estadoPostulacion);

            var acciones = $('<div class="emp-postulante-acciones"></div>');
            var btnAceptar = $('<button class="emp-btn-aceptar">✅ Aceptar</button>');
            var btnRechazar = $('<button class="emp-btn-rechazar">❌ Rechazar</button>');

            btnAceptar.on("click", function () {
                cambiarEstadoPostulacion(p, "ACEPTADO", idOferta, tituloOferta);
            });
            btnRechazar.on("click", function () {
                cambiarEstadoPostulacion(p, "RECHAZADO", idOferta, tituloOferta);
            });

            acciones.append(btnAceptar, btnRechazar);
            derecha.append(badge, acciones);

            fila.append(infoRow, derecha);
            contenedor.append(fila);
        });
    }, cbError);
}

function cambiarEstadoPostulacion(p, nuevoEstado, idOferta, tituloOferta) {
    var datosActualizados = {
        "idOferta": p.idOferta,
        "idCandidato": p.idCandidato,
        "fechaPostulacion": p.fechaPostulacion,
        "estadoPostulacion": nuevoEstado
    };

    callApi("http://localhost:8080/postulacion/" + p.idPostulacion, "PUT", datosActualizados, function () {
        mostrarPostulantes(idOferta, tituloOferta);
    }, cbError);
}

$(function () {

    loadData();

    $("#btneditar").on("click", function () {
        if (empresaActual) {
            $("#editNombre").val(empresaActual.nombre || "");
            $("#editSector").val(empresaActual.sector || "");
            $("#editUbicacion").val(empresaActual.ubicacion || "");
            $("#editTelefono").val(empresaActual.telefono || "");
            $("#editCorreo").val(empresaActual.correo || "");
        }
        var modal = new bootstrap.Modal(document.getElementById('modalEditar'));
        modal.show();
    });

    $("#btneliminar").on("click", function () {
        var correo = $("#mostrarCorreo").text();
        if (confirm("¿Estás seguro de eliminar tu perfil? Esta acción no se puede deshacer.")) {
            deleteData(correo);
        }
    });

    $("#guardarCambios").on("click", function () {
        var datosActualizados = {
            "nombre": $("#editNombre").val(),
            "sector": $("#editSector").val(),
            "ubicacion": $("#editUbicacion").val(),
            "telefono": $("#editTelefono").val(),
            "correo": $("#editCorreo").val()
        };

        console.log("Enviando actualización de empresa:", datosActualizados, "empresaId:", empresaId);

        if (!empresaId) {
            alert("No se ha cargado tu perfil empresarial todavía. Recarga la página e intenta de nuevo.");
            return;
        }

        callApi("http://localhost:8080/empresa/" + empresaId, "PUT", datosActualizados, function (response) {
            actualizarPerfil(response);

            var modal = bootstrap.Modal.getInstance(document.getElementById('modalEditar'));
            modal.hide();
        }, function (error) {
            console.error("Error al actualizar la empresa:", error);
            alert("No se pudo guardar los cambios: " + JSON.stringify(error));
        });
    });
});

function previewFoto(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = ev => {
            document.getElementById('fotoPreview').src = ev.target.result;
        };
        reader.readAsDataURL(file);
    }
}