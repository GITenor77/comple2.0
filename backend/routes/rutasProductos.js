const router = require("express").Router();
const { 
    mostrarProductos, 
    nuevoProducto, 
    borrarProductos, 
    buscarPorId, 
    modificarProducto 
} = require("../DB/productosBD");

const handleAsyncRoute = (handler) => async (req, res) => {
    try {
        const result = await handler(req, res);
        res.json(result);
    } catch (error) {
        console.error(`Error en ruta: ${error}`);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

router.get("/productos", handleAsyncRoute(async () => await mostrarProductos()));

router.get("/productos/buscarPorId/:id", handleAsyncRoute(async (req) => 
    await buscarPorId(req.params.id)
));

router.post("/productos/nuevoProducto", handleAsyncRoute(async (req) => 
    await nuevoProducto(req.body)
));

router.delete("/productos/borrarProducto/:id", handleAsyncRoute(async (req) => 
    await borrarProductos(req.params.id)
));

router.put("/productos/modificarProducto/:id", handleAsyncRoute(async (req) => {
    const { id } = req.params;
    const nuevosDatos = req.body;
    return await modificarProducto(id, nuevosDatos);
}));

module.exports = router;