class Usuario {
    constructor(data) {
        this.#validateAndSetAttributes(data);
    }

    #validateAndSetAttributes(data) {
        Object.keys(this.#getValidationRules()).forEach(key => {
            if (data[key] !== undefined) {
                this[key] = data[key];
            }
        });
    }

    #getValidationRules() {
        return {
            id: (value) => value,
            nombre: (value) => {
                const nombreRegex = /^[A-ZÁÉÍÓÚÑ'][a-záéíóúñ']{1,}([ ][A-ZÁÉÍÓÚÑ'][a-záéíóúñ']{1,}){0,}$/;
                return nombreRegex.test(value) ? value : null;
            },
            usuario: (value) => {
                const usuarioRegex = /^[A-ZÁÉÍÓÚÑ'][a-záéíóúñ']{1,}([ ][A-ZÁÉÍÓÚÑ'][a-záéíóúñ']{1,}){0,}$/;
                return usuarioRegex.test(value) ? value : null;
            },
            password: (value) => value && value.length >= 6 ? value : null,
            salt: (value) => value,
            tipoUsuario: (value) => value
        };
    }

    set id(id) {
        this._id = id;
    }

    set nombre(nombre) {
        const nombreRegex = /^[A-ZÁÉÍÓÚÑ'][a-záéíóúñ']{1,}([ ][A-ZÁÉÍÓÚÑ'][a-záéíóúñ']{1,}){0,}$/;
        if (nombreRegex.test(nombre)) {
            this._nombre = nombre;
        }
    }

    set usuario(usuario) {
        const usuarioRegex = /^[A-ZÁÉÍÓÚÑ'][a-záéíóúñ']{1,}([ ][A-ZÁÉÍÓÚÑ'][a-záéíóúñ']{1,}){0,}$/;
        if (usuarioRegex.test(usuario)) {
            this._usuario = usuario;
        }
    }

    set password(password = "") {
        if (password.length >= 6) {
            this._password = password;
        }
    }

    set salt(salt) {
        this._salt = salt;
    }

    set tipoUsuario(tipoUsuario) {
        this._tipoUsuario = tipoUsuario;
    }

    get id() {
        return this._id;
    }

    get nombre() {
        return this._nombre;
    }

    get usuario() {
        return this._usuario;
    }

    get password() {
        return this._password;
    }

    get salt() {
        return this._salt;
    }

    get tipoUsuario() {
        return this._tipoUsuario;
    }

    get datos() {
        if (this.id != undefined) {
            return {
                id: this.id,
                nombre: this.nombre,
                usuario: this.usuario,
                password: this.password,
                salt: this.salt,
                tipoUsuario: this.tipoUsuario,
            };
        } else {
            return {
                nombre: this.nombre,
                usuario: this.usuario,
                password: this.password,
                salt: this.salt,
                tipoUsuario: this.tipoUsuario,
            };
        }
    }
}

module.exports = Usuario;