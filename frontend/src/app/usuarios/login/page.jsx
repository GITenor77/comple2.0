"use client"

import axios from "axios"
import { useState } from "react"

export default function Login() {
    const [credentials, setCredentials] = useState({
        usuario: "",
        password: ""
    })
    const [errorMessage, setErrorMessage] = useState("")

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setCredentials(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const verificarLogin = async (e) => {
        e.preventDefault()
        const url = "http://localhost:3000/login"

        try {
            const usuario = await axios.post(url, credentials)
            
            if (usuario.data.tipo === "usuario") {
                window.location.replace("/usuarios/mostrar")
            } else if (usuario.data.tipo === "admin") {
                window.location.replace("/usuarios/nuevo")
            } else {
                setErrorMessage("Datos incorrectos")
            }
        } catch (error) {
            setErrorMessage("Error en la autenticación")
        }
    }

    return (
        <div className="m-0 row justify-content-center">
            <form onSubmit={verificarLogin} className="col-6 mt-5">
                <div className="card">
                    <div className="card-header">
                        <h1>Login</h1>
                    </div>
                    <div className="card-body">
                        <input 
                            className="form-control mb-3" 
                            type="text" 
                            id="usuario" 
                            placeholder="Usuario" 
                            value={credentials.usuario}
                            onChange={handleInputChange}
                            autoFocus 
                        />
                        <input 
                            className="form-control mb-3" 
                            type="password" 
                            id="password" 
                            placeholder="Password"
                            value={credentials.password} 
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="card-footer">
                        <button className="btn btn-danger col-12" type="submit">
                            Iniciar sesión
                        </button>
                        {errorMessage && (
                            <div className="text-danger fs-3">
                                {errorMessage}
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    )
}