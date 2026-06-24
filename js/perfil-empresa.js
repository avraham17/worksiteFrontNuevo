

    function loadData(idUsuario){

        callApi(
        "http://localhost:8080/empresa/" + idUsuario,"GET",null,cargarPerfil,cbError
        );
    }

    function updateData(idUsuario, datos){

        callApi(
       "http://localhost:8080/empresa/" + idUsuario,"PUT",datos,actualizarPerfil,cbError
        );
    }

    function deleteData(correo){
        callApi(
            "http://localhost:8080/empresa/correo/" + correo, "DELETE", null, eliminarPerfil, cbError
        );
    }

    function cargarPerfil(response) {
        console.log(response.data);


         var empresa = response.data.data;
        $("#mostrarNombre").text(response.data.nombre);
        $("#mostrarCorreo").text(response.data.correo);
        $("#mostrarTelefono").text(response.data.telefono);
        $("#mostrarNit").text(response.data.nit);
        $("#mostrarUbicacion").text(response.data.ubicacion);
        $("#mostrarSector").text(response.data.sector);
        
                                                                                                                       
        
    }                                           
  function actualizarPerfil(response){

        $("#mostrarNombre").text(response.data.nombre);
        $("#mostrarCorreo").text(response.data.correo);
        $("#mostrarTelefono").text(response.data.telefono);
        //$("#mostrarNit").text(response.data.nit);
        $("#mostrarUbicacion").text(response.data.ubicacion);
       $("#mostrarSector").text(response.data.sector);

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

            $("#guardarCambios").on("click", function () {
            var idUsuario = localStorage.getItem("idUsuario");

             
        var datosActualizados = {
            "nombre": $("#editNombre").val(),
            "sector": $("#editSector").val(),     
            "ubicacion": $("#editUbicacion").val(),
            "telefono": $("#editTelefono").val(),
            "correo": $("#editCorreo").val()
            
            
        };
        

        updateData(idUsuario, datosActualizados); 

        var modal = bootstrap.Modal.getInstance(document.getElementById('modalEditar'));
        modal.hide();

                $("#editNombre").val("");
                $("#editSector").val("");
                $("#editUbicacion").val("");
                $("#editTelefono").val("");
                $("#editCorreo").val("");

    });
});


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

 function cbError(error) {
        console.error("Error en la petición:", error);
    
    }
