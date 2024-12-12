"use client";

import Link from "next/link";
import axios from "axios";
import '../../estilos.css';
import BorrarVenta from "@/components/borrarVenta";
import EditarVentaLink from "@/components/editarVentaLink";

const fetchData = async (searchTerm) => {
    const [ventasResponse, productosResponse] = await Promise.all([
        axios.get("http://localhost:3000/ventas"),
        axios.get("http://localhost:3000/productos")
    ]);

    const ventas = searchTerm 
        ? ventasResponse.data.filter(venta => 
            venta.usuarioNombre.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : ventasResponse.data;

    return {
        ventas: ventas.filter((venta) => venta.estatus === "vendido"),
        productos: productosResponse.data
    };
};

const formatDate = (timestamp) => {
    const date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1e6);
    return date.toLocaleString();
};

const ProductDetails = ({ venta, productos }) => (
    <>
        {venta.productos.map((producto) => {
            const productoInfo = productos.find((prod) => prod.id === producto.id);
            return (
                <div key={producto.id}>
                    Nombre: {productoInfo ? productoInfo.nombre + " /---/ " : "Producto no encontrado "}
                    Cantidad: {producto.cantidad}
                </div>
            );
        })}
    </>
);

export default async function Ventas({ searchParams }) {
    const searchTerm = searchParams.search || "";
    const { ventas, productos } = await fetchData(searchTerm);

    return (
        <div className="container">
            <h1 className="titulo">Ventas</h1>
            <p className="descripcion">Estas en ventas</p>
            
            <table className="table">
                <thead>
                    <tr>
                        <th className="table-header">Nombre del Usuario</th>
                        <th className="table-header">Estatus</th>
                        <th className="table-header">Fecha</th>
                        <th className="table-header">Productos</th>
                        <th className="table-header">Editar / Borrar</th>
                    </tr>
                </thead>
                <tbody>
                    {ventas.map((venta) => (
                        <tr key={venta.id}>
                            <td className="table-data">{venta.usuarioNombre}</td>
                            <td className="table-data">{venta.estatus}</td>
                            <td className="table-data">{formatDate(venta.fecha)}</td>
                            <td className="table-data">
                                <ProductDetails venta={venta} productos={productos} />
                            </td>
                            <td className="table-data">
                                <EditarVentaLink id={venta.id} /> / <BorrarVenta id={venta.id} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <Link href="/ventas/nuevo" className="link">Agregar Venta</Link>
        </div>
    );
}