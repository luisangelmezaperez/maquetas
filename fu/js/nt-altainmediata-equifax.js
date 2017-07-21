/**
* @fileoverview Espacio de trabajo de Nectia para 'Alta inmediata'
* @author Jurgen Wohllk <jwohllk@nectia.com>
* @version 0.1.0 
*/

var ntAltaInmediataEquifaxRequests = (function() {

    //SERVICIO QUE RETORNA LAS PREGUNTAS DE EQUIFAX QUE SE HARAN AL USUARIO
    function getEquifaxQuestions(dataService) {

        var urlService = ntAltaInmediataUtils.domain+"FUBBVARutAPI/getQuestions";

        var data = {};      

        $.ajax({
            url: urlService,
            type: "POST",
            data: JSON.stringify(dataService),
            dataType: "json",
            contentType : "application/json; charset=utf-8",
            async: false,
            success: function(json) {
                if(json.code == "00") {
                    ntAltaInmediataEquifaxController.loadQuestions(json);
                    data = json;
                }
            },
            error:function (xhr, ajaxOptions, thrownError) {
                console.log('Hubo un error al recuperar las preguntas');
            }
        });

        return data;
    } 

    //SERVICIO ANALISA LAS RESPUESTAS QUE CONTESTO EL USUARIO PARA EQUIFAX
    function validateEquifaxAnswers(dataService, rut) {

        var urlService = ntAltaInmediataUtils.domain+"FUBBVARutAPI/validateAnswers/"+ rut +"?authorizedPrevired=true";

        var data = {};

        $.ajax({
            url: urlService,
            type: "POST",
            data: JSON.stringify(dataService),
            dataType: "json",
            contentType : "application/json; charset=utf-8",
            async: false,
            success: function(json) {
                if(json.code == "00") {
                    data = json;
                }
            },
            error:function (xhr, ajaxOptions, thrownError) {
                console.log('Hubo un error al validar las respuestas');
            }
        });

        return data;
    }

    return {
        getEquifaxQuestions : getEquifaxQuestions,
        validateEquifaxAnswers : validateEquifaxAnswers
    };

})();

//ESPACIO DE TRABAJO PARA LA PARTE DE PREGUNTAS Y VALIDACION DE EQUIFAX

