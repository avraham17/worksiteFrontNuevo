var empresaId = null;
var nombreEmpresaActual = "";
var empresaActual = null; 
var fotoBase64Nueva = null;
var mapaUsuarios = {}; 

function cbError(error) {
    console.error("Error en la petición:", error);
}

function loadData() {
    var idUsuario = localStorage.getItem("idUsuario");
    var rol = localStorage.getItem("rol");

    callApi("http://localhost:8080/empresa/usuario/" + idUsuario, "GET", null, function (response) {
        cargarPerfil({ data: response.data });
    }, function (error) {
        console.log("No se encontró un perfil empresarial asociado a tu cuenta:", error);

        if (rol === "ADMIN") {
            // El admin no es una empresa: dejamos la página navegable, sin bloquear con alert.
            mostrarEstadoSinEmpresaAdmin();
        } else {
            alert("No se encontró un perfil empresarial asociado a tu cuenta.");
        }
    });
}

function mostrarEstadoSinEmpresaAdmin() {
    $("#nombreMostrar").text("Cuenta de administrador");
    $("#cargoMostrar").text("Sin perfil empresarial");
    $("#mostrarNombre").text("—");
    $("#mostrarCorreo").text("—");
    $("#mostrarTelefono").text("—");
    $("#mostrarUbicacion").text("—");
    $("#mostrarSector").text("—");
    $("#empAvatarCircle").text("A");

    $("#statOfertas").text(0);
    $("#statActivas").text(0);
    $("#statPostulantes").text(0);

    $("#listaOfertasEmpresa").empty();
    $("#sinOfertas")
        .text("Esta cuenta de administrador no tiene un perfil empresarial, así que no hay ofertas propias que mostrar.")
        .show();

    // Editar/eliminar no aplican a una cuenta sin perfil empresarial
    $("#btneditar, #btneliminar")
        .prop("disabled", true)
        .css("opacity", 0.5)
        .attr("title", "No disponible: esta cuenta no tiene perfil empresarial");
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
    empresaActual = e; 

    $("#nombreMostrar").text(e.nombre);
    $("#cargoMostrar").text(e.sector);
    $("#mostrarNombre").text(e.nombre);
    $("#mostrarCorreo").text(e.correo);
    $("#mostrarTelefono").text(e.telefono);
    $("#mostrarUbicacion").text(e.ubicacion);
    $("#mostrarSector").text(e.sector);
    $("#empAvatarCircle").text((e.nombre || "?").trim().charAt(0).toUpperCase());

     if (response.data.foto) {
            $("#fotoPreview").attr("src", response.data.foto);
        }

    cargarOfertasEmpresa();
}

function actualizarPerfil(response) {
    alert("Datos actualizados correctamente");

    if (response.data.foto) {
            $("#fotoPreview").attr("src", response.data.foto);
        }

        fotoBase64Nueva = null;
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

        var meta = $('<div class="emp-oferta-meta"></div>').html(
            "📍 " + (o.ubicacion || "—") + "<br>" +
            "👥 " + o.numOfertas + " vacante(s)<br>" +
            "📅 Cierra: " + (o.fechaDeCierre || "—")
        );

  
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

    // getOrCreateInstance reutiliza el modal si ya está abierto, en vez de crear uno nuevo
    // encima (que era lo que iba apilando fondos oscuros con cada clic en Aceptar/Rechazar).
    var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalPostulantes'));
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
            var fila = $('<div class="emp-postulante-row"></div>');
            var claseBadge = obtenerClaseBadge(p.estadoPostulacion);

            var cabecera = $('<div class="emp-postulante-cabecera"></div>');
            var avatar = $('<div class="emp-postulante-avatar"></div>').text("…");
            var info = $('<div class="emp-postulante-info"></div>').html(
                "<strong>" + (p.candidato || p.correoCandidato) + "</strong><br>" +
                "<small>" + p.correoCandidato + " · Postulado el " + p.fechaPostulacion + "</small>"
            );

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
            cabecera.append(avatar, info, derecha);

            var detalles = $('<div class="emp-postulante-detalles">Cargando datos del candidato...</div>');

            fila.append(cabecera, detalles);
            contenedor.append(fila);

            // Trae el perfil completo del candidato para mostrar sus datos extra
            callApi("http://localhost:8080/ResgistroUsuario/" + p.idCandidato, "GET", null, function (resp) {
                var c = resp.data;
                avatar.text((c.nombres || "?").trim().charAt(0).toUpperCase());

                detalles.html(
                  fila_detalle("👤nombre", c.nombres + " " + c.apellidos) +
                    fila_detalle("📧correo electrónico", c.correoElectronico) +
                    fila_detalle("💼 Ocupación u Oficio", c.Cargo) +
                    fila_detalle("🎓 Nivel de Estudio", c.estudio) +
                    fila_detalle("📞 Número Telefónico", c.numeroTelefonico) +
                    fila_detalle("📍 Ciudad", c.Ciudad) +
                    fila_detalle("🎂 Fecha de Nacimiento", c.fechaNacimiento) +
                    fila_detalle("📝 Descripción", c.Descripcion, true)
                );

                var contenedorCv = $('<div class="emp-postulante-detalle emp-postulante-detalle-full"></div>');
                if (c.cv) {
                    var btnVerCv = $('<button type="button" class="emp-btn-ver">📄 Ver hoja de vida</button>');
                    btnVerCv.on("click", function () {
                        verHojaDeVida(c.cv);
                    });
                    contenedorCv.append(btnVerCv);
                } else {
                    contenedorCv.html('<span class="emp-postulante-detalle-label">📄 Este candidato aún no ha subido su hoja de vida</span>');
                }
                detalles.append(contenedorCv);
            }, function () {
                avatar.text((p.candidato || "?").trim().charAt(0).toUpperCase());
                detalles.html('<span class="emp-postulante-detalle-error">No se pudieron cargar los datos adicionales del candidato.</span>');
            });
        });
    }, cbError);
}

