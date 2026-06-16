$(function () {

    var idUsuario = localStorage.getItem("idUsuario");

    console.log("ID RECUPERADO:", idUsuario);

    loadData(idUsuario);

});

function loadData(idUsuario){


    callApi(
        "http://localhost:8080/ResgistroUsuario/" + idUsuario,
        "GET",
        null,
        cargarPerfil,
        cbError
    );
}

function cargarPerfil(response){


    $("#mostrarNombre").text (
        response.data.nombres + " " + response.data.apellidos
    );

    $("#mostrarCorreo").text(
        response.data.correoElectronico
    );

    $("#mostrarTelefono").text(
        response.data.numeroTelefonico
    );

    $("#mostrarCedula").text(
        response.data.cedula
    );

     $("#mostrarfechaNacimiento").text(
        response.data.fechaNacimiento
    );
}

function cbError(error){
    console.log("Error API:", error);
}















const upload = document.getElementById('photoUpload');
    const preview = document.getElementById('preview');

    upload.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          preview.src = e.target.result;
        }
        reader.readAsDataURL(file);
      }
    });
     function guardarPerfil() {
      document.getElementById('viewName').textContent = document.getElementById('nameInput').value || 'No especificado';
      document.getElementById('viewRole').textContent = document.getElementById('roleInput').value || 'No especificado';
      document.getElementById('viewEmail').textContent = document.getElementById('emailInput').value || 'No especificado';
      document.getElementById('viewBio').textContent = document.getElementById('bioInput').value || 'No especificado';
    }