var ntAltaInmediataEquifaxController = (function() {

    /* FUNCIONES EQUIFAX */

    //metodo que carga las preguntas en el DOM
    function loadQuestions(dataQuestions) {
        //contenedor de todas las preguntas que hay en el formulario de equifax
        var $container = $('.equifaxQuestions');
        //recorremos el array con los objeto pregunta alternativas
        var questionsArray = [];

        // var agree = "Por este acto, autorizo a mi AFP, a entregar por intermedio de PREVIRED, mis 12 últimos periodos de cotizaciones previsionales a la Institución, con el fin de ser consideradas como antecedente a esta solicitud comercial, dando así cumplimiento al articulo 4° de la ley N° 19.628 sobre Protección de la Vida Privada y a lo dispuesto en la ley N°19799 sobre Documentos Electrónicos Firma Electrónica y Servicio de Certificación de Dicha Firma";
        
        $('.agreement').text(dataQuestions.object.agreement);
        // $('.agreement').text(agree);

        $.each(dataQuestions.object.questionAnswers, function(index,question){

            //creamos el contenedor de preguntas
            var $question_container = $("<div></div>", {'id':'question_container'+(question.number), 'class' : "small-12 medium-12 large-6 column margin_input_form questionContainer"});
            //creamos el parrafo que contendra la pregunta
            var $question = $("<label></label>", {'id':"questionTitle"+(question.number), "class":"questionTitle"});
            //select input
            var $select = $("<select></select>", {'id':"question"+(question.number), "class":"questionSelect", "name" : "question"+(question.number)});
            $select.append('<option value="">Selecciona</option>');
            //
            var $alternatives = $('<div></div>', {'id' : "alternatives"+(question.number), 'class' : 'alternatives'});

            //seteamos el texto que contendra el parrafo
            $question.text(question.description);
            //agregamos la pregunta al contenedor de pregunta
            $question_container.append($question);
            //declaramos el contador para saber cual dato debemos mostrar en pantalla
            var counter = 0;

            $.each(question.alternatives, function(indexAlternatives,itemAlternative){
                //insertamos en el contenedor de alternativa el radiobutton con la informacion necesaria
                $select.append('<option value="'+itemAlternative.number+'">'+itemAlternative.description+'</option>');
            });
            $alternatives.append($select);
            $question_container.append($alternatives);

            questionsArray.push($question_container);

        });
        //esta parte es para que 2 preguntas vayan dentro de 1 row
        $.each(questionsArray, function(index, item) {
            if((index + 1) % 2  == 0 && index != 0 && questionsArray.length > 1) {
                $question_container_row = $("<div></div>", {'class' : "row questionsRow"});
                $question_container_row.append(questionsArray[index-1]);
                $question_container_row.append(questionsArray[index]);
                //Insertamos en el contenedor el contenedor de pregunta
                $container.append($question_container_row);
            }
        });

        //para cuando las preguntas son impares 
        if((questionsArray.length % 2 == 1) || questionsArray.length == 1 ) {
            // creamos la fila y le agregamos la ultima pregunta
            var $question_container_row = $("<div></div>", {'class' : "row questionsRow"}); 
            $question_container_row.append(questionsArray[questionsArray.length-1]);
            $container.append($question_container_row);
            //generatePhoneInput();       
        } //else {
            //generatePhoneInput();
        //}

        // function generatePhoneInput() {
        //     // creamos el contenedor de preguntas
        //     var $question_container = $("<div></div>", {'id':'question_container'+(questionsArray.length+1), 'class' : "small-12 medium-12 large-6 column margin_input_form questionContainer"});
            
        //     //definimos el titulo de la pregunta
        //     $question = $("<label></label>", {'id':"questionTitle"+(questionsArray.length + 1), "class":"questionTitle"});
        //     $question.text("Ingresa tu teléfono móvil*");
        //     //select input
        //     $question_container.append($question);

        //     //definimos el input que se utilizara
        //     var $input = $("<input></input>", {'id':"phoneField", "class":"questionInput", "name" : "phoneField", 'type' : 'text', 'maxlength' : '9', 'placeholder' : 'Ej: 912345678'});

        //     //agregamos al contenedor
        //     $question_container.append($input);

        //     $question_container_row.append($question_container);

        //     $container.append($question_container_row);
        // }

        resizeQuestions();
    }

    // funcion que se hace en reemplazo de flex-box debido al poco soporte que tiene para navegadores antiguos, lo que hace es poner el mismo height para las preguntas por cada fila que se genera (2 preguntas) asi los select quedan alineados si la 1 pregunta es corta y la 2 es larga
    function resizeQuestions() {
        var counter = 1;
        $('.questionsRow').each(function () {
            var maxHeight = 0;
            $(this).find('.questionTitle').each(function () {
                var title = $(this).text();
                var $questionContainer = $(this).parent();
                var $title = $("<label></label>", {'id':"questionTitle"+(counter), "class":"questionTitle"});
                $($title).text(title);
                $(this).remove();
                $($questionContainer).prepend($title);
                maxHeight = Math.max($($title).height(), maxHeight);
                counter++;
            });
            if (window.matchMedia('screen and (min-width: 769px)').matches) {
                $(this).find('.questionTitle').height(maxHeight);
            }
        });
    }

    /* VALIDACION DE FORMULARIO EQUIFAX */
    function validateFieldMenu(field) {
        if ($(field).text() === "Selecciona") {
            return false;
        }
        return true;
    }

    //funcion que agrega el error al campo
    // function showFieldErrorMenu(field) {
    //     $(field).addClass("ui-selectmenu-error");
    // }

    //funcion que remueve el error del campo
    // function clearFieldErrorMenu(field) {
    //     $(field).removeAttr("title");
    //     $(field).removeClass("ui-selectmenu-error");
    // }

    //valida que se ingrese un numero de telefono
    // function validatePhoneField(field) {
    //     var val = trimFieldValue(field);
    //     //isValidPhone viene de utils_fu.js
    //     if (val === "" || !isValidPhone(val)) {
    //         showFieldError(field);
    //         $(field).attr("title","Ingresa tu teléfono móvil");
    //         return false;
    //     }
    //     clearFieldError(field);
    //     return true;
    // }

    //muestra el estilo error
    // function showFieldError(field) {
    //     $(field).addClass("error-input");
    // }

    // //quita el estilo de error al input
    // function clearFieldError(field) {
    //     $(field).removeAttr("title");
    //     $(field).removeClass("error-input");
    // }

    //funcion que no permite ingresar letras al campo
    // function onlyNumbers(field) {
    //     $(field).keypress(function(event) {
    //         if (!isMinControlChar(event.which) && !isNumberChar(event.which)) {
    //             event.preventDefault();
    //         }
    //     });
    // }

    //verifica que el terminos y condiciones se checkee
    function validateTermConditions(field) {
        if(!$(field).is(':checked')) {
            // $('.acceptTermConditions').show();
            return false;
        }
        // $('.acceptTermConditions').hide();
        return true;
    }

    function validateFields() {
        var formError = false;
        formError = !validateTermConditions('#termConditions');
        if($('.questionSelect').length > 0) {
            $.each($('.questionSelect'), function(index,item){
                if(!validateFieldMenu("#question"+(index+1)+"-button")) {
                    formError = true;
                }
            });
        } else {
            formError = true;
        }
        
        if(!formError) {
            $('#continueEquifax').removeClass('nt_button_disable');
            $('#continueEquifax').removeAttr('disabled');
        } else {
            $('#continueEquifax').addClass('nt_button_disable');
            $('#continueEquifax').attr('disabled', 'disabled');
        }
    }

    /* FIN VALIDACION DE FORMULARIO EQUIFAX */

    function questionSelectInit() {
        $.each($('.questionSelect'), function(index,item){
            $("#question"+(index+1)).selectmenu({
                change : function(event, ui) {
                    // ntAltaInmediataEquifaxController.validateFieldMenu("#question"+(index+1)+"-button");
                    validateFields();
                },
                focus : function(event, ui) {
                    clearFieldErrorMenu("#question"+(index+1)+"-button");
                }
            });
        }); 
    }

    function continueEquifax(questionsData, rut) {
        $('#continueEquifax').click(function() {
            //logica para saber si el formulario viene con errores
            var formError = false;
            $.each($('.questionSelect'), function(index,item){
                if(!validateFieldMenu("#question"+(index+1)+"-button")) {
                    formError = true;
                }
            });
            // if($('#phoneField').length > 0) {
            //     if(!validatePhoneField("#phoneField")) {
            //         formError = true
            //     }
            // } else {
            //     formError = true;
            // }
            
            if(!validateTermConditions('#termConditions')) {
                formError = true
            }

            //si viene todo correcto
            if(!formError) {
                //armamos el array con las respuestas que contesto la persona
                var answers = [];
                $.each($('.questionSelect'), function(index,item){
                    answers.push(
                        {
                            "number": ""+(index+1),
                            "alternatives": [
                                {
                                    "number": parseInt($("#question"+(index+1)).val())
                                }
                            ]
                        }
                    );
                });         

                if(answers.length > 0) {
                    //generamos la variable que se enviara por POST al servicio de equifax validateAnswers
                    var dataPostAnswerValidation = {
                        "equifaxCustomerAuthentication": {
                            "transactionKey": questionsData.object.equifaxCustomerAuthentication.transactionKey
                        },
                        "questionAnswers": answers
                    };

                    var validateAnswersData = ntAltaInmediataEquifaxRequests.validateEquifaxAnswers(dataPostAnswerValidation, rut);
                    
                    if(validateAnswersData.code == "00" && validateAnswersData.object.isValid) {
                        console.log(validateAnswersData.object.transactionKey, 'Respuestas Correctas');
                    } else {
                        console.log('Respuestas invalidas');
                    }
                } else {
                    console.log('No no existen las alternativas ni la pregunta');
                }
                
            } else {
                console.log('Respuestas no contestadas')
            }
        });
    }

    /* FIN FUNCIONES EQUIFAX */

    return {
        loadQuestions : loadQuestions,
        resizeQuestions : resizeQuestions,
        showFieldErrorMenu : showFieldErrorMenu,
        clearFieldErrorMenu : clearFieldErrorMenu,
        validateFieldMenu : validateFieldMenu,
        //onlyNumbers : onlyNumbers,
        validateTermConditions : validateTermConditions,
        //validatePhoneField : validatePhoneField,
        questionSelectInit : questionSelectInit,
        continueEquifax : continueEquifax,
        validateFields : validateFields
    }

})();


