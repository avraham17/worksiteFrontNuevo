var registros = [];

$(function (){

$("#nombre, #Apellido, #correo, #tipoDocumento, #Cedula, #telefono, #fechaNacimiento, #Genero, #experiencia, #contraseña, #confirmar, #cv").on("change", onChangeInputWithErrorClass);
$("#botonRegistrarse").click(onClickButton);

});


 var onChangeInputWithErrorClass = function (e) {
  removeClassError(e.target);
}

var onClickButton = function (e) {
  e.preventDefault();
  var isFormValid = true;

  if ($("#nombre").val() === "") {
    $("#nombre").addClass("error");
    isFormValid = false;
  }

  if ($("#correo").val() === "") {
    $("#correo").addClass("error");
    isFormValid = false;
  }
   if ($("#Apellido").val() === "") {
    $("#Apellido").addClass("error");
    isFormValid = false;
  }

  if ($("#tipoDocumento").val() === "") {
    $("#tipoDocumento").addClass("error");
    isFormValid = false;
  }

  if ($("#Cedula").val() === "") {
    $("#Cedula").addClass("error");
    isFormValid = false;
  }

  if ($("#telefono").val() === "") {
    $("#telefono").addClass("error");
    isFormValid = false;
  }

  if ($("#fechaNacimiento").val() === "") {
    $("#fechaNacimiento").addClass("error");
    isFormValid = false;
  }

  if ($("#Genero").val() === "") {
    $("#Genero").addClass("error");
    isFormValid = false;
  }

  if ($("#experiencia").val() === "") {
    $("#experiencia").addClass("error");
    isFormValid = false;
  }

  if ($("#contraseña").val() === "") {
    $("#contraseña").addClass("error");
    isFormValid = false;
  }

  if ($("#confirmar").val() === "") {
    $("#confirmar").addClass("error");
    isFormValid = false;
  }

  if (!isFormValid) {
    alert("Formulario incompleto!");
    return;
  }

  var newRegistro = {
    "nombres": $("#nombre").val (),
    "apellidos": $("#Apellido").val (),
    "correoElectronico": $("#correo").val (),
    "tipoIdentificacion": $("#tipoDocumento").val (),
    "cedula": $("#Cedula").val (),
    "numeroTelefonico": $("#telefono").val (),
    "fechaNacimiento": $("#fechaNacimiento").val (),
    "genero": $("#Genero").val (),
    "anosExperiencia": $("#experiencia").val (),
    "contrasenia": $("#contraseña").val (),
    
  };


saveData (newRegistro);



}

function saveData (data) {
var base_url = "http://localhost:8080/ResgistroUsuario";
var method = "POST";
callApi (base_url, method, data, cbSuccess, cbError);

}

function cbSuccess (data)  {   
  alert("Registro guardado correctamente");

    $("#formRegistro")[0].reset();

    localStorage.setItem("idUsuario", data.data.id);
    window.location.href = "perfil.html";
}

function cbError (data)  {
  alert(JSON.stringify(data));
}

