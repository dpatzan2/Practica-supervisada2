const express = require('express');
const asignacionesController = require('../Controllers/asignaciones.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api = express.Router();

api.post('/asignaciones/agregar', md_autenticacion.Auth, asignacionesController.agregarAsignacion);
api.get('/asignaciones', asignacionesController.obtenerAsignaciones);
api.delete('/asignaciones/eliminar/:idAsignacion',md_autenticacion.Auth, asignacionesController.eliminarAsignaciones);
api.put('/asignaciones/editar/:idAsignacion', md_autenticacion.Auth, asignacionesController.editarAsignacion)
api.get('/asignaciones/alumno',md_autenticacion.Auth, asignacionesController.obtenerAsignacionesPorAlumno);
api.get('/asignacionesPDF', md_autenticacion.Auth, asignacionesController.generarPDF);

module.exports = api;