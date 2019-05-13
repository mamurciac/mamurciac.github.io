/* Inicio de Bootstrap - Tema Freelancer de Bootstrap (http://startbootstrap.com)
 Código licenciado bajo la licencia de Apache v2.0
 Para más detalles, revisar http://www.apache.org/licenses/LICENSE-2.0 */

//jQuery para la característica de (desplazamiento) scroll de página (Se requiere el plugin de jQuery Easy)
$(function(){
  $('.page-scroll a').bind('click', function(event){
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: $($anchor.attr('href')).offset().top
    }, 1500, 'easeInOutExpo');
    event.preventDefault();
  });
});

//Encabezados de etiquetas flotantes para el formulario de contacto
$(function(){
  $("body").on("input propertychange", ".floating-label-form-group", function(e){
    $(this).toggleClass("floating-label-form-group-with-value", !! $(e.target).val());
  }).on("focus", ".floating-label-form-group", function(){
    $(this).addClass("floating-label-form-group-with-focus");
  }).on("blur", ".floating-label-form-group", function(){
    $(this).removeClass("floating-label-form-group-with-focus");
  });
});

//Resaltado de la navegación en la parte superior a medida que se produce el desplazamiento
$('body').scrollspy({
  target: '.navbar-fixed-top'
})

//Se cierra el menú responsive al hacer clic en un ítem del menú
$('.navbar-collapse ul li a').click(function(){
  $('.navbar-toggle:visible').click();
});
