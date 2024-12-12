"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import "../../../estilos.css";

const modificarUsuario = async (e, id, datos, setMensaje) => {
    e.preventDefault();
    const url = `http://localhost:3000/modificarUsuario/${id}`;

    const cleanedDatos = { ...datos };
    if (!cleanedDatos.password) {
        delete cleanedDatos.password;
    }

    try {
        await axios.put(url, cleanedDatos);
        setMensaje("Usuario modificado exitosamente.");
        
        setTimeout(() => {
            window.location.href = "/usuarios/mostrar";
        }, 2000);
    } catch (error) {
        console.error("Error al modificar el usuario:", error);
        setMensaje("Error al modificar el usuario.");
    }
};

export default function ModificarUsuario({ params }) {
    const [usuario, setUsuario] = useState({
        nombre: "",
        usuario: "",
        password: ""
    });
    const [mensaje, setMensaje] = useState("");
    const { id } = params;

    useEffect(() => {
        const obtenerUsuario = async () => {
            if (id) {
                const url = `http://localhost:3000/buscarPorId/${id}`;
                try {
                    const respuesta = await axios.get(url);
                    setUsuario({
                        ...respuesta.data,
                        password: ""
                    });
                } catch (error) {
                    console.error("Error al cargar usuario:", error);
                }
            }
        };
        
        obtenerUsuario();
    }, [id]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setUsuario(prev => ({ ...prev, [id]: value }));
    };

    return (
        <div className="container">
            <h1 className="titulo">Modificar Usuario</h1>
            <form 
                onSubmit={(e) => modificarUsuario(e, id, usuario, setMensaje)} 
                className="col-12"
            >
                <div className="card text-center">
                    <div className="card-body">
                        <input
                            className="form-control mb-3"
                            type="text"
                            id="nombre"
                            placeholder="Nombre"
                            value={usuario.nombre}
                            onChange={handleChange}
                            style={{ height: "60px" }}
                            autoFocus
                        />
                        <input
                            className="form-control mb-3"
                            type="text"
                            id="usuario"
                            placeholder="Usuario"
                            value={usuario.usuario}
                            onChange={handleChange}
                            style={{ height: "60px" }}
                        />
                        <input
                            className="form-control mb-3"
                            type="password"
                            id="password"
                            placeholder="Nueva Contraseña (opcional)"
                            value={usuario.password}
                            onChange={handleChange}
                            style={{ height: "60px" }}
                        />
                    </div>
                    <div className="card-footer">
                        <button type="submit" className="btn-red">
                            Modificar usuario
                        </button>
                    </div>
                </div>
                {mensaje && <p className="text-center mt-3">{mensaje}</p>}
            </form>
        </div>
    );
}