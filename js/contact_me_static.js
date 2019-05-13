$(function(){
  $("input,textarea").jqBootstrapValidation({
    preventSubmit: true, submitError: function($form, event, errors){
      //Mensajes o eventos de error adicionales
    },

    filter: function(){
      return $(this).is(":visible");
    },
  });

  $("a[data-toggle=\"tab\"]").click(function(e){
    e.preventDefault();
    $(this).tab("show");
  });
});

//Al hacer clic en Full hide o en cajas de éxito/error
$('#name').focus(function(){
  $('#success').html('');
});