$(document).ready(function() {

    var dataService = {
        rut: "251103429",
        numeroSerie: "200834613"
    };

    var personName = "Jurgen";

    $('.js-person-name').text(personName);

    $('#termConditions').change(function(){
        ntAltaInmediataEquifaxController.validateFields()
    })

    // llamamos al servicio que obtiene las preguntas (y llama al servicio que renderiza el html) retorna la respuesta del servicio
    // para el posterior uso del token
    var questionsData = ntAltaInmediataEquifaxRequests.getEquifaxQuestions(dataService);

    // init a los select de este formulario preguntas equifax (para que se vean con el estilo de jquery UI select)
    ntAltaInmediataEquifaxController.questionSelectInit();

    //validacion de formulario y consulta al servicio de validacion de respeustas
    ntAltaInmediataEquifaxController.continueEquifax(questionsData, dataService.rut);

    $(window).resize(function() {
      //acomoda el tamaño de las respuestas responsivamente
      ntAltaInmediataEquifaxController.resizeQuestions();
    });

    //para que el input de telefonos acepte solo numeros
    //ntAltaInmediataEquifaxController.onlyNumbers('#phoneField');
    
});


// var prueba = {
//     "code":"-1",
//     "description":"{\"content\":\"Lamentablemente no podemos atender tu solicitud.\",\"title\":\"\"}"
// }

