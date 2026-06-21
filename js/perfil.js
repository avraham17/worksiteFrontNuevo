

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

        $("#mostrarNombre").text(response.data.nombres + " " + response.data.apellidos);
        $("#mostrarCorreo").text(response.data.correoElectronico);
        $("#mostrarTelefono").text(response.data.numeroTelefonico);
        $("#mostrarCedula").text(response.data.cedula);
        $("#mostrarfechaNacimiento").text(response.data.fechaNacimiento);
        $("#mostrarOcupacion").text(response.data.Cargo);
        $("#mostrarnivelEstudio").text(response.data.estudio);
        $("#mostrarDescripcion").text(response.data.Descripcion);
        $("#mostrarCiudad").text(response.data.Ciudad);
                                                                                                                                        
    alert("datos completados correctamente");

        
    }                                           
    function actualizarPerfil(response){


    $("#mostrarNombre").text(response.data.nombres + " " + response.data.apellidos);
        $("#mostrarCorreo").text(response.data.correoElectronico);
        $("#mostrarTelefono").text(response.data.numeroTelefonico);
        $("#mostrarCedula").text(response.data.cedula);
        $("#mostrarfechaNacimiento").text(response.data.fechaNacimiento);
        $("#mostrarOcupacion").text(response.data.cargo);
        $("#mostrarnivelEstudio").text(response.data.estudio);
        $("#mostrarDescripcion").text(response.data.descripcion);
        $("#mostrarCiudad").text(response.data.ciudad);

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

        $("#btneditar").on("click", function () {
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
        "contrasenia": $("#editContrasenia").val(),
        "tipoIdentificacion": $("#editTipoId").val(),
        
    };
    

    updateData(idUsuario, datosActualizados); 

    var modal = bootstrap.Modal.getInstance(document.getElementById('modalEditar'));
    modal.hide();

});


document.addEventListener("DOMContentLoaded", function () {

    const upload = document.getElementById('photoUpload');
    const preview = document.getElementById('preview');

    if (upload) {
        upload.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    preview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

   
});

});
