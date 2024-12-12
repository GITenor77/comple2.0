"use client";

import axios from "axios";
import { useState } from "react";
import "../../estilos.css";

export default function Nuevo() {
    const [userData, setUserData] = useState({
        nombre: "",
        usuario: "",
        password: ""
    });
    const [errorMessage, setErrorMessage] = useState("");

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const guardarUsuario = async (e) => {
        e.preventDefault();
        const url = "http://localhost:3000/nuevoUsuario";

        try {
            await axios.post(url, userData);
            window.location.replace("http://localhost:3001/usuarios/mostrar");
        } catch (error) {
            console.error("Error al guardar el usuario:", error);
            setErrorMessage("No se pudo crear el usuario. Intente nuevamente.");
        }
    };

    return (
        <div className="container">
            <h1 className="titulo">Nuevo Usuario</h1>
            <p className="descripcion">Completa el formulario para crear un nuevo usuario</p>
            <form onSubmit={guardarUsuario} className="col-12">
                <div className="card text-center">
                    <div className="card-body">
                        <input 
                            className="form-control mb-3"
                            type="text"
                            id="nombre"
                            placeholder="Nombre"
                            value={userData.nombre}
                            onChange={handleInputChange}
                            autoFocus
                            style={{ height: "60px" }}
                            required
                        />
                        <input 
                            className="form-control mb-3"
                            type="text"
                            id="usuario"
                            placeholder="Usuario"
                            value={userData.usuario}
                            onChange={handleInputChange}
                            style={{ height: "60px" }}
                            required
                        />
                        <input 
                            className="form-control mb-3"
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={userData.password}
                            onChange={handleInputChange}
                            style={{ height: "60px" }}
                            required
                        />
                    </div>
                    <div className="card-footer">
                        <button type="submit" className="btn-red">
                            Guardar nuevo usuario
                        </button>
                    </div>
                </div>
                {errorMessage && (
                    <div className="text-danger mt-3 text-center">
                        {errorMessage}
                    </div>
                )}
            </form>
        </div>
    );
}