$(function (){

$()
$("botonRegistrarse").click(onClickButton);

});
 
    var onChangeInputWithErrorClass = function (e){
      removeClassError (e.target);
    }

    var onClickButton = function (e) {
      e.preventDefault ();
      var isFormValid = true;
    }

    if ($("").val ()===""){
      $("").addClass("error")
      isFormValid = false;
    }
    if(!isFormValid){
      aler ("Formulario incompleto!");
    }

    alert ("Formulario completo");



    function removeClassError (target){
      $(target),removeClass("error");
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



