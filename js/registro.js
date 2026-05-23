alert("JS conectado");

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

  alert("Formulario completo");
}

function removeClassError(target) {
  $(target).removeClass("error");
}