// function pruebaObject() {
//     console.log(JSON.parse(prueba.description).title);
//     //console.log(JSON.parseprueba.description);
// }

// var dataQuestions = {
//    "code":"00",
//    "description":"0",
//    "object":{

//       "questionAnswers":[  
//          {  
//             "number":"1",
//             "description":"Cual es el apellido materno de su conyuge?",
//             "alternatives":[  
//                {  
//                   "number":1,
//                   "description":"IBARRA"
//                },
//                {  
//                   "number":2,
//                   "description":"GONZALEZ"
//                },
//                {  
//                   "number":3,
//                   "description":"PEREZ"
//                },
//                {  
//                   "number":4,
//                   "description":"TAPIA"
//                },
//                {  
//                   "number":5,
//                   "description":"PEREZ"
//                }
//             ]
//          },
//          {  
//             "number":"2",
//             "description":"Como se llama tu madre?",
//             "alternatives":[  
//                {  
//                   "number":1,
//                   "description":"MARIA"
//                },
//                {  
//                   "number":2,
//                   "description":"EUGENIA"
//                },
//                {  
//                   "number":3,
//                   "description":"LILIAN"
//                },
//                {  
//                   "number":4,
//                   "description":"ANDREA"
//                },
//                {  
//                   "number":5,
//                   "description":"ALEJANDRA"
//                }
//             ]
//          },
//          {  
//             "number":"3",
//             "description":"Ciudad de Nacimiento?",
//             "alternatives":[  
//                {  
//                   "number":1,
//                   "description":"IQUIQUE"
//                },
//                {  
//                   "number":2,
//                   "description":"COPIAPO"
//                },
//                {  
//                   "number":3,
//                   "description":"CONCEPCION"
//                },
//                {  
//                   "number":4,
//                   "description":"PUNTA ARENAS"
//                },
//                {  
//                   "number":5,
//                   "description":"SANTIAGO"
//                }
//             ]
//          },
//          {  
//             "number":"4",
//             "description":"Ciudad de Nacimiento?",
//             "alternatives":[  
//                {  
//                   "number":1,
//                   "description":"IQUIQUE"
//                },
//                {  
//                   "number":2,
//                   "description":"COPIAPO"
//                },
//                {  
//                   "number":3,
//                   "description":"CONCEPCION"
//                },
//                {  
//                   "number":4,
//                   "description":"PUNTA ARENAS"
//                },
//                {  
//                   "number":5,
//                   "description":"SANTIAGO"
//                }
//             ]
//          }
//       ],
//       "equifaxCustomerAuthentication":{  
//          "transactionKey":"123456789"
//       }
//    }
// };