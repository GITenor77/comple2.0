const express = require("express");
const cors = require("cors");
const session = require("express-session");
require('dotenv').config();

const usuariosRutas = require("./routes/rutasUsuarios");
const productosRutas = require("./routes/rutasProductos");
const ventasRutas = require("./routes/rutasVentas");

const createApp = () => {
    const app = express();

    const configureMiddleware = () => {
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use(cors());
        app.use(session({
            name: 'session',
            secret: process.env.KEYS,
            resave: false,
            saveUninitialized: true,
            cookie: { maxAge: 24 * 60 * 60 * 1000 }
        }));
    };

    const setupRoutes = () => {
        app.use("/", usuariosRutas);
        app.use("/", productosRutas);
        app.use("/", ventasRutas);
    };

    const startServer = () => {
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Servidor en http://localhost:${port}`);
        });
    };

    configureMiddleware();
    setupRoutes();
    startServer();

    return app;
};

createApp();