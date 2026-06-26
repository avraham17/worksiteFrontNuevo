    
    function updateData(idUsuario, contrasenia) {

    callApi(
            "http://localhost:8080/ResgistroUsuario/" + idUsuario + "/contrasenia",
            "PUT",
            contrasenia,
            actualizarContrasenia,
            cbError
            );
    }

    function actualizarContrasenia(response) {
         $("#passActual").val(""); 
            $("#passNueva").val(""); 
            $("#passConfirmar").val(""); 

            alert("Contraseña actualizada correctamente");
        
    }

    $(function () {
        $("#btnActualizarPass").on("click", function () {
            var idUsuario = localStorage.getItem("idUsuario");

            var datosActualizados ={
                "contrasenia": $("#passNueva").val(),
            };

             
            
            if ($("#passActual").val() === "" || $("#passNueva").val() === "" || $("#passConfirmar").val() === "") {
                alert("Por favor, complete todos los campos");
                return;
            }
            if ($("#passNueva").val().length < 4) {
                alert("La nueva contraseña debe tener al menos 4 caracteres");
                return;
            }
            if ($("#passNueva").val() !== $("#passConfirmar").val()) {
                alert("Las contraseñas no coinciden");
                return;
            }

            callApi(
                "http://localhost:8080/ResgistroUsuario/" + idUsuario,
                "GET", null,
               
                function (response) {
                    var contraseniaBD = response.data.contrasenia;

                
                    if ($("#passActual").val() !== contraseniaBD) {
                        alert("La contraseña actual es incorrecta");
                        return;
                    }

                    var datosActualizados = {
                        "contrasenia": $("#passNueva").val()
                    };

                    updateData(idUsuario, datosActualizados);
           
                },
                cbError
            );

        
            
        });
    });


function cbError(error) {
        console.error("Error en la petición:", error);
        alert("Error General");
    }









    function showTab(tab, el) {
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
        document.getElementById('tab-' + tab).classList.add('active');
        el.classList.add('active');
        return false;
    }

    window.addEventListener("DOMContentLoaded", function () {
        const btnSeguridad = document.querySelector('[onclick*="seguridad"]');
        if (btnSeguridad) showTab('seguridad', btnSeguridad);
    });
