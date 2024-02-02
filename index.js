const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
require('dotenv').config();

const app = express();

//Base de datos
dbConnection();

//CORS

app.use( cors() );

//Directorio publico
app.use( express.static('public') );


//lectura y parseo del body
//para tener acceso a la req.body y que lo parsee automaticamente
app.use( express.json() );

app.use('/api/auth', require('./routes/auth'));

app.listen( process.env.PORT, ()=> {
    console.log(`Servidor corriendo en el puerto ${ process.env.PORT }`); 
});