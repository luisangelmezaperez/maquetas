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

    function validateFields() {

        if(!ntAltaInmediataUtils.validateTextField('.js-form-name-s1'))
            return false;
        if(!ntAltaInmediataUtils.validateRutField('.js-form-rut-s1'))
            return false;
        if(!ntAltaInmediataUtils.validateTextField('.js-form-day-s1'))
            return false;
        if(!ntAltaInmediataUtils.validateTextField('.js-form-month-s1'))
            return false;
        if(!ntAltaInmediataUtils.validateTextField('.js-form-year-s1'))
            return false;
        if(!ntAltaInmediataUtils.validateRadioButtonsField('.js-form-dependent-s1'))
            return false;
        
        return true;
    }



    function initOnChangeValidation() {
        var isValidForm = false;
        $('.js-form-radio-s1').change(function() {
            isValidForm = validateFields();
            ntAltaInmediataUtils.unBlockButton('#next_zero', isValidForm);
        });
        $('.js-form-text-s1').keyDown(function() {
            isValidForm = validateFields();
            ntAltaInmediataUtils.unBlockButton('#next_zero', isValidForm);
        });
    }

    return {
        initOnChangeValidation : initOnChangeValidation
    }
})();


$(document).ready(function() {
    //inicializa los radiobutton para que al hacer click se muestre seleccionado
    ntAltaInmediataUtils.initRadioButton();

    //valida que al ingresar un rut no se ingresen letras distintas a K y solo numeros
    ntAltaInmediataUtils.rutFormat(['.js-form-rut-s1']);

    //valida que se ingrese solo texto
    ntAltaInmediataUtils.onlyTextFormat(['.js-form-name-s1']);

    //valida que se ingresen solo numeros
    ntAltaInmediataUtils.onlyNumbersFormat(['.js-form-day-s1', '.js-form-month-s1', '.js-form-year-s1']);

    //validacion de formulario
    ntAltaInmediataFormIngresoController.initOnChangeValidation();
    
});