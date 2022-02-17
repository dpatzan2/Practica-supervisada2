const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AsignacionesSchema = Schema({ 
    idMateria: {type: Schema.Types.ObjectId, ref: 'Materias'},
    idAlumno: {type: Schema.Types.ObjectId, ref: 'Usuarios'}

});

module.exports = mongoose.model('Asignaciones', AsignacionesSchema);