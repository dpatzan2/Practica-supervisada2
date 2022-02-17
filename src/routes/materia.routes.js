const express = require('express');
const materiasController = require('../Controllers/materias.controller');
const md_autenticacion = require('../middlewares/autenticacion');


var api = express.Router();

api.get('/materias', materiasController.obtenerMaterias);
api.post('/materias/agregar', md_autenticacion.Auth, materiasController.agregarMateria);
api.put('/materias/editar/:idMateria', md_autenticacion.Auth, materiasController.EditarMateria);
api.delete('/materias/eliminar/:idMateria', md_autenticacion.Auth, materiasController.EliminarMaterias);
api.get('/materias/profesor', md_autenticacion.Auth, materiasController.obtenerMateriasProfesor);


module.exports = api;