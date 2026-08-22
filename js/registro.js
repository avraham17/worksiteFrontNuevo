var registros = [];

$(function (){

$("#nombre, #Apellido, #correo, #tipoDocumento, #Cedula, #telefono, #fechaNacimiento, #Genero, #experiencia, #contraseña, #confirmar, #cv, #Descripcion, #Estudio, #Cargo, #Ciudad ").on("change", onChangeInputWithErrorClass);
$("#botonRegistrarse").click(onClickButton);

// El campo de código de administrador solo se muestra (y se exige) si
// el usuario elige la cuenta ADMIN. Para cualquier otro rol se oculta
// y se limpia, para no mandarlo por accidente.
$("#rol").on("change", function () {
    if ($(this).val() === "ADMIN") {
        $("#grupoCodigoAdmin").show();
    } else {
        $("#grupoCodigoAdmin").hide();
        $("#codigoAdmin").val("").removeClass("error");
    }
});

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

  if ($("#Ciudad").val() === "") {
    $("#Ciudad").addClass("error");
    isFormValid = false;
  }

  if ($("#Cargo").val() === "") {
    $("#Cargo").addClass("error");
    isFormValid = false;
  }

  if ($("#Estudio").val() === "") {
    $("#Estudio").addClass("error");
    isFormValid = false;
  }

  if ($("#Descripcion").val() === "") {
    $("#Descripcion").addClass("error");
    isFormValid = false;
  }

  if ($("#rol").val() === "") {
    $("#rol").addClass("error");
    isFormValid = false;
  }

  // El código de administrador solo es obligatorio si eligieron ese rol.
  if ($("#rol").val() === "ADMIN" && $("#codigoAdmin").val() === "") {
    $("#codigoAdmin").addClass("error");
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
    "ciudad": $("#Ciudad").val (),
    "cargo": $("#Cargo").val (),
    "estudio": $("#Estudio").val (),
    "descripcion": $("#Descripcion").val (),
    "rolNombre": $("#rol").val (),
    "codigoAdmin": $("#codigoAdmin").val (),
    
  };


saveData (newRegistro);


}

function saveData (data) {
var base_url = "http://localhost:8080/ResgistroUsuario";
var method = "POST";
callApi (base_url, method, data, cbSuccess, cbError);

}

function cbSuccess (data)  {   
  console.log(">>> Respuesta completa del registro:", data);
  console.log(">>> data.data:", data.data);
  console.log(">>> rolNombre recibido:", data.data ? data.data.rolNombre : "data.data es undefined");
   console.log(">>> token recibido:", data.data ? data.data.token : "data.data es undefined");

  alert("Registro guardado correctamente");
    $("#formRegistro")[0].reset();

    localStorage.setItem("idUsuario", data.data.id);
    localStorage.setItem("correoUsuario", data.data.correoElectronico);
    localStorage.setItem("rol", data.data.rolNombre);
    localStorage.setItem("token", data.data.token);

    if (data.data.rolNombre === "EMPRESA") {
        window.location.href = "empresa.html";
    } else {
        window.location.href = "inicio 2.html";
    }
}

function cbError (data)  {
  var mensaje = (data && data.message) ? data.message : "Ocurrió un error al registrarte. Intenta de nuevo.";
  alert(mensaje);
}