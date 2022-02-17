const Materia = require('../models/materias.model');
const Asignaciones = require('../models/Asignaciones.model');


function agregarMateria(req, res){
    var parametros = req.body;
    var materiaModel = new Materia();

    if(req.user.rol == 'ROL_ALUMNO'){
        return res.status(500).send({mensaje: 'No puedes realizar esta accion si esres alumno'});
    }else{
        if(parametros.nombreMateria){
            materiaModel.nombreMateria = parametros.nombreMateria;
            materiaModel.idMaestro = parametros.idMaestro;
    
            materiaModel.save((err, materiaGuardada) => {
                if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
                if(!materiaGuardada) return res.status(500).send({ mensaje: "Error al guardar la materia"});
                
                return res.status(200).send({ materia: materiaGuardada });
            });
        } else{
            return res.status(500).send({ mensaje: "Debe rellenar los campos necesarios." });
        }
    }

    
}
function obtenerMaterias(req, res) {
    Materia.find({}, (err, materiasEncontradas) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!materiasEncontradas) return res.status(500).send({ mensaje: "Error al obtener las encuestas."});

        return res.status(200).send({ materias: materiasEncontradas });
    }).populate('idMaestro', 'nombre apellido usuarios');
}

function EditarMateria(req, res) {
    var idMa = req.params.idMateria;
    var parametros = req.body;


    if(req.user.rol == 'ROL_ALUMNO'){
        return res.status(500).send({mensaje: 'No puedes realizar esta accion si esres alumno'});
    }else{
        Materia.findOneAndUpdate({ _id: idMa, idMaestro: req.user.sub },parametros,{ new: true },(error, cursoEditado) => {
            if (error) return res.status(500).send({ Error: "Error en la peticion" });
            if (!cursoEditado) return res.status(500).send({ Mensaje: "Este curso no esta a tu cargo, no lo puedes modificar" });

            return res.status(200).send({ curso: cursoEditado });
          }
        );
    }
    
}

function EliminarMaterias(req, res) {
    var idMa = req.params.idMateria;

    if(req.user.rol == 'ROL_ALUMNO'){
        return res.status(500).send({mensaje: 'No puedes realizar esta accion si esres alumno'});
    }else{
        Materia.findOneAndDelete({ _id: idMa, idMaestro: req.user.sub }, {new: true}, (err, materiaEliminada) => {
            if(err) return res.status(500).send({message: 'Error en la peticion'});
            if(!materiaEliminada) return res.status(404).send({message: 'Esta materia no esta a tu cargo, no la puedes modificar'});
            
            Asignaciones.updateMany({idMateria: idMa}, {$set:{idMateria: 'Por defecto'}});
            return res.status(200).send({materia: materiaEliminada});
        }) 
    }
    
}

function obtenerMateriasProfesor(req, res) {
    if(req.user.rol == 'ROL_ALUMNO'){
        return res.status(500).send({mensaje: 'No puedes realizar esta accion si esres alumno'});
    }else{
        Materia.find({ idMaestro: req.user.sub}, (err, materiasEncontradas) => {
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!materiasEncontradas) return res.status(404).send({mensaje: 'Error al obtener las materias del profesor'});
            return res.status(200).send({encuestas: materiasEncontradas});
        })
    }
    
}



module.exports = {
    agregarMateria,
    obtenerMaterias,
    EditarMateria,
    EliminarMaterias,
    obtenerMateriasProfesor
}