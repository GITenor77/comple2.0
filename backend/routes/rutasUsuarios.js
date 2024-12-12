const router = require("express").Router();
const { 
    mostrarUsuarios, 
    nuevoUsuario, 
    borrarUsuarios, 
    buscarPorId, 
    modificarUsuario, 
    login, 
    getSessionUsuario, 
    getSessionAdmin 
} = require("../bd/usuariosBD");

const handleAsyncRoute = (handler) => async (req, res) => {
    try {
        const result = await handler(req, res);
        res.json(result);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

router.get("/", handleAsyncRoute(async () => await mostrarUsuarios()));

router.get("/buscarPorId/:id", handleAsyncRoute(async (req) => 
    await buscarPorId(req.params.id)
));

router.post("/nuevoUsuario", handleAsyncRoute(async (req) => 
    await nuevoUsuario(req.body)
));

router.delete("/borrarUsuario/:id", handleAsyncRoute(async (req) => 
    await borrarUsuarios(req.params.id)
));

router.put("/modificarUsuario/:id", handleAsyncRoute(async (req) => {
    const { id } = req.params;
    const nuevosDatos = req.body;
    return await modificarUsuario(id, nuevosDatos);
}));

router.post("/login", handleAsyncRoute(async (req) => 
    await login(req, req.body.usuario, req.body.password)
));

router.get("/getSessionUsuario", (req, res) => {
    const sesionValida = getSessionUsuario(req);
    res.json(sesionValida);
});

router.get("/getSessionAdmin", (req, res) => {
    res.json(getSessionAdmin(req));
});

module.exports = router;