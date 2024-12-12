const admin = require("firebase-admin");
const keys = require("../keys.json");

class FirebaseConnection {
    constructor() {
        this.#initializeFirebase();
        this.#setupCollections();
    }

    #initializeFirebase() {
        admin.initializeApp({
            credential: admin.credential.cert(keys)
        });
        this.db = admin.firestore();
    }

    #setupCollections() {
        this.usuariosBD = this.db.collection("miEjemploBD");
        this.productosBD = this.db.collection("productos");
        this.ventasBD = this.db.collection("ventas");
    }

    async obtenerUsuarioPorId(id) {
        try {
            const usuarioDoc = await this.usuariosBD.doc(id).get();
            return usuarioDoc;
        } catch (error) {
            console.error(`Error al obtener usuario con ID ${id}:`, error);
            throw error;
        }
    }
}

const firebaseConnection = new FirebaseConnection();

module.exports = {
    usuariosBD: firebaseConnection.usuariosBD,
    productosBD: firebaseConnection.productosBD,
    ventasBD: firebaseConnection.ventasBD,
    obtenerUsuarioPorId: firebaseConnection.obtenerUsuarioPorId
};