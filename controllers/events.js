const { request, response } = require("express");
const Evento = require('../models/Event')

const getEventos = async( req = request, res = response) => {

    const eventos = await Evento.find()
                                .populate('user','name'); //solo se trae el name, si no se especifica se trae todos los datos del usuario

    return res.json({
         ok: true,
         eventos,
    });   
}

const crearEvento = async( req = request, res = response) => {

    const evento = new Evento( req.body );

    try {

        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        return res.json({
            ok: true,
            evento: eventoGuardado,
        }); 

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });   
    };

}

const actualizarEvento = async( req = request, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;
    console.log(uid);
    
    try {

        const evento = await Evento.findById( eventoId );

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento con ese id no existe', 
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento', 
            });
        };

        const nuevoEvento = {
            ...req.body,
            user: uid,
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, {new: true})

        return res.json({
            ok: true,
            evento: eventoActualizado,            
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hablar con el admin',        
        });
    }
}

const eliminarEvento = async( req = request, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;
    console.log(uid);  

    try {
        const evento = await Evento.findById( eventoId );

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento con ese id no existe', 
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento', 
            });
        };

        const nuevoEvento = {
            ...req.body,
            user: uid,
        }

        const eventoEliminado = await Evento.findByIdAndDelete( eventoId, nuevoEvento, {new: true})

        return res.json({
            ok: true,         
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hablar con el admin',        
        });
    }
}

module.exports = {
    actualizarEvento,
    crearEvento,
    eliminarEvento,
    getEventos,
}