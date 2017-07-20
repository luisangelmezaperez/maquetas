var ntAltaInmediataUtils = (function() {

    //dominio que se usara para las llamadas ajax

    var domain = "http://93.16.237.8/";
    //var domain = "http://localhost:9082/";

    //inicializa los radiobuttons para que al seleccionar se marque que se seleccionó
    function initRadioButton() {
        $("label.ui-marmots-label-radio").on('click', function(){
            var labelSeleccionado = $(this);
            $("label.ui-marmots-label-radio").removeClass("on");
            labelSeleccionado.addClass("on");
        });
    }

    //ingreso solo caracteres de rut (numeros y "k")
    function onlyRutFormat(elements) {
        elements.forEach(function(field){
            $(field).keypress(function(event) {
                if (!isMinControlChar(event.which) && !isRutChar(event.which)) {
                    event.preventDefault();
                }
            });

            $(field).keyup(function(event) {
                var rut = $(this).val();
                var format = formatRut(rut);
                $(this).val(format);
            });
        });
        
    }

    // solo ingreso de letras
    function onlyTextFormat(elements) {
        elements.forEach(function(field) {
            $(field).on(
                "keydown",
                function(event) { // valida solo letras
                    var arr = [ 8, 9, 16, 17, 20, 35, 36, 37, 32, 38, 39,
                            40, 45, 46 ];
                    for ( var i = 65; i <= 90; i++) {
                        arr.push(i);
                    }
                    if (jQuery.inArray(event.which, arr) === -1) {
                        event.preventDefault();
                    }
                }
            );
        });
        
    }

    //funcion que permite solo ingresar numeros
    function onlyNumbersFormat(elements) {
        elements.forEach(function(field) {
            $(field).keypress(function(event) {
                if (!isMinControlChar(event.which) && !isNumberChar(event.which)) {
                    event.preventDefault();
                }
            });
        });
    }

    // solo ingreso mail
    function onlyEmailFormat(elements) {
        elements.forEach(function(field) {
            $(field).keypress(function(event) {
                //valida el mail
                console.log('hola');
                var expreg = new RegExp("^[a-zA-Z0-9@._\\-]$");
                if (expreg.test(event.key)) {

                } else {
                    return false;
                }
                // valida solo letras
            });
        });
    }
    

    //valida que el campo sea llenado
    function validateTextField(field) {
        if (trimFieldValue(field) === "") {
            return false;
        }
        return true;
    }

    //validacion de rut
    function validateRutField(field) {
        var val = trimFieldValue(field);
        if (val === "" || !isValidRut(val)) {
            return false;
        }
        return true;
    }

    //validacion de email

    function validateEmailField(field) {
        var val = trimFieldValue(field);
        if (val === "" || !isValidEmail(val)) {
            return false;
        }
        return true;
    }

    //validacion de que se conteste algun radiobutton
    function validateRadioButtonsField(field) {
        if ($(field+':checked').length === 0) {
            return false
        }
        return true;
    }

    //funcion para deshabilitar el boton en caso que el formulario contestado sea valido
    function unBlockButton(field, isValidForm) {
        if(isValidForm) {
            $(field).removeClass('nt_button_disable');
            $(field).removeAttr('disabled');
        } else {
            $(field).addClass('nt_button_disable');
            $(field).attr('disabled', 'disabled');
        }
    }

    return {
        domain : domain,
        initRadioButton : initRadioButton,
        onlyRutFormat : onlyRutFormat,
        onlyTextFormat : onlyTextFormat,
        onlyNumbersFormat : onlyNumbersFormat,
        onlyEmailFormat : onlyEmailFormat,
        validateTextField : validateTextField,
        validateRutField : validateRutField,
        validateRadioButtonsField : validateRadioButtonsField,
        validateEmailField : validateEmailField,
        unBlockButton : unBlockButton
    }

})();