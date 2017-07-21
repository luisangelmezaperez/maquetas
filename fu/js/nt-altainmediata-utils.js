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
                            40, 45, 46];

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
    function validateTextField(field, message) {
        if (trimFieldValue(field) === "") {
            showFieldError(field, message);
            return false;
        }
        clearFieldError(field);
        return true;
    }

    //validacion de rut
    function validateRutField(field, message) {
        var val = trimFieldValue(field);
        if (val === "" || !isValidRut(val)) {
            showFieldError(field, message);
            return false;
        }
        clearFieldError(field);
        return true;
    }

    //validacion de email

    function validateEmailField(field, message) {
        var val = trimFieldValue(field);
        if (val === "" || !isValidEmail(val)) {
            return false;
        }
        return true;
    }

    //funcion que muestra mensajes de error
    function showFieldError(field, message) {
        if(message != undefined) {
            $(field).attr('title', message).addClass('error-input');
        }
    }

    //funcion que quita mensajes de error
    function clearFieldError(field) {
        $(field).removeAttr('title').removeClass('error-input');
    }

    //validacion de que se conteste algun radiobutton
    function validateRadioButtonsField(field) {
        if ($(field+':checked').length === 0) {
            return false;
        }
        return true;
    }

    //valida si el dia es valido
    function isValidDay(day){
        return Number(day)>=1 && Number(day)<=31;
    }

    //valida si el mes es valido
    function isValidMonth(month){
        return Number(month)>=1 && Number(month)<=12;
    }

    //valida si el año es valido
    function isValidYear(year){
        return Number(year)>=1900 && Number(year)<=(new Date()).getFullYear();
    }

    function validateBirthDateField(dayField, monthField, yearField){
        var dd  = $(dayField).val();
        var mm  = $(monthField).val();
        var yy  = $(yearField).val();

        if((ntAltaInmediataUtils.isValidDay(dd) && dd.length == 2) && (ntAltaInmediataUtils.isValidMonth(mm) && mm.length == 2) && (ntAltaInmediataUtils.isValidYear(yy) && yy.length == 4)){

            var hoy = new Date();
            var nac = new Date(yy,mm,dd);
            var difFechas = (hoy-nac)/1000;
            var edad = difFechas/31536000;

            if(edad<18){
                showFieldError(dayField+', '+monthField+', '+yearField, 'Debe ser mayor de edad');
                return false;
            }else{
                console.log('aqui logre pasar las validaciones')
                clearFieldError(dayField+', '+monthField+', '+yearField);
                return true;
            }

        }else{
            if(!ntAltaInmediataUtils.isValidDay(dd))
                showFieldError(dayField, 'Ingrese un día válido');
            else
                clearFieldError(dayField);
            if(!ntAltaInmediataUtils.isValidMonth(mm))
                showFieldError(monthField, 'Ingrese un mes válido');
            else
                clearFieldError(monthField);
            if(!ntAltaInmediataUtils.isValidYear(yy))
                showFieldError(yearField, 'Ingrese un año válido');
            else
                clearFieldError(yearField);
            return false;
        }

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
        validateBirthDateField : validateBirthDateField,
        isValidDay : isValidDay,
        isValidMonth : isValidMonth,
        isValidYear : isValidYear,
        unBlockButton : unBlockButton
    }

})();