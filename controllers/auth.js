const { request, response } = require('express');
const bcrypt = require('bcryptjs');


const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req = request, res = response ) => {

    try {

        const { email, password } = req.body;

        let usuario = await Usuario.findOne({email});

        console.log(usuario);
        

        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: `Correo en uso`,
            });
        };
        
        usuario = new Usuario( req.body );

        //encriptar contrase;a
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );
    
        await usuario.save();

        //generar jwt
        const token = await generarJWT( usuario.id, usuario.name);
    
        res.status(201).json({
            ok: true, 
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            ok: true, 
            msg: 'Hable con el administrador',
        });
    }

    

};

const loginUsuario = async(req = request, res = response) => {

    try {

        const { email, password } = req.body;
        
        let usuario = await Usuario.findOne({email});
    
        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: `[EMAIL] credenciales invalidas`,
            })
        }
    
        //confirmar contrase;a
    
        const validPassword = bcrypt.compareSync(password, usuario.password)
    
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: `[PASSWORD] credenciales invalidas`,
            }) 
        }

        const token = await generarJWT( usuario.id, usuario.name );
        
        res.json({
            ok: true, 
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            ok: true, 
            msg: 'Hable con el administrador',
        });
    };
}

const revalidarToken = async(req = request, res = response) => {

    const { name, uid } = req;

    const token = await generarJWT( uid, name );

    res.json({
        ok: true, 
        msg: 'RENEW',
        token,
    });
    
};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}
