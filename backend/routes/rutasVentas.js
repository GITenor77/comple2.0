const router = require("express").Router();
const { 
    nuevaVenta, 
    mostrarVentas, 
    buscarVentaPorId, 
    cancelarVenta, 
    modificarVenta 
} = require("../bd/ventasBD");

const handleAsyncRoute = (handler, errorMessage) => async (req, res) => {
    try {
        const result = await handler(req, res);
        res.json(result);
    } catch (error) {
        console.error(errorMessage, error);
        res.status(500).json({ success: false, message: errorMessage });
    }
};

router.get("/ventas", handleAsyncRoute(
    async () => await mostrarVentas(), 
    "Error al obtener las ventas"
));

router.post("/ventas/nuevaVenta", handleAsyncRoute(
    async (req) => await nuevaVenta(req.body),
    "Error al generar la venta"
));

router.get("/ventas/buscarVentaPorId/:ventaId", handleAsyncRoute(
    async (req) => await buscarVentaPorId(req.params.ventaId),
    "Error al buscar la venta"
));

router.patch("/ventas/cancelarVenta/:ventaId", handleAsyncRoute(
    async (req) => await cancelarVenta(req.params.ventaId),
    "Error al cancelar la venta"
));

router.put("/ventas/modificarVenta/:ventaId", handleAsyncRoute(
    async (req) => {
        const { ventaId } = req.params;
        const nuevosDatos = req.body;
        return await modificarVenta(ventaId, nuevosDatos);
    },
    "Error al modificar la venta"
));

module.exports = router;