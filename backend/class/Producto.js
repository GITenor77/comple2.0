class Producto {
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
            cantidad: (value) => {
                const cantidadRegex = /^[0-9]+(\.[0-9]+)?$/;
                return cantidadRegex.test(value) ? value : null;
            },
            precio: (value) => {
                const precioRegex = /^[0-9]+(\.[0-9]+)?$/;
                return (precioRegex.test(value) && value.length >= 1) ? value : null;
            }
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

    set cantidad(cantidad) {
        const cantidadRegex = /^[0-9]+(\.[0-9]+)?$/;
        if (cantidadRegex.test(cantidad)) {
            this._cantidad = cantidad;
        }
    }

    set precio(precio) {
        const precioRegex = /^[0-9]+(\.[0-9]+)?$/;
        if (precioRegex.test(precio) && precio.length >= 1) {
            this._precio = precio;
        }
    }

    get id() {
        return this._id;
    }

    get nombre() {
        return this._nombre;
    }

    get cantidad() {
        return this._cantidad;
    }

    get precio() {
        return this._precio;
    }

    get datos() {
        if (this.id != undefined) {
            return {
                id: this.id,
                nombre: this.nombre,
                cantidad: this.cantidad,
                precio: this.precio,
            };
        } else {
            return {
                nombre: this.nombre,
                cantidad: this.cantidad,
                precio: this.precio,
            };
        }
    }
}

module.exports = Producto;