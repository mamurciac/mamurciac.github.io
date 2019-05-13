$(function(){
  $("input,textarea").jqBootstrapValidation({
    preventSubmit: true, submitError: function($form, event, errors){
      //Mensajes o eventos de error adicionales
    }, submitSuccess: function($form, event){
      //Prevención por defecto en el comportamiento de los envíos
      event.preventDefault();
      //Obtención de valores del formulario
      var name = $("input#name").val();
      var email = $("input#email").val();
      var phone = $("input#phone").val();
      var message = $("textarea#message").val();
      var firstName = name; //Para mensaje de éxito o falla

      //Se verifican espacios en blanco en el nombre
      if(firstName.indexOf(' ') >= 0){
        firstName = name.split(' ').slice(0, -1).join(' ');
      }

      $.ajax({
        url: "././mail/contact_me.php", type: "POST", data: {
          name: name,
          phone: phone,
          email: email,
          message: message
        }, cache: false, success: function(){
          //Mensaje de éxito
          $('#success').html("<div class='alert alert-success'>");
          $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;").append("</button>");
          $('#success > .alert-success').append("<strong>Your message has been sent. </strong>");
          $('#success > .alert-success').append('</div>');
          //Limpieza de todos los campos
          $('#contactForm').trigger("reset");
        }, error: function(){
          //Mensaje de falla
          $('#success').html("<div class='alert alert-danger'>");
          $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;").append("</button>");
          $('#success > .alert-danger').append("<strong>Sorry, it seems that my mail server is not responding. Please try again later!");
          $('#success > .alert-danger').append('</div>');
          //Limpieza de todos los campos
          $('#contactForm').trigger("reset");
        },
      })
    }, filter: function(){
      return $(this).is(":visible");
    },
  });

  $("a[data-toggle=\"tab\"]").click(function(e){
    e.preventDefault();
    $(this).tab("show");
  });
});

/* Al hacer clic en ocultar cajas de éxito o de falla */
$('#name').focus(function(){
  $('#success').html('');
});
