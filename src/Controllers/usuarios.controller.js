const Usuarios = require('../models/usuarios.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const PDFDocument = require('pdfkit');

function ObtenerUsuarios(req, res) {

    Usuarios.find((err , usuariosObtenidos) => {
        if(err) return res.send({mensaje: "error:" + err})
        
        for (let i = 0; i < usuariosObtenidos.length; i++) {
            console.log(usuariosObtenidos[i].nombre)
        }
        
        return res.send({usuarios: usuariosObtenidos})
    })
    
} 




function RegistrarAlumnos(req, res){
    var parametros = req.body;
    var usuarioModelo = new Usuarios();

    if (parametros.nombre && parametros.apellido && parametros.usuario && parametros.password) {
        usuarioModelo.nombre = parametros.nombre;
        usuarioModelo.apellido = parametros.apellido;
        usuarioModelo.usuario = parametros.usuario;
        usuarioModelo.rol = 'ROL_ALUMNO';   
       // if(parametros.rol != 'ROL_ALUMNO' || parametros.rol == '') return res.status(500).send({mensaje: 'No puedes elegir el rol, siempre sera "alumno"'});
        Usuarios.find({usuario: parametros.usuario}, (err, usuarioEcontrado) => {
            if(usuarioEcontrado == 0){

                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                    usuarioModelo.password = passwordEncriptada;

                    usuarioModelo.save((err, usuarioGuardado) => {
                        if(err) return res.status(500).send({message: 'Error en la peticion'});
                        if(!usuarioGuardado) return res.status(404).send({message: 'No se encontraron usuarios'});
            
                        return res.status(200).send({usuario: usuarioGuardado});
                    });
                });
            }else{
                return res.status(500).send({mensaje: 'Este usuario ya esta siendo utilizado, pruebe usando otro'});
            } 
            
        })
    }
}

function RegistrarMaestros(req, res){
    var parametros = req.body;
    var usuarioModelo = new Usuarios();


    if(req.user.rol == 'ROL_ALUMNO'){
        return res.status(500).send({mensaje: 'No tienes permisos para realizar esta accion'});
    }else{
        if (parametros.nombre && parametros.apellido && parametros.usuario && parametros.password) {
            usuarioModelo.nombre = parametros.nombre;
            usuarioModelo.apellido = parametros.apellido;
            usuarioModelo.usuario = parametros.usuario;
            usuarioModelo.rol = 'ROL_MAESTRO';   
           // if(parametros.rol != 'ROL_ALUMNO' || parametros.rol == '') return res.status(500).send({mensaje: 'No puedes elegir el rol, siempre sera "alumno"'});
            Usuarios.find({usuario: parametros.usuario}, (err, usuarioEcontrado) => {
                if(usuarioEcontrado == 0){
    
                    bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                        usuarioModelo.password = passwordEncriptada;
    
                        usuarioModelo.save((err, usuarioGuardado) => {
                            if(err) return res.status(500).send({message: 'Error en la peticion'});
                            if(!usuarioGuardado) return res.status(404).send({message: 'No se encontraron usuarios'});
                
                            return res.status(200).send({usuario: usuarioGuardado});
                        });
                    });
                }else{
                    return res.status(500).send({mensaje: 'Este usuario ya esta siendo utilizado, pruebe usando otro'});
                } 
                
            })
        }
    }
}

function Login(req, res) {
    var parametros = req.body;

    Usuarios.findOne({usuario: parametros.usuario}, (err, usuarioEcontrado) =>{
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(usuarioEcontrado){
            //COMPARO CONTRASEÑA SIN ENCRIPTAR CON LA ENCRIPTADA
            bcrypt.compare(parametros.password, usuarioEcontrado.password, (err, verificacionPassword)=>{
                //VERIFICAR SI EL PASSWORD COINCIDE EN LA BASE DE DATOS
                if(verificacionPassword){

                    //SI EL PARAMETRO OBTENERTOKEN ES TRUE, CREA EL TOKEN
                    if(parametros.obtenerToken === 'true'){
                        return res.status(500).send({token: jwt.crearToken(usuarioEcontrado)});
                    }else{
                        usuarioEcontrado.password = undefined;
                        return res.status(200).send({usuario: usuarioEcontrado});
                    }
                }else{
                    return res.status(500).send({message: 'la contraseña no coincide'});
                }
            });

        }else{
            return res.status(500).send({mensaje: 'El correo no se encuentra registrado'});
        }
    });
}

function EditarUsuarios(req, res) {
    var idUsu = req.params.idUsuario;
    var parametros = req.body;

    if(req.user.rol == 'ROL_ALUMNO' && parametros.rol == 'ROL_MAESTRO') return res.status(500).send({mensaje: 'No puedes modificar tu rol, eres un alumno'});
    if(idUsu !== req.user.sub) return res.status(500).send({mensaje: 'No tiene permitido editar otros usuarios'});
        Usuarios.findByIdAndUpdate(idUsu, parametros, {new: true}, (err, usuarioActualizado) => {
            if(err) return res.status(500).send({message: 'Error en la peticion'});
            if(!usuarioActualizado) return res.status(404).send({message: 'No se encontraron usuarios'});
    
            return res.status(200).send({usuarios: usuarioActualizado});
        });
}

function EliminarUsuarios(req, res) {
    var idUsu = req.params.idUsuario;

    if(idUsu !== req.user.sub) return res.status(500).send({mensaje: 'No tiene permitido eliminar otros usuarios'});
    Usuarios.findByIdAndDelete(idUsu, {new: true}, (err, usuarioEliminado) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!usuarioEliminado) return res.status(404).send({message: 'No se encontraron usuarios'});

        return res.status(200).send({usuarios: usuarioEliminado});
    })
}

function BuscarUsuarios(req, res) {
    var busqueda = req.params.dBusqueda;

    Usuarios.find({nombre: {$regex: busqueda, $options: 'i'}}, (err, usuarioEcontrado) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!usuarioEcontrado) return res.status(404).send({message: 'No se encontraron usuarios'});

        return res.status(200).send({usuarios: usuarioEcontrado});
    })

    
}

function BuscarUsuariosA(req, res) {
    var busqueda = req.params.dBusqueda;

    Usuarios.find({apellido: {$regex: busqueda, $options: 'i'}}, (err, usuarioEcontrado) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!usuarioEcontrado) return res.status(404).send({message: 'No se encontraron usuarios'});

        return res.status(200).send({usuarios: usuarioEcontrado});
    })

    
}



function BuscarUsuariosR(req, res) {
    var busqueda = req.params.dBusqueda;

    Usuarios.find({rol: {$regex: busqueda, $options: 'i'}}, (err, usuarioEcontrado) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!usuarioEcontrado) return res.status(404).send({message: 'No se encontraron usuarios'});

        return res.status(200).send({usuarios: usuarioEcontrado});
    })

    
}

function BuscarUsuariosId(req, res){
    var idUsu = req.params.idUsuario;

    Usuarios.findById(idUsu, (err, usuarioEcontrado) => {

        if(err) return res.status(500).send({mensaje: 'error en la peticion'});
        if(!usuarioEcontrado) return res.status(404).send({mensaje: 'Error al obtener los datos'});

        return res.status(200).send({usuarios: usuarioEcontrado});
    })
}

module.exports = {
    ObtenerUsuarios,
    RegistrarAlumnos,
    RegistrarMaestros,
    EditarUsuarios,
    EliminarUsuarios,
    BuscarUsuarios,
    BuscarUsuariosA,
    BuscarUsuariosR,
    BuscarUsuariosId,
    Login,
}