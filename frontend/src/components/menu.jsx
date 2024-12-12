"use client";
import { useState } from "react";
import Link from "next/link";

export default function Menu() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("usuarios");

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm) {
            // Redirigir a la página de búsqueda según el tipo seleccionado
            window.location.href = `/${searchType}/mostrar?search=${searchTerm}`;
        }
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link className="navbar-brand" href="/">Navbar</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" href="/usuarios/mostrar">Usuarios</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" href="/usuarios/nuevo">Agregar Usuario</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" href="/productos/mostrar">Productos</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" href="/productos/nuevo">Agregar Producto</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" href="/ventas/mostrar">Ventas</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" href="/ventas/nuevo">Crear Venta</Link>
                            </li>
                        </ul>
                        <form className="d-flex" role="search" onSubmit={handleSearch}>
                            <select 
                                className="form-select me-2" 
                                value={searchType} 
                                onChange={(e) => setSearchType(e.target.value)}
                            >
                                <option value="usuarios">Usuarios</option>
                                <option value="productos">Productos</option>
                                <option value="ventas">Ventas</option>
                            </select>
                            <input
                                className="form-control me-2"
                                type="search"
                                placeholder="Buscar"
                                aria-label="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="btn btn-outline-success" type="submit">Buscar</button>
                        </form>
                    </div>
                </div>
            </nav>
        </div>
    );
}
