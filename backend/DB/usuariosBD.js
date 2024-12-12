const { usuariosBD } = require("./conexion");
const Usuario = require("../class/Usuario");
const { validarPassword, encriptarPassword } = require("../middlewares/funcionesPassword");

class UsuariosManager {
    static validar(usuario) {
        return usuario.nombre != undefined && 
               usuario.usuario != undefined && 
               usuario.password != undefined;
    }

    static async mostrarUsuarios() {
        const usuarios = await usuariosBD.get();
        const usuariosValidos = [];
        
        usuarios.forEach(usuario => {
            const usuario1 = new Usuario({ id: usuario.id, ...usuario.data() });
            
            if (this.validar(usuario1.datos)) {
                usuariosValidos.push(usuario1.datos);
            }
        });
        
        return usuariosValidos;
    }

    static async buscarPorId(id) {
        const usuario = await usuariosBD.doc(id).get();
        const usuario1 = new Usuario({ id: usuario.id, ...usuario.data() });
        
        if (this.validar(usuario1.datos)) {
            const { password, salt, ...usuarioSinPassword } = usuario1.datos;
            return usuarioSinPassword;
        }
        
        return undefined;
    }

    static async nuevoUsuario(data) {
        const { hash, salt } = encriptarPassword(data.password);
        
        data.password = hash;
        data.salt = salt;
        data.tipoUsuario = "usuario";
        
        const usuario1 = new Usuario(data);
        
        if (this.validar(usuario1.datos)) {
            await usuariosBD.doc().set(usuario1.datos);
            return true;
        }
        
        return false;
    }

    static async borrarUsuarios(id) {
        if (await this.buscarPorId(id) != undefined) {
            console.log("Se borrará el usuario");
            await usuariosBD.doc(id).delete();
        }
        
        return true;
    }

    static async modificarUsuario(id, nuevosDatos) {
        try {
            const usuarioDoc = await usuariosBD.doc(id).get();
            if (!usuarioDoc.exists) {
                throw new Error("Usuario no encontrado");
            }

            if (nuevosDatos.password) {
                const { hash, salt } = encriptarPassword(nuevosDatos.password);
                nuevosDatos.password = hash;
                nuevosDatos.salt = salt;
            } else {
                delete nuevosDatos.password;
                delete nuevosDatos.salt;
            }

            await usuariosBD.doc(id).update(nuevosDatos);
            return { mensaje: "Usuario actualizado correctamente", id };
        } catch (error) {
            console.error("Error al modificar usuario:", error);
            throw error;
        }
    }

    static async login(req, usuario, password) {
        const usuarioEncontrado = await usuariosBD.where("usuario", "==", usuario).get();

        var user = {
            usuario: "anónimo",
            tipo: "sin acceso"
        };

        if (usuarioEncontrado.size > 0) {
            usuarioEncontrado.forEach(usu => {
                const passwordValido = validarPassword(password, usu.data().salt, usu.data().password);
                console.log(passwordValido);
                if (passwordValido) {
                    user.usuario = usu.data().usuario;

                    if (usu.data().tipoUsuario == "usuario") {
                        req.session.usuario = user.usuario;
                        user.tipo = "usuario";
                    } else if (usu.data().usuario == "admin") {
                        req.session.admin = user;
                        user.tipo = "admin";
                    }
                }
            });
        }
        console.log(user);
        return user;
    }

    static getSessionUsuario(req) {
        return req.session.usuario != undefined || req.session.admin != undefined;
    }

    static getSessionAdmin(req) {
        return req.session.admin != undefined;
    }
}

module.exports = {
    mostrarUsuarios: UsuariosManager.mostrarUsuarios.bind(UsuariosManager),
    nuevoUsuario: UsuariosManager.nuevoUsuario.bind(UsuariosManager),
    borrarUsuarios: UsuariosManager.borrarUsuarios.bind(UsuariosManager),
    buscarPorId: UsuariosManager.buscarPorId.bind(UsuariosManager),
    modificarUsuario: UsuariosManager.modificarUsuario.bind(UsuariosManager),
    login: UsuariosManager.login.bind(UsuariosManager),
    getSessionUsuario: UsuariosManager.getSessionUsuario.bind(UsuariosManager),
    getSessionAdmin: UsuariosManager.getSessionAdmin.bind(UsuariosManager)
};