function obtenerClaseBadge(estadoPostulacion) {
    var estado = (estadoPostulacion || "").toLowerCase();
    if (estado === "aceptado" || estado === "aceptada") return "badge-aceptado";
    if (estado === "rechazado" || estado === "rechazada") return "badge-rechazado";
    return "badge-pendiente";
}

function fila_detalle(etiqueta, valor, anchoCompleto) {
    var clase = anchoCompleto ? "emp-postulante-detalle emp-postulante-detalle-full" : "emp-postulante-detalle";
    return (
        '<div class="' + clase + '">' +
            '<span class="emp-postulante-detalle-label">' + etiqueta + '</span>' +
            '<span class="emp-postulante-detalle-valor">' + (valor || "—") + '</span>' +
        '</div>'
    );
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

// El modal visor de PDF se inyecta por JS (no depende de que exista en el
// HTML). Se usa tanto para ver la hoja de vida de un candidato.
function asegurarModalVerCv() {
    if (document.getElementById('modalVerCv')) return;

    $("body").append(
        '<div class="modal fade" id="modalVerCv" tabindex="-1">' +
            '<div class="modal-dialog modal-lg modal-dialog-scrollable">' +
                '<div class="modal-content" style="height:85vh;">' +
                    '<div class="modal-header">' +
                        '<h2 class="modal-title">Hoja de vida</h2>' +
                        '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>' +
                    '</div>' +
                    '<div class="modal-body p-0" style="height:100%;">' +
                        '<iframe id="iframeCv" src="" style="width:100%; height:100%; border:none;"></iframe>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>'
    );

    $("#modalVerCv").on("hidden.bs.modal", function () {
        $("#iframeCv").attr("src", "");
    });
}

function verHojaDeVida(cvBase64) {
    asegurarModalVerCv();
    $("#iframeCv").attr("src", cvBase64);
    var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalVerCv'));
    modal.show();
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
        var modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEditar'));
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
            const src = ev.target.result;
            document.getElementById('fotoPreview').src = src;
            fotoBase64Nueva = src; // por si el usuario sigue y guarda el modal de edición
            guardarFotoAutomatico(src); // el botón "Cambiar foto" guarda directo, sin pasar por el modal
        };
        reader.readAsDataURL(file);
    }
}

// El botón "Cambiar foto" está fuera del modal de edición. En vez de reenviar
// TODO el perfil, usamos un endpoint dedicado que solo actualiza la foto.
function guardarFotoAutomatico(fotoBase64) {
    if (!empresaId) {
        alert("Aún no se ha cargado tu perfil empresarial");
        return;
    }

    callApi(
        "http://localhost:8080/empresa/" + empresaId + "/foto", "PUT",
        { "foto": fotoBase64 },
        function () {
            fotoBase64Nueva = null;
            loadData(); // recarga el perfil para reflejar la foto guardada
        },
        cbError
    );
}