const crypto = require("crypto");

const passwordUtils = {
    encriptarPassword(password) {
        const salt = crypto.randomBytes(32).toString("hex");
        const hash = crypto.scryptSync(password, salt, 100000, 64, "sha512").toString("hex");
        
        return { salt, hash };
    },

    validarPassword(password, salt, hash) {
        const hashEvaluar = crypto.scryptSync(password, salt, 100000, 64, "sha512").toString("hex");
        return hashEvaluar === hash;
    },

    usuarioAutorizado(req) {
        return req.session.usuarioAutorizado === true;
    },

    adminAutorizado(req) {
        return req.session.admin === true;
    }
};

module.exports = passwordUtils;