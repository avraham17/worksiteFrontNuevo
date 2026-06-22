
var validMethods = ["GET", "POST", "PUT", "DELETE"];


function callApi(url, method, data, cbSuccess, cbError) {

    console.log("callApi :: " + method + " :: " + url);


    isPresent = validMethods.find(function(item){
        return item === method;
    });

    if(!isPresent) {
        alert("Metodo " + method + "No permitido");
        return;
    }

    var jsonData = "";
    if(method === "POST" || method === "PUT") {
        jsonData = JSON.stringify(data);
    }

    $.ajax({
        url: url,
        type: method,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: jsonData, 
        headers: {
            'Authorization':'token123'
        },
        success: function (result) {
            try {
                cbSuccess(result);
            } catch (e) {
                console.log("Error en cbSuccess", e);
            }
        },
        error: function (xhr, status, error) {
            try {
                console.log("STATUS:", xhr.status);
                console.log("ERROR:", error);
                console.log("RESPUESTA:", xhr.responseText);
                cbError(xhr.responseText);

            } catch (e) {
                cbErrorBase(xhr.status);
                console.log("Error en cbError", e);
            }
        }
    });
}

function cbErrorBase(error) {
    alert("El llamado al servidor fallo " + error);
}

function removeClassError(target) {
    $(target).removeClass("error");
}

var onChangeInputWithErrorClass = function (e) {
    removeClassError(e.target);
}

window.addEventListener("DOMContentLoaded", function () {
    
    const nombre   = localStorage.getItem("nombreUsuario")   || "";
    const apellido = localStorage.getItem("apellidoUsuario") || "";

    const inicialNombre   = nombre.charAt(0).toUpperCase();
    const inicialApellido = apellido.charAt(0).toUpperCase();

    const avatar = document.getElementById("avatarInicial");
    if (avatar) {
        avatar.textContent = inicialNombre + inicialApellido;
    }
});