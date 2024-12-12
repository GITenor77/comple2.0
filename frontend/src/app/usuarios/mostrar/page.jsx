"use client";

import Link from "next/link";
import axios from "axios";
import '../../estilos.css';
import BorrarUsuario from "@/components/borrar";
import EditarUsuario from "@/components/editar";
import { useState, useEffect } from 'react';

const fetchSessionUsuario = async () => {
    try {
        const url = "http://localhost:3000/getSessionUsuario";
        const sesionValida = await axios.get(url);
        return sesionValida.data;
    } catch (error) {
        console.error("Error fetching session:", error);
    }
};

const fetchUsuarios = async (searchTerm) => {
    try {
        const url = "http://localhost:3000";
        const usuarios = await axios.get(url);
        
        if (searchTerm) {
            return usuarios.data.filter(usuario => 
                usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        return usuarios.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

export default function Usuarios({ searchParams }) {
    const [usuarios, setUsuarios] = useState([]);
    const searchTerm = searchParams.search || "";

    useEffect(() => {
        const loadData = async () => {
            await fetchSessionUsuario();
            const fetchedUsuarios = await fetchUsuarios(searchTerm);
            setUsuarios(fetchedUsuarios);
        };

        loadData();
    }, [searchTerm]);

    return (
        <div className="container">
            <h1 className="titulo">Usuarios</h1>
            <p className="descripcion">Estas en usuarios</p>
            <table className="table">
                <thead>
                    <tr>
                        <th className="table-header">Id</th>
                        <th className="table-header">Nombre</th>
                        <th className="table-header">Usuario</th>
                        <th className="table-header">Editar / Borrar</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario, i) => (
                        <tr key={i}>
                            <td className="table-data">{i + 1}</td>
                            <td className="table-data">{usuario.nombre}</td>
                            <td className="table-data">{usuario.usuario}</td>
                            <td className="table-data">
                                <EditarUsuario id={usuario.id} /> / <BorrarUsuario id={usuario.id} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link href="/usuarios/nuevo" className="link">
                Agregar Usuario
            </Link>
        </div>
    );
}