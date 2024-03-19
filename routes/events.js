//Obtener eventos

const { Router }        = require('express');
const { check }         = require('express-validator');
const { validarJWT }    = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validarCampos');
const { isDate }        = require('../helpers/isDate');

const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');


const router = Router();

router.use( validarJWT );

//se evalua el validarJWT en todas las rutras

router.get('/', getEventos );

router.post('/', 
    [
        check('title', 'El titulo es obligatorio').notEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha final es obligatoria').custom( isDate ),
        validarCampos
    ], 
    crearEvento );

router.put('/:id',     [
        check('title', 'El titulo es obligatorio').notEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha final es obligatoria').custom( isDate ),
        validarCampos
    ], 
    actualizarEvento );

router.delete('/:id', eliminarEvento, );

module.exports = router;