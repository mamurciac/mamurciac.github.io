/* jqBootstrapValidation
 Un plugin para validación automática en formularios con formato para Twitter Bootstrap
 v1.3.6
 Licencia: MIT <http://opensource.org/licenses/mit-license.php> -Observar el archivo de licencia para más detalles
 http://ReactiveRaven.github.com/jqBootstrapValidation/ */

(function($){
	var createdElements = [];
	var defaults = {
		options: {
			prependExistingHelpBlock: false,
			sniffHtml: true, //Para campos con atributo 'required', 'maxlength', etc
			preventSubmit: true, //Esta función detendrá el evento de envío de formulario si la validación falla
			submitError: false, //Esta función se llamará si hay un error al momento de enviar el formulario
			submitSuccess: false, //Esta función se llamará justo antes de enviar un formulario con éxito al servidor
      semanticallyStrict: false, //Se establecerá como verdadero si la salida HTML generada se ordena

      autoAdd: {
				helpBlocks: true
			},

      filter: function(){
        //return $(this).is(":visible"); //Solo se validarán los elementos que se puedan ver
        return true; //Se validan todos los campos
      }
		},

    methods: {
      init: function(options){
        var settings = $.extend(true, {}, defaults);
        settings.options = $.extend(true, settings.options, options);
        var $siblingElements = this;
        var uniqueForms = $.unique($siblingElements.map(function(){
            return $(this).parents("form")[0];
          }).toArray()
        );

        $(uniqueForms).bind("submit", function(e){
          var $form = $(this);
          var warningsFound = 0;
          var $inputs = $form.find("input,textarea,select").not("[type=submit],[type=image]").filter(settings.options.filter);
          $inputs.trigger("submit.validation").trigger("validationLostFocus.validation");
          $inputs.each(function(i, el){
            var $this = $(el), $controlGroup = $this.parents(".control-group").first();
            if($controlGroup.hasClass("warning")){
              $controlGroup.removeClass("warning").addClass("error");
              warningsFound++;
            }
          });

          $inputs.trigger("validationLostFocus.validation");
          if(warningsFound){
            if(settings.options.preventSubmit){
              e.preventDefault();
            }
            $form.addClass("error");
            if($.isFunction(settings.options.submitError)){
              settings.options.submitError($form, e, $inputs.jqBootstrapValidation("collectErrors", true));
            }
          }else{
            $form.removeClass("error");
            if($.isFunction(settings.options.submitSuccess)){
              settings.options.submitSuccess($form, e);
            }
          }
        });

        return this.each(function(){
          //Obtención de referencias de todo lo que es de interés
          var $this = $(this), $controlGroup = $this.parents(".control-group").first(), $helpBlock = $controlGroup.find(".help-block").first(), $form = $this.parents("form").first(), validatorNames = [];

          //Creación de un contenedor de mensaje si no existe
          if(!$helpBlock.length && settings.options.autoAdd && settings.options.autoAdd.helpBlocks){
            $helpBlock = $('<div class="help-block" />');
            $controlGroup.find('.controls').append($helpBlock);
  					createdElements.push($helpBlock[0]);
          }

          //Detectores (Sniffers) HTML para validadores
          if(settings.options.sniffHtml){
            var message = "";

            //Validación del Patrón
            if($this.attr("pattern") !== undefined){
              message = "Not in the expected format<!-- data-validation-pattern-message to override -->";
              if($this.data("validationPatternMessage")) {
                message = $this.data("validationPatternMessage");
              }
              $this.data("validationPatternMessage", message);
              $this.data("validationPatternRegex", $this.attr("pattern"));
            }

            //Validación de valor máximo
            if($this.attr("max") !== undefined || $this.attr("aria-valuemax") !== undefined){
              var max = ($this.attr("max") !== undefined ? $this.attr("max") : $this.attr("aria-valuemax"));
              message = "Too high: Maximum of '" + max + "'<!-- data-validation-max-message to override -->";
              if($this.data("validationMaxMessage")){
                message = $this.data("validationMaxMessage");
              }
              $this.data("validationMaxMessage", message);
              $this.data("validationMaxMax", max);
            }

            //Validación de valor mínimo
            if($this.attr("min") !== undefined || $this.attr("aria-valuemin") !== undefined){
              var min = ($this.attr("min") !== undefined ? $this.attr("min") : $this.attr("aria-valuemin"));
              message = "Too low: Minimum of '" + min + "'<!-- data-validation-min-message to override -->";
              if($this.data("validationMinMessage")){
                message = $this.data("validationMinMessage");
              }
              $this.data("validationMinMessage", message);
              $this.data("validationMinMin", min);
            }

            //Validación de longitud máxima
            if($this.attr("maxlength") !== undefined){
              message = "Too long: Maximum of '" + $this.attr("maxlength") + "' characters<!-- data-validation-maxlength-message to override -->";
              if($this.data("validationMaxlengthMessage")){
                message = $this.data("validationMaxlengthMessage");
              }
              $this.data("validationMaxlengthMessage", message);
              $this.data("validationMaxlengthMaxlength", $this.attr("maxlength"));
            }

            //Validación de longitud mínima
            if($this.attr("minlength") !== undefined){
              message = "Too short: Minimum of '" + $this.attr("minlength") + "' characters<!-- data-validation-minlength-message to override -->";
              if($this.data("validationMinlengthMessage")){
                message = $this.data("validationMinlengthMessage");
              }
              $this.data("validationMinlengthMessage", message);
              $this.data("validationMinlengthMinlength", $this.attr("minlength"));
            }

            //Validación de valor requerido
            if($this.attr("required") !== undefined || $this.attr("aria-required") !== undefined){
              message = settings.builtInValidators.required.message;
              if($this.data("validationRequiredMessage")){
                message = $this.data("validationRequiredMessage");
              }
              $this.data("validationRequiredMessage", message);
            }

            //Validacion de valor numérico
            if($this.attr("type") !== undefined && $this.attr("type").toLowerCase() === "number"){
              message = settings.builtInValidators.number.message;
              if($this.data("validationNumberMessage")){
                message = $this.data("validationNumberMessage");
              }
              $this.data("validationNumberMessage", message);
            }

            //Validación de dirección de correo electrónico
            if($this.attr("type") !== undefined && $this.attr("type").toLowerCase() === "email"){
              //message = "Not a valid email address<!-- data-validation-validemail-message to override -->";
              message = "La dirección de correo electrónico que ingresaste no es válida<!-- data-validation-validemail-message to override -->";
              if($this.data("validationValidemailMessage")){
                message = $this.data("validationValidemailMessage");
              }else if($this.data("validationEmailMessage")){
                message = $this.data("validationEmailMessage");
              }
              $this.data("validationValidemailMessage", message);
            }

            //Validación de chequeo mínimo
            if($this.attr("minchecked") !== undefined){
              message = "Not enough options checked; Minimum of '" + $this.attr("minchecked") + "' required<!-- data-validation-minchecked-message to override -->";
              if($this.data("validationMincheckedMessage")){
                message = $this.data("validationMincheckedMessage");
              }
              $this.data("validationMincheckedMessage", message);
              $this.data("validationMincheckedMinchecked", $this.attr("minchecked"));
            }

            //Validación de chequeo máximo
            if($this.attr("maxchecked") !== undefined){
              message = "Too many options checked; Maximum of '" + $this.attr("maxchecked") + "' required<!-- data-validation-maxchecked-message to override -->";
              if($this.data("validationMaxcheckedMessage")){
                message = $this.data("validationMaxcheckedMessage");
              }
              $this.data("validationMaxcheckedMessage", message);
              $this.data("validationMaxcheckedMaxchecked", $this.attr("maxchecked"));
            }
          }

          //Recolección de nombres de validador
          //Obtención de nombres de validadores
          if($this.data("validation") !== undefined){
            validatorNames = $this.data("validation").split(",");
          }

          //Obtención de datos extra definidos en los atributos de los elementos
          $.each($this.data(), function(i, el){
            var parts = i.replace(/([A-Z])/g, ",$1").split(",");
            if(parts[0] === "validation" && parts[1]){
              validatorNames.push(parts[1]);
            }
          });

          //Normalización de nombres de validadores
          var validatorNamesToInspect = validatorNames;
          var newValidatorNamesToInspect = [];

          //Ciclo que repetidamente expande los validadores de acceso directo en los validadores reales
          do{
            //En mayúscula solo la primera letra de cada nombre
            $.each(validatorNames, function(i, el){
              validatorNames[i] = formatValidatorName(el);
            });

            //Eliminación de nombres de validadores duplicados
            validatorNames = $.unique(validatorNames);

            //Extracción de nuevos nombres de validador de cada comando
            newValidatorNamesToInspect = [];
            $.each(validatorNamesToInspect, function(i, el){
              if($this.data("validation" + el + "Shortcut") !== undefined){
                //Extracción de validadores personalizados
                $.each($this.data("validation" + el + "Shortcut").split(","), function(i2, el2){
                  newValidatorNamesToInspect.push(el2);
                });
              }else if(settings.builtInValidators[el.toLowerCase()]){
                //Extracción de reconocidos built-in
                var validator = settings.builtInValidators[el.toLowerCase()];
                if(validator.type.toLowerCase() === "shortcut"){
                  $.each(validator.shortcut.split(","), function(i, el){
                    el = formatValidatorName(el);
                    newValidatorNamesToInspect.push(el);
                    validatorNames.push(el);
                  });
                }
              }
            });

            validatorNamesToInspect = newValidatorNamesToInspect;
          }while(validatorNamesToInspect.length > 0)

          //Configuración de validadores en arreglos
          var validators = {};
          $.each(validatorNames, function(i, el){
            //Configuración de sobreescritura de mensajes
            var message = $this.data("validation" + el + "Message");
            var hasOverrideMessage = (message !== undefined);
            var foundValidator = false;
            message = (message ? message : "'" + el + "' validation failed <!-- Add attribute 'data-validation-" + el.toLowerCase() + "-message' to input to change this message -->");

            $.each(settings.validatorTypes, function(validatorType, validatorTemplate){
              if(validators[validatorType] === undefined){
                validators[validatorType] = [];
              }
              if(!foundValidator && $this.data("validation" + el + formatValidatorName(validatorTemplate.name)) !== undefined){
                validators[validatorType].push($.extend(true, {
                  name: formatValidatorName(validatorTemplate.name),
                  message: message
                }, validatorTemplate.init($this, el)));
                foundValidator = true;
              }
            });

            if(!foundValidator && settings.builtInValidators[el.toLowerCase()]){
              var validator = $.extend(true, {}, settings.builtInValidators[el.toLowerCase()]);
              if(hasOverrideMessage){
                validator.message = message;
              }
              var validatorType = validator.type.toLowerCase();

              if(validatorType === "shortcut"){
                foundValidator = true;
              }else{
                $.each(settings.validatorTypes, function(validatorTemplateType, validatorTemplate){
                  if(validators[validatorTemplateType] === undefined){
                    validators[validatorTemplateType] = [];
                  }
                  if(!foundValidator && validatorType === validatorTemplateType.toLowerCase()){
                    $this.data("validation" + el + formatValidatorName(validatorTemplate.name), validator[validatorTemplate.name.toLowerCase()]);
                    validators[validatorType].push($.extend(validator, validatorTemplate.init($this, el)));
                    foundValidator = true;
                  }
                });
              }
            }

            if(!foundValidator){
              $.error("Cannot find validation info for '" + el + "'");
            }
          });

          //Almacenamiento de valores de recuperación (Fallback Values)
          $helpBlock.data("original-contents", ($helpBlock.data("original-contents") ? $helpBlock.data("original-contents") : $helpBlock.html()));
          $helpBlock.data("original-role", ($helpBlock.data("original-role") ? $helpBlock.data("original-role") : $helpBlock.attr("role")));
          $controlGroup.data("original-classes", ($controlGroup.data("original-clases") ? $controlGroup.data("original-classes") : $controlGroup.attr("class")));
          $this.data("original-aria-invalid", ($this.data("original-aria-invalid") ? $this.data("original-aria-invalid") : $this.attr("aria-invalid")));

          //Validación
          $this.bind("validation.validation", function(event, params){
            var value = getValue($this);
            //Obtención de una lista de errores para aplicar
            var errorsFound = [];
            $.each(validators, function(validatorType, validatorTypeArray){
              if(value || value.length || (params && params.includeEmpty) || (!!settings.validatorTypes[validatorType].blockSubmit && params && !!params.submitting)){
                $.each(validatorTypeArray, function(i, validator){
                  if(settings.validatorTypes[validatorType].validate($this, value, validator)){
                    errorsFound.push(validator.message);
                  }
                });
              }
            });

            return errorsFound;
          });

          $this.bind("getValidators.validation", function(){
            return validators;
          });

          //Revisión de cambios
          $this.bind("submit.validation", function(){
            return $this.triggerHandler("change.validation", {submitting: true});
          });
          $this.bind(["keyup", "focus", "blur", "click", "keydown", "keypress", "change"].join(".validation ") + ".validation", function(e, params){
            var value = getValue($this);
            var errorsFound = [];

            $controlGroup.find("input,textarea,select").each(function(i, el){
              var oldCount = errorsFound.length;
              $.each($(el).triggerHandler("validation.validation", params), function(j, message){
                errorsFound.push(message);
              });
              if(errorsFound.length > oldCount){
                $(el).attr("aria-invalid", "true");
              }else{
                var original = $this.data("original-aria-invalid");
                $(el).attr("aria-invalid", (original !== undefined ? original : false));
              }
            });

            $form.find("input,select,textarea").not($this).not("[name=\"" + $this.attr("name") + "\"]").trigger("validationLostFocus.validation");
            errorsFound = $.unique(errorsFound.sort());

            //Se quiere saber si hubo algún error
            if(errorsFound.length){
              //Se señalarán estos errores como advertencias
              $controlGroup.removeClass("success error").addClass("warning");

              //Se quiere saber cuántos errores se encontraron
              if(settings.options.semanticallyStrict && errorsFound.length === 1){
                //Mostrar el error, si solo se encontró uno y solo un error
                $helpBlock.html(errorsFound[0] + (settings.options.prependExistingHelpBlock ? $helpBlock.data("original-contents") : "" ));
              }else{
                //En caso de haber encontrado múltiples errores, se agregan en una lista de viñetas
                $helpBlock.html("<ul role=\"alert\"><li>" + errorsFound.join("</li><li>") + "</li></ul>" + (settings.options.prependExistingHelpBlock ? $helpBlock.data("original-contents") : "" ));
              }
            }else{
              $controlGroup.removeClass("warning error success");
              if(value.length > 0){
                $controlGroup.addClass("success");
              }
              $helpBlock.html($helpBlock.data("original-contents"));
            }

            if(e.type === "blur"){
              $controlGroup.removeClass("success");
            }
          });

          $this.bind("validationLostFocus.validation", function(){
            $controlGroup.removeClass("success");
          });
        });
      },

      destroy : function(){
        return this.each(function(){
          var $this = $(this), $controlGroup = $this.parents(".control-group").first(), $helpBlock = $controlGroup.find(".help-block").first();

          //Eliminación de eventos propios
          $this.unbind('.validation'); //Los eventos son dados por espacios de nombre
          //Reestablecimiento de texto de ayuda
          $helpBlock.html($helpBlock.data("original-contents"));
          //Reestablecimiento de clases
          $controlGroup.attr("class", $controlGroup.data("original-classes"));
          //Reestablecimiento de Aria
          $this.attr("aria-invalid", $this.data("original-aria-invalid"));
          //Reestablecimiento de roles
          $helpBlock.attr("role", $this.data("original-role"));
				  //Eliminación de elementos creados
				  if(createdElements.indexOf($helpBlock[0]) > -1){
					 $helpBlock.remove();
				  }
        });
      },

      collectErrors : function(includeEmpty){
        var errorMessages = {};
        this.each(function(i, el){
          var $el = $(el);
          var name = $el.attr("name");
          var errors = $el.triggerHandler("validation.validation", {includeEmpty: true});
          errorMessages[name] = $.extend(true, errors, errorMessages[name]);
        });

        $.each(errorMessages, function(i, el){
          if(el.length === 0){
            delete errorMessages[i];
          }
        });

        return errorMessages;
      },

      hasErrors: function(){
        var errorMessages = [];
        this.each(function(i, el){
          errorMessages = errorMessages.concat($(el).triggerHandler("getValidators.validation") ? $(el).triggerHandler("validation.validation", {submitting: true}) : []);
        });
        return (errorMessages.length > 0);
      },

      override : function(newDefaults){
        defaults = $.extend(true, defaults, newDefaults);
      }
    },

    validatorTypes: {
      callback: {
        name: "callback",
        init: function($this, name){
          return {
            validatorName: name,
            callback: $this.data("validation" + name + "Callback"),
            lastValue: $this.val(),
            lastValid: true,
            lastFinished: true
          };
        },

        validate: function($this, value, validator){
          if(validator.lastValue === value && validator.lastFinished){
            return !validator.lastValid;
          }

          if(validator.lastFinished === true){
            validator.lastValue = value;
            validator.lastValid = true;
            validator.lastFinished = false;
            var rrjqbvValidator = validator;
            var rrjqbvThis = $this;

            executeFunctionByName(validator.callback, window, $this, value, function(data){
              if(rrjqbvValidator.lastValue === data.value){
                rrjqbvValidator.lastValid = data.valid;
                if(data.message){
                  rrjqbvValidator.message = data.message;
                }
                rrjqbvValidator.lastFinished = true;
                rrjqbvThis.data("validation" + rrjqbvValidator.validatorName + "Message", rrjqbvValidator.message);
                //Se configura un tiempo de espera para evitar problemas con los eventos considerados que se disparen
                setTimeout(function(){
                  rrjqbvThis.trigger("change.validation");
                }, 1); //No se necesita un tiempo de espera prolongado, solo el tiempo suficiente para que explote la burbuja del evento
              }
            });
          }

          return false;
        }
      },

      ajax: {
        name: "ajax",
        init: function($this, name){
          return {
            validatorName: name,
            url: $this.data("validation" + name + "Ajax"),
            lastValue: $this.val(),
            lastValid: true,
            lastFinished: true
          };
        },

        validate: function($this, value, validator){
          if(""+validator.lastValue === ""+value && validator.lastFinished === true){
            return validator.lastValid === false;
          }

          if(validator.lastFinished === true){
            validator.lastValue = value;
            validator.lastValid = true;
            validator.lastFinished = false;

            $.ajax({
              url: validator.url,
              data: "value=" + value + "&field=" + $this.attr("name"),
              dataType: "json",
              success: function(data){
                if(""+validator.lastValue === ""+data.value){
                  validator.lastValid = !!(data.valid);
                  if(data.message){
                    validator.message = data.message;
                  }
                  validator.lastFinished = true;
                  $this.data("validation" + validator.validatorName + "Message", validator.message);
                  //Se configura un tiempo de espera para evitar problemas con los eventos considerados que se disparen
                  setTimeout(function(){
                    $this.trigger("change.validation");
                  }, 1); //No se necesita un tiempo de espera prolongado, solo el tiempo suficiente para que explote la burbuja del evento
                }
              },

              failure: function(){
                validator.lastValid = true;
                validator.message = "ajax call failed";
                validator.lastFinished = true;
                $this.data("validation" + validator.validatorName + "Message", validator.message);
                //Se configura un tiempo de espera para evitar problemas con los eventos considerados que se disparen
                setTimeout(function(){
                  $this.trigger("change.validation");
                }, 1); //No se necesita un tiempo de espera prolongado, solo el tiempo suficiente para que explote la burbuja del evento
              }
            });
          }

          return false;
        }
      },

      regex: {
				name: "regex",
				init: function($this, name){
					return {regex: regexFromString($this.data("validation" + name + "Regex"))};
				},

        validate: function ($this, value, validator) {
					return (!validator.regex.test(value) && ! validator.negative) || (validator.regex.test(value) && validator.negative);
				}
			},

			required: {
				name: "required",
				init: function($this, name){
					return {};
				},

				validate: function($this, value, validator){
					return !!(value.length === 0  && ! validator.negative) || !!(value.length > 0 && validator.negative);
				},
        blockSubmit: true
			},

			match: {
				name: "match",
				init: function($this, name){
					var element = $this.parents("form").first().find("[name=\"" + $this.data("validation" + name + "Match") + "\"]").first();
					element.bind("validation.validation", function(){
						$this.trigger("change.validation", {submitting: true});
					});
					return {"element": element};
				},

        validate: function ($this, value, validator) {
					return (value !== validator.element.val() && ! validator.negative) || (value === validator.element.val() && validator.negative);
				},
        blockSubmit: true
			},

      max: {
				name: "max",
				init: function($this, name){
					return {max: $this.data("validation" + name + "Max")};
				},

        validate: function($this, value, validator){
					return (parseFloat(value, 10) > parseFloat(validator.max, 10) && ! validator.negative) || (parseFloat(value, 10) <= parseFloat(validator.max, 10) && validator.negative);
				}
			},

			min: {
				name: "min",
				init: function($this, name){
					return {min: $this.data("validation" + name + "Min")};
				},

				validate: function($this, value, validator){
					return (parseFloat(value) < parseFloat(validator.min) && ! validator.negative) || (parseFloat(value) >= parseFloat(validator.min) && validator.negative);
				}
			},

      maxlength: {
				name: "maxlength",
				init: function($this, name){
					return {maxlength: $this.data("validation" + name + "Maxlength")};
				},

        validate: function($this, value, validator){
					return ((value.length > validator.maxlength) && ! validator.negative) || ((value.length <= validator.maxlength) && validator.negative);
				}
			},

      minlength: {
				name: "minlength",
				init: function($this, name){
					return {minlength: $this.data("validation" + name + "Minlength")};
				},

				validate: function($this, value, validator){
					return ((value.length < validator.minlength) && ! validator.negative) || ((value.length >= validator.minlength) && validator.negative);
				}
			},

			maxchecked: {
				name: "maxchecked",
				init: function($this, name){
					var elements = $this.parents("form").first().find("[name=\"" + $this.attr("name") + "\"]");
					elements.bind("click.validation", function(){
						$this.trigger("change.validation", {includeEmpty: true});
					});
					return {maxchecked: $this.data("validation" + name + "Maxchecked"), elements: elements};
				},

        validate: function($this, value, validator){
					return (validator.elements.filter(":checked").length > validator.maxchecked && ! validator.negative) || (validator.elements.filter(":checked").length <= validator.maxchecked && validator.negative);
				},
        blockSubmit: true
			},

			minchecked: {
				name: "minchecked",
				init: function($this, name){
					var elements = $this.parents("form").first().find("[name=\"" + $this.attr("name") + "\"]");
					elements.bind("click.validation", function(){
						$this.trigger("change.validation", {includeEmpty: true});
					});
					return {minchecked: $this.data("validation" + name + "Minchecked"), elements: elements};
				},

				validate: function($this, value, validator){
					return (validator.elements.filter(":checked").length < validator.minchecked && ! validator.negative) || (validator.elements.filter(":checked").length >= validator.minchecked && validator.negative);
				},
        blockSubmit: true
			}
		},

		builtInValidators: {
			email: {
				name: "Email",
				type: "shortcut",
				shortcut: "validemail"
			},

			validemail: {
				name: "Validemail",
				type: "regex",
				regex: "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\\.[A-Za-z]{2,4}",
				message: "Not a valid email address<!-- data-validation-validemail-message to override -->"
			},

			passwordagain: {
				name: "Passwordagain",
				type: "match",
				match: "password",
				message: "Does not match the given password<!-- data-validator-paswordagain-message to override -->"
			},

			positive: {
				name: "Positive",
				type: "shortcut",
				shortcut: "number,positivenumber"
			},

			negative: {
				name: "Negative",
				type: "shortcut",
				shortcut: "number,negativenumber"
			},

			number: {
				name: "Number",
				type: "regex",
				regex: "([+-]?\\\d+(\\\.\\\d*)?([eE][+-]?[0-9]+)?)?",
				message: "Must be a number<!-- data-validator-number-message to override -->"
			},

			integer: {
				name: "Integer",
				type: "regex",
				regex: "[+-]?\\\d+",
				message: "No decimal places allowed<!-- data-validator-integer-message to override -->"
			},

			positivenumber: {
				name: "Positivenumber",
				type: "min",
				min: 0,
				message: "Must be a positive number<!-- data-validator-positivenumber-message to override -->"
			},

			negativenumber: {
				name: "Negativenumber",
				type: "max",
				max: 0,
				message: "Must be a negative number<!-- data-validator-negativenumber-message to override -->"
			},

			required: {
				name: "Required",
				type: "required",
				message: "This is required<!-- data-validator-required-message to override -->"
			},

			checkone: {
				name: "Checkone",
				type: "minchecked",
				minchecked: 1,
				message: "Check at least one option<!-- data-validation-checkone-message to override -->"
			}
		}
	};

	var formatValidatorName = function(name){
		return name.toLowerCase().replace(/(^|\s)([a-z])/g, function(m, p1, p2){
			return p1 + p2.toUpperCase();
		});
	};

	var getValue = function($this){
		//Se extrae el valor
		var value = $this.val();
		var type = $this.attr("type");
		if(type === "checkbox"){
			value = ($this.is(":checked") ? value : "");
		}
		if(type === "radio"){
			value = ($('input[name="' + $this.attr("name") + '"]:checked').length > 0 ? value : "");
		}
		return value;
	};

  function regexFromString(inputstring){
		return new RegExp("^" + inputstring + "$");
	}

  /**
   * Gracias a Jason Bunting vía StackOverflow
   *
   * Enlace: http://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string#answer-359910
   * Enlace corto: http://tinyurl.com/executeFunctionByName
  **/
  function executeFunctionByName(functionName, context /*, args*/){
    var args = Array.prototype.slice.call(arguments).splice(2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++){
      context = context[namespaces[i]];
    }
    return context[func].apply(this, args);
  }

	$.fn.jqBootstrapValidation = function(method){
		if(defaults.methods[method]){
			return defaults.methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}else if(typeof method === 'object' || ! method){
			return defaults.methods.init.apply( this, arguments );
		}else{
		  $.error('Method ' +  method + ' does not exist on jQuery.jqBootstrapValidation');
			return null;
		}
	};

  $.jqBootstrapValidation = function(options){
    $(":input").not("[type=image],[type=submit]").jqBootstrapValidation.apply(this,arguments);
  };

})( jQuery );
