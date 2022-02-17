const Asignacion = require('../models/Asignaciones.model');
const PDFDocument = require('pdfkit');


function agregarAsignacion(req, res){
    var parametros = req.body;
    var asginacionModel = new Asignacion();
        Asignacion.find({idAlumno: parametros.idAlumno}, (err, repetidos)=>{
            if(err) return res.status(500).send({mensaje: 'error en la peticion'});
            if(!repetidos) return res.status(404).send({mensaje: 'Error al obtener los datos'});

            if(repetidos.length!=3){
                if(parametros.idMateria){
                    asginacionModel.idMateria = parametros.idMateria;
                    asginacionModel.idAlumno = req.user.sub;
                    Asignacion.find({idMateria: parametros.idMateria}, (err, idMateriaEncontrada)=>{
                        if(err) return res.status(500).send({mensaje: 'error en la peticion'});
                        if(idMateriaEncontrada == 0){                     
                            asginacionModel.save((err, asignacionGuardad) => {
                                if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                if(!asignacionGuardad) return res.status(500).send({ mensaje: "Error al guardar la asignacion"});
                                                
                                return res.status(200).send({ asignacion: asignacionGuardad });
                            });
                   
                        }else{
                            return res.status(500).send({ mensaje: "Ya te encuentras asignado a este curso" });
                        }
                        })
                } else{
                    return res.status(500).send({ mensaje: "Debe rellenar los campos necesarios." });
                }
            }else{
                return res.status(500).send({ mensaje: "No te puedes asignar a mas de 3 cursos" });
            }
        })
}

function obtenerAsignaciones(req, res) {
    Asignacion.find({}, (err, asignacionesEncontradas) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!asignacionesEncontradas) return res.status(500).send({ mensaje: "Error al obtener las asignaciones."});

        return res.status(200).send({ asignaciones: asignacionesEncontradas });
    }).populate('idMateria', 'nombreMateria')
        .populate('idAlumno', 'nombre apellido usuario')
}

function editarAsignacion(req, res) {
    var idAsig = req.params.idAsignacion;
    var parametros = req.body;
    Asignacion.findOneAndUpdate({ _id: idAsig, idAlumno: req.user.sub },parametros,{ new: true },(error, asignacionEditada) => {
        if (error) return res.status(500).send({ Error: "Error en la peticion" });
        if (!asignacionEditada) return res.status(500).send({ Mensaje: "Esta asignacion no es tuya, no lo puedes modificar" });

        return res.status(200).send({ asignacion: asignacionEditada });
      }
    );
    
}

function eliminarAsignaciones(req, res) {
    var idAsig = req.params.idAsignacion;

    Asignacion.findOneAndDelete({ _id: idAsig, idAlumno: req.user.sub }, {new: true}, (err, asignacionEliminada) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!asignacionEliminada) return res.status(404).send({message: 'Esta asignacion no es tuya, no la puedes modificar'});
        return res.status(200).send({asignacion: asignacionEliminada});
    }) 
    
}

function obtenerAsignacionesPorAlumno(req, res) {
    Asignacion.find({idAlumno: req.user.sub}, (err, asignacionesEncontradas) => {
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!asignacionesEncontradas) return res.status(404).send({mensaje: 'Error al obtener las asignaciones del alumno'});

        return res.status(200).send({asignaciones: asignacionesEncontradas});
    })
}

function generarPDF(req, res) {
    Asignacion.find({idAlumno: req.user.sub}, (err, asignacionesEncontradas) => {
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!asignacionesEncontradas) return res.status(404).send({mensaje: 'Error al obtener las asignaciones del alumno'});
 
        const doc = new PDFDocument({bufferPage: true});

        const filename = 'Asignaciones${Date.now()}.pdf';
        const stream = res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-disposition': 'attachment;filename=${filename}'
            
        });
        doc.on('data', (data) => {stream.write(data)});
        doc.on('end', () =>{stream.end()});
        doc.text(asignacionesEncontradas);
        doc.end;
    })
}


module.exports = {
    agregarAsignacion,
    obtenerAsignaciones,
    editarAsignacion,
    eliminarAsignaciones,
    obtenerAsignacionesPorAlumno,
    generarPDF
}