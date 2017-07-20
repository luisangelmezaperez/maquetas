var ntAltaInmediataUtils = (function() {

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
    function rutFormat(elements) {
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
        rutFormat : rutFormat,
        onlyTextFormat : onlyTextFormat,
        onlyNumbersFormat : onlyNumbersFormat,
        validateTextField : validateTextField,
        validateRutField : validateRutField,
        validateRadioButtonsField : validateRadioButtonsField,
        unBlockButton : unBlockButton
    }

})();