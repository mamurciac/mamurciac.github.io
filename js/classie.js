/* Classie - Funciones tipo helper
 Proveniente de Bonzo en https://github.com/ded/bonzo
 classie.has(elem, 'my-class') -> true/false
 classie.add(elem, 'my-new-class')
 classie.remove(elem, 'my-unwanted-class')
 classie.toggle(elem, 'my-class') */

/*jshint del navegador: true, strict: true, undef: true */
/*global define: false */

(function(window){
  'use strict';

  //Funciones de apoyo de Bonzo en https://github.com/ded/bonzo
  function classReg(className){
    return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
  }

  //Soporte de classList para gestión de clases, aunque para ser justos, la API no vale la pena porque no se aceptan múltiples clases a la vez
  var hasClass, addClass, removeClass;
  if('classList' in document.documentElement){
    hasClass = function(elem, c){
      return elem.classList.contains(c);
    };
    addClass = function(elem, c){
      elem.classList.add(c);
    };
    removeClass = function(elem, c){
      elem.classList.remove(c);
    };
  }else{
    hasClass = function(elem, c){
      return classReg(c).test(elem.className);
    };
    addClass = function(elem, c){
      if(!hasClass(elem, c)){
        elem.className = elem.className + ' ' + c;
      }
    };
    removeClass = function(elem, c){
      elem.className = elem.className.replace(classReg(c), ' ');
    };
  }

  function toggleClass(elem, c){
    var fn = hasClass( elem, c ) ? removeClass : addClass;
    fn(elem, c);
  }

  var classie = {
    //Nombres completos
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass,
    //Nombres cortos
    has: hasClass,
    add: addClass,
    remove: removeClass,
    toggle: toggleClass
  };

  //Para transporte
  if(typeof define === 'function' && define.amd){
    define(classie); //Para AMD
  }else{
    window.classie = classie; //Para navegador global
  }
})(window);
