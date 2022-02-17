
//importaciones
const express =require('express');
const cors = require('cors');
var app = express();

//importaciones rutas
const UsuariosRutas = require('./src/routes/usuarios.routes');
const MateriasRutas = require('./src/routes/materia.routes');
const AsignacionesRutas = require('./src/routes/asignacion.routes');

//middleware

app.use(express.urlencoded({extended: false}));
app.use(express.json());

//cabecera
app.use(cors());

//carga de rutas

app.use('/ControlAcademico', UsuariosRutas, MateriasRutas, AsignacionesRutas);



module.exports = app;

//PDFKit