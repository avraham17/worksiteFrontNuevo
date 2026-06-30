var registros = [];

$(function (){

$("#titulo, #empresa, #sector, #ubicacion, #cierre, #modalidad, #fechaDePublicacion, #estado, #descripcion, #responsabilidades, #requisitos, #salario, #jornada, #contrato, #beneficios, #experiencia, #nivel, #idioma, #vacantes").on("change", onChangeInputWithErrorClass);
$("#botonPublicar").click(onClickButton);

});

var onChangeInputWithErrorClass = function (e) {
  removeClassError(e.target);
}

    var onClickButton = function (e) {
  e.preventDefault();

    var newRegistro = {
    "titulo": $("#titulo").val (),
    "empresa": $("#empresa").val (),
    "sector": $("#sector").val (),
    "ubicacion": $("#ubicacion").val (),
    "modalidad": $("#modalidad").val (),
    "fechaDePublicacion": $("#fechaDePublicacion").val (),
    "estado": $("#estado").val (),
    "descripcion": $("#descripcion").val (),
    "responsabilidades": $("#responsabilidades").val (),
    "requisitos": $("#requisitos").val (),
    "salario": $("#salario").val (),
    "jornada": $("#jornada").val (),
    "tipoDeContrato": $("#contrato").val (),
    "experiencia": $("#experiencia").val (),
    "nivelEducativo": $("#nivel").val (),
    "numOfertas": $("#vacantes").val (),
    "fechaDeCierre": $("#cierre").val (),
    
  };

  saveData (newRegistro);

}

function saveData (data) {
var base_url = "http://localhost:8080/oferta";
var method = "POST";
callApi (base_url, method, data, cbSuccess, cbError);

}

function cbSuccess (data)  {   
  alert("Registro de empresa guardado correctamente");
     console.log(data);
    $("#botonPublicar").closest("form")[0].reset();


    localStorage.setItem("idUsuario", data.data.id);
    window.location.href = "inicio 2.html";
}

function cbError (data)  {
  alert(JSON.stringify(data));
}
