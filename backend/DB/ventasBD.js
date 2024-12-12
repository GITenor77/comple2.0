const { productosBD, ventasBD, obtenerUsuarioPorId } = require("./conexion");

class SalesService {
    static async #validateProducts(productos) {
        let total = 0;
        const validatedProducts = [];

        for (let producto of productos) {
            try {
                const productoData = await productosBD.doc(producto.id).get();
                
                if (!productoData.exists) {
                    throw new Error(`Producto con ID ${producto.id} no existe`);
                }

                const productoInfo = productoData.data();
                const precio = productoInfo.precio;
                const subtotal = precio * producto.cantidad;
                total += subtotal;

                validatedProducts.push({
                    ...producto,
                    precio,
                    subtotal
                });
            } catch (error) {
                console.error(`Error validando producto ${producto.id}:`, error);
                throw error;
            }
        }

        return { total, validatedProducts };
    }

    static async nuevaVenta(data) {
        console.log("Iniciando creación de venta...");

        const productos = [];
        for (let i = 0; i < data.productos.length; i += 2) {
            productos.push({
                id: data.productos[i],
                cantidad: parseInt(data.productos[i + 1])
            });
        }

        try {
            const { total, validatedProducts } = await this.#validateProducts(productos);

            const venta = {
                usuarioId: data.usuarioId,
                productos: validatedProducts,
                total: total,
                estatus: "vendido",
                fecha: new Date()
            };

            const nuevaVentaRef = await ventasBD.doc();
            await nuevaVentaRef.set(venta);

            console.log("Venta registrada exitosamente");
            return { 
                success: true, 
                message: "Venta registrada exitosamente", 
                ventaId: nuevaVentaRef.id 
            };
        } catch (error) {
            console.error("Error al registrar la venta:", error);
            return { 
                success: false, 
                message: error.message || "Error al registrar la venta" 
            };
        }
    }

    static async buscarVentaPorId(ventaId) {
        try {
            const ventaDoc = await ventasBD.doc(ventaId).get();
            
            if (!ventaDoc.exists) {
                return { 
                    success: false, 
                    message: `La venta con ID ${ventaId} no existe` 
                };
            }

            return { 
                success: true, 
                venta: ventaDoc.data() 
            };
        } catch (error) {
            console.error(`Error al buscar venta ${ventaId}:`, error);
            return { 
                success: false, 
                message: `Error al buscar la venta con ID ${ventaId}` 
            };
        }
    }

    static async cancelarVenta(ventaId) {
        try {
            const ventaDoc = await ventasBD.doc(ventaId).get();
            
            if (!ventaDoc.exists) {
                return { 
                    success: false, 
                    message: `La venta con ID ${ventaId} no existe` 
                };
            }

            await ventasBD.doc(ventaId).update({ estatus: "cancelado" });
            
            return { 
                success: true, 
                message: `Venta con ID ${ventaId} cancelada exitosamente` 
            };
        } catch (error) {
            console.error(`Error al cancelar venta ${ventaId}:`, error);
            return { 
                success: false, 
                message: `Error al cancelar la venta con ID ${ventaId}` 
            };
        }
    }

    static async mostrarVentas() {
        const ventas = await ventasBD.get();
        const ventasValidas = [];

        for (const venta of ventas.docs) {
            const ventaData = venta.data();
            let usuarioNombre = "Usuario no encontrado";

            try {
                const usuario = await obtenerUsuarioPorId(ventaData.usuarioId);
                if (usuario.exists) {
                    usuarioNombre = usuario.data().nombre;
                }
            } catch (error) {
                console.error(`Error al obtener usuario ${ventaData.usuarioId}:`, error);
            }

            ventasValidas.push({
                id: venta.id,
                usuarioNombre,
                ...ventaData,
            });
        }

        return ventasValidas;
    }

    static async modificarVenta(ventaId, nuevosDatos) {
        try {
            const ventaDoc = await ventasBD.doc(ventaId).get();
            
            if (!ventaDoc.exists) {
                return { 
                    success: false, 
                    message: `La venta con ID ${ventaId} no existe` 
                };
            }

            await ventasBD.doc(ventaId).update(nuevosDatos);
            
            return { 
                success: true, 
                message: `Venta con ID ${ventaId} modificada exitosamente` 
            };
        } catch (error) {
            console.error(`Error al modificar venta ${ventaId}:`, error);
            return { 
                success: false, 
                message: `Error al modificar la venta con ID ${ventaId}` 
            };
        }
    }
}

// Mantener la verificación de conexión a productos
productosBD.get()
    .then(snapshot => {
        console.log(snapshot.empty ? 'No se encontraron productos.' : 'Conexión a productos exitosa.');
    })
    .catch(err => {
        console.log('Error al conectar a productos:', err);
    });

module.exports = {
    nuevaVenta: SalesService.nuevaVenta.bind(SalesService),
    mostrarVentas: SalesService.mostrarVentas.bind(SalesService),
    buscarVentaPorId: SalesService.buscarVentaPorId.bind(SalesService),
    cancelarVenta: SalesService.cancelarVenta.bind(SalesService),
    modificarVenta: SalesService.modificarVenta.bind(SalesService),
};