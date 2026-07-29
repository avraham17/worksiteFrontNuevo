var usuarioActual = null; // objeto completo, para precargar el modal de edición

    function cbError(error) {
        console.error("Error en la petición:", error);
    
    }


    function loadData(idUsuario){

        callApi(
        "http://localhost:8080/ResgistroUsuario/" + idUsuario,"GET",null,cargarPerfil,cbError
        );
    }

    function updateData(idUsuario, datos){

        callApi(
        "http://localhost:8080/ResgistroUsuario/" + idUsuario,"PUT",datos,actualizarPerfil,cbError
        );
    }

    function deleteData(correo){
        callApi(
            "http://localhost:8080/ResgistroUsuario/correo/" + correo, "DELETE", null, eliminarPerfil, cbError
        );
    }

    function cargarPerfil(response) {
        console.log(response.data);
        usuarioActual = response.data; // guardamos todo para precargar el modal de edición

        $("#nombreMostrar").text(response.data.nombres + " " + response.data.apellidos);
        $("#mostrarNombre").text(response.data.nombres + " " + response.data.apellidos);
        $("#mostrarCorreo").text(response.data.correoElectronico);
        $("#mostrarTelefono").text(response.data.numeroTelefonico);
        $("#mostrarCedula").text(response.data.cedula);
        $("#mostrarfechaNacimiento").text(response.data.fechaNacimiento);
        $("#mostrarOcupacion").text(response.data.Cargo);
        $("#cargoMostrar").text(response.data.Cargo);
        $("#mostrarnivelEstudio").text(response.data.estudio);
        $("#mostrarDescripcion").text(response.data.Descripcion);
        $("#mostrarCiudad").text(response.data.Ciudad);
                                                                                                                                        
        
    }                                           
    function actualizarPerfil(response){


        $("#nombreMostrar").text(response.data.nombres + " " + response.data.apellidos);
        $("#mostrarNombre").text(response.data.nombres + " " + response.data.apellidos);
        $("#mostrarCorreo").text(response.data.correoElectronico);
        $("#mostrarTelefono").text(response.data.numeroTelefonico);
        $("#mostrarCedula").text(response.data.cedula);
        $("#mostrarfechaNacimiento").text(response.data.fechaNacimiento);
        $("#mostrarOcupacion").text(response.data.Cargo);
        $("#mostrarnivelEstudio").text(response.data.estudio);
        $("#mostrarDescripcion").text(response.data.Descripcion);
        $("#mostrarCiudad").text(response.data.Ciudad);
        $("#cargoMostrar").text(response.data.Cargo);

        var idUsuario = localStorage.getItem("idUsuario");

        loadData(idUsuario);
        alert("datos actualizados correctamente");
    }

    function eliminarPerfil(response){
        alert("Perfil eliminado correctamente");
        localStorage.removeItem("idUsuario");
        window.location.href = "sesion.html";
    }

    $(function () {

            var idUsuario = localStorage.getItem("idUsuario");
            loadData(idUsuario);

            var rol = localStorage.getItem("rol");
        if (rol === "CANDIDATO") {
            $("#seccionPostulaciones").show();
            cargarPostulaciones();
        }

            $("#btneditar").on("click", function () {
            if (usuarioActual) {
                $("#editNombres").val(usuarioActual.nombres || "");
                $("#editApellidos").val(usuarioActual.apellidos || "");
                $("#editCorreo").val(usuarioActual.correoElectronico || "");
                $("#editTelefono").val(usuarioActual.numeroTelefonico || "");
                $("#editNuDocumento").val(usuarioActual.cedula || "");
                $("#editgenero").val(usuarioActual.genero || "");
                $("#editAnios").val(usuarioActual.anosExperiencia || "");
                $("#editFecha").val(usuarioActual.fechaNacimiento || "");
                $("#editCiudad").val(usuarioActual.Ciudad || "");
                $("#editCargo").val(usuarioActual.Cargo || "");
                $("#editEstudio").val(usuarioActual.estudio || "");
                $("#editDescripcion").val(usuarioActual.Descripcion || "");
                $("#editTipoId").val(usuarioActual.tipoIdentificacion || "");
                $("#editContrasenia").val(""); // nunca se precarga una contraseña
            }
            var modal = new bootstrap.Modal(document.getElementById('modalEditar'));
            modal.show();

        });

        $("#btneliminar").on("click", function () {
            var correo = $("#mostrarCorreo").text(); 
            
            if(confirm("¿Estás seguro de eliminar tu perfil?")) {
                deleteData(correo);
            }
        });

            $("#guardarEdicion").on("click", function () {
            var idUsuario = localStorage.getItem("idUsuario");

        var datosActualizados = {
            "nombres": $("#editNombres").val(),
            "apellidos": $("#editApellidos").val(),
            "correoElectronico": $("#editCorreo").val(),
            "numeroTelefonico": $("#editTelefono").val(),
            "cedula": $("#editNuDocumento").val(),
            "genero": $("#editgenero").val(),
            "anosExperiencia": $("#editAnios").val(),
            "fechaNacimiento": $("#editFecha").val(),
            "ciudad": $("#editCiudad").val(),
            "cargo": $("#editCargo").val(),
            "estudio": $("#editEstudio").val(),
            "descripcion": $("#editDescripcion").val(),
            // Si se deja en blanco, mandamos la contraseña actual para no borrarla.
            // OJO: esto es un parche del frontend; lo ideal es que el backend
            // ignore este campo si llega vacío. Avísame si quieres que lo ajustemos ahí también.
            "contrasenia": $("#editContrasenia").val() || usuarioActual.contrasenia,
            "tipoIdentificacion": $("#editTipoId").val(),
            
        };
        

        updateData(idUsuario, datosActualizados); 

        var modal = bootstrap.Modal.getInstance(document.getElementById('modalEditar'));
        modal.hide();

    });
});

function cargarPostulaciones() {
    var idUsuario = localStorage.getItem("idUsuario");

    callApi(
        "http://localhost:8080/postulacion/candidato/" + idUsuario, "GET", null,
        mostrarPostulaciones, cbError
    );
}

function mostrarPostulaciones(response) {
    var misPostulaciones = response.data || [];

    var contenedor = $("#listaPostulaciones");
    contenedor.empty();

    if (misPostulaciones.length === 0) {
        $("#sinPostulaciones").show();
        return;
    }

    $("#sinPostulaciones").hide();

    misPostulaciones.forEach(function (p) {
        var claseBadge = "badge-pendiente";
        var estado = (p.estadoPostulacion || "").toLowerCase();

        if (estado === "aceptado" || estado === "aceptada") {
            claseBadge = "badge-aceptado";
        } else if (estado === "rechazado" || estado === "rechazada") {
            claseBadge = "badge-rechazado";
        }

        var item = $(
            '<div class="item postulacion-item">' +
                '<div>' +
                    '<strong>' + p.oferta + '</strong><br>' +
                    '<small>Postulado el: ' + p.fechaPostulacion + '</small>' +
                '</div>' +
                '<span class="badge-estado ' + claseBadge + '">' + p.estadoPostulacion + '</span>' +
            '</div>'
        );

        contenedor.append(item);
    });
}

function previewFoto(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = ev => {
            const src = ev.target.result;
            document.getElementById('fotoPreview').src = src;
        
        };
        reader.readAsDataURL(file);
    }
}