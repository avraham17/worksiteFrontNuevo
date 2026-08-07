var registros = [];

$(function (){

$("#nombre, #sector, #correo, #ciudad, #telefono ").on("change", onChangeInputWithErrorClass);
$("#botonRegistrarse").click(onClickButton);

});
 
 var onChangeInputWithErrorClass = function (e) {
  removeClassError(e.target);
}

    var onClickButton = function (e) {
  e.preventDefault();

    var newRegistro = {
    "nombre": $("#nombre").val (),
    "sector": $("#sector").val (),
    "ubicacion": $("#ciudad").val (),
    "telefono": $("#telefono").val (),
    "correo": $("#correo").val (),
    "idUsuario": parseInt(localStorage.getItem("idUsuario"))
    
  };

  saveData (newRegistro);

}

function saveData (data) {
var base_url = "http://localhost:8080/empresa";
var method = "POST";
callApi (base_url, method, data, cbSuccess, cbError);

}

function cbSuccess (data)  {   
  alert("Registro de empresa guardado correctamente");
     console.log(data);

    localStorage.setItem("nombreEmpresa", $("#nombre").val());

    $("#formRegistro")[0].reset();
    window.location.href = "perfil-empresa.html";
}

function cbError (data)  {
  alert(JSON.stringify(data));
}