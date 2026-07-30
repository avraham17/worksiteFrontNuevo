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

    // Header de autenticación: se arma dinámicamente con el token real del login.
    // Si no hay sesión (ej. en login/registro), simplemente no se manda el header.
    var headers = {};
    var token = localStorage.getItem("token");
    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    $.ajax({
        url: url,
        type: method,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: jsonData, 
        headers: headers,
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

                // Si el usuario no está autenticado o su token expiró/no es válido,
                // lo mandamos directo a iniciar sesión de nuevo.
                if (xhr.status === 401) {
                    localStorage.removeItem("token");
                    alert("Tu sesión expiró o no es válida. Inicia sesión de nuevo.");
                    window.location.href = "sesion.html";
                    return;
                }

                if (xhr.status === 403) {
                    alert("No tienes permiso para realizar esta acción.");
                }

                // Intentamos convertir la respuesta en un objeto usable (ej. error.message)
                var errorObj;
                try {
                    errorObj = JSON.parse(xhr.responseText);
                } catch (parseErr) {
                    errorObj = xhr.responseText;
                }

                cbError(errorObj);

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