/**
* @fileoverview Espacio de trabajo de Nectia para 'Alta inmediata'
* @author Jurgen Wohllk <jwohllk@nectia.com>
* @version 0.1.0 
*/

// ESPACIO DE TRABAJO PARA LOS REQUEST DE ESTE FORMULARIO
var ntAltaInmediataFormIngresoRequests = (function() {


})();

//ESPACIO DE TRABAJO PEL FORMULARIO DE INGRESO ALTA INMEDIATA

var ntAltaInmediataFormIngresoController = (function() {

    function validateFieldErrorMessages() {
        $('.js-form-name-s1').blur(function() {
            ntAltaInmediataUtils.validateTextField('.js-form-name-s1', 'Debe ingresar un nombre');
        });

        $('.js-form-rut-s1').blur(function() {
            ntAltaInmediataUtils.validateRutField('.js-form-rut-s1', 'Debe ingresar un rut válido');
        });

        $('.js-form-day-s1, .js-form-month-s1, .js-form-year-s1').blur(function() {

            ntAltaInmediataUtils.validateBirthDateField('.js-form-day-s1', '.js-form-month-s1', '.js-form-year-s1');
        });
    }


    //funcion que desencadena la validacion para deshabilitar el boton
    function validationForNextStep() {
        if(!ntAltaInmediataUtils.validateTextField('.js-form-name-s1'))
            return false;
        if(!ntAltaInmediataUtils.validateRutField('.js-form-rut-s1'))
            return false;
        if(!ntAltaInmediataUtils.validateTextField('.js-form-day-s1'))
            return false;
        if(!ntAltaInmediataUtils.validateBirthDateField('.js-form-day-s1', '.js-form-month-s1', '.js-form-year-s1'))
            return false;
        if(!ntAltaInmediataUtils.validateRadioButtonsField('.js-form-dependent-s1'))
            return false;

        return true;
    }

    function validations() {
        var validForm = validationForNextStep();
        ntAltaInmediataUtils.unBlockButton('#next_zero', validForm);
    }

    return {
        validateFieldErrorMessages : validateFieldErrorMessages,
        validations : validations
    }
})();


$(document).ready(function() {
    //inicializa los radiobutton para que al hacer click se muestre seleccionado
    ntAltaInmediataUtils.initRadioButton();

    //valida que al ingresar un rut no se ingresen letras distintas a K y solo numeros
    ntAltaInmediataUtils.onlyRutFormat(['.js-form-rut-s1']);

    //valida que se ingrese solo texto
    ntAltaInmediataUtils.onlyTextFormat(['.js-form-name-s1']);

    //valida que se ingresen solo numeros
    ntAltaInmediataUtils.onlyNumbersFormat(['.js-form-day-s1', '.js-form-month-s1', '.js-form-year-s1']);

    //validacion de formulario
    ntAltaInmediataFormIngresoController.validateFieldErrorMessages();

    $('.js-form-text-s1').keyup(function(){
        ntAltaInmediataFormIngresoController.validations();
    });
    $('.js-form-dependent-s1').change(function(){
        ntAltaInmediataFormIngresoController.validations();
    });

    
    
});