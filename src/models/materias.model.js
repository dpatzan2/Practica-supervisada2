const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MateriasSchema = Schema({ 
    nombreMateria: String,
    idMaestro: {type: Schema.Types.ObjectId, ref: 'Usuarios'}
});


module.exports = mongoose.model('Materias', MateriasSchema);