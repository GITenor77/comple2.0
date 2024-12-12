const {productosBD} = require("./conexion");
const Producto = require("../class/Producto");

class ProductosManager {
    static validar(producto) {
        return producto.nombre != undefined && 
               producto.cantidad != undefined && 
               producto.precio != undefined;
    }

    static async mostrarProductos() {
        const productos = await productosBD.get();
        const productosValidos = [];
        
        productos.forEach(producto => {
            const producto1 = new Producto({id: producto.id, ...producto.data()});
            
            if (this.validar(producto1.datos)) {
                productosValidos.push(producto1.datos);
            }
        });
        
        return productosValidos;
    }

    static async buscarPorId(id) {
        const producto = await productosBD.doc(id).get();
        const producto1 = new Producto({id: producto.id, ...producto.data()});
        
        return this.validar(producto1.datos) ? producto1.datos : undefined;
    }

    static async nuevoProducto(data) {
        const producto1 = new Producto(data);
        
        if (this.validar(producto1.datos)) {
            await productosBD.doc().set(producto1.datos);
            return true;
        }
        
        return false;
    }

    static async borrarProductos(id) {
        if (await this.buscarPorId(id) != undefined) {
            console.log("Se borrará el producto");
            await productosBD.doc(id).delete();
        }
        
        return true;
    }

    static async modificarProducto(id, nuevosDatos) {
        try {
            const productoDoc = await productosBD.doc(id).get();
            if (!productoDoc.exists) {
                throw new Error("Producto no encontrado");
            }
            await productosBD.doc(id).update(nuevosDatos);
            return { mensaje: "Producto actualizado correctamente", id };
        } catch (error) {
            console.error("Error al modificar producto:", error);
            throw error;
        }
    }
}

module.exports = {
    mostrarProductos: ProductosManager.mostrarProductos.bind(ProductosManager),
    nuevoProducto: ProductosManager.nuevoProducto.bind(ProductosManager),
    borrarProductos: ProductosManager.borrarProductos.bind(ProductosManager),
    buscarPorId: ProductosManager.buscarPorId.bind(ProductosManager),
    modificarProducto: ProductosManager.modificarProducto.bind(ProductosManager)
};