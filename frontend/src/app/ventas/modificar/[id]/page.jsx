"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import "../../../estilos.css";

const modificarVenta = async (e, id, ventaData, setMensaje) => {
    e.preventDefault();
    const url = `http://localhost:3000/ventas/modificarVenta/${id}`;

    try {
        const respuesta = await axios.put(url, ventaData);
        setMensaje("Venta modificada exitosamente.");
        setTimeout(() => {
            window.location.href = "/ventas/mostrar";
        }, 2000);
    } catch (error) {
        console.error("Error al modificar la venta:", error);
        setMensaje("Error al modificar la venta.");
    }
};

const useVentaData = (id) => {
    const [venta, setVenta] = useState({
        usuarioId: "",
        tempClientName: "",
        productos: [],
        estatus: "",
    });
    const [availableProducts, setAvailableProducts] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [modificationDate, setModificationDate] = useState(new Date().toLocaleDateString());

    useEffect(() => {
        const fetchVentaData = async () => {
            const url = `http://localhost:3000/ventas/buscarVentaPorId/${id}`;
            const response = await axios.get(url);
            setVenta(response.data.venta);
        };

        const fetchResources = async () => {
            const productsResponse = await axios.get("http://localhost:3000/productos");
            setAvailableProducts(productsResponse.data);

            const usersResponse = await axios.get("http://localhost:3000/");
            setAvailableUsers(usersResponse.data);
        };

        fetchVentaData();
        fetchResources();
    }, [id]);

    return { 
        venta, 
        setVenta, 
        availableProducts, 
        availableUsers, 
        modificationDate 
    };
};

const ClientSelection = ({ venta, setVenta, availableUsers }) => {
    const handleClientSelection = (e) => {
        const userInput = e.target.value;
        const selectedUser = availableUsers.find((user) => user.nombre === userInput);

        if (selectedUser) {
            setVenta({ ...venta, usuarioId: selectedUser.id, tempClientName: "" });
        } else {
            setVenta({ ...venta, usuarioId: "", tempClientName: userInput });
        }
    };

    return (
        <>
            <input
                className="form-control mb-3"
                list="usuarios"
                value={availableUsers.find((user) => user.id === venta.usuarioId)?.nombre || venta.tempClientName || ""}
                onChange={handleClientSelection}
                required
                placeholder="Seleccionar Cliente"
                style={{ height: "60px" }}
            />
            <datalist id="usuarios">
                {availableUsers.map((user) => (
                    <option key={user.id} value={user.nombre}>
                        {user.nombre}
                    </option>
                ))}
            </datalist>
        </>
    );
};

const ProductSelections = ({ venta, setVenta, availableProducts }) => {
    const handleProductSelectionChange = (index, field, value) => {
        setVenta((prevVenta) => {
            const updatedProducts = [...prevVenta.productos];
            if (field === "id") {
                const selectedProduct = availableProducts.find((product) => product.nombre === value);
                updatedProducts[index] = {
                    ...updatedProducts[index],
                    id: selectedProduct ? selectedProduct.id : "",
                    tempProductName: value,
                };
            } else {
                updatedProducts[index][field] = value;
            }
            return { ...prevVenta, productos: updatedProducts };
        });
    };

    return venta.productos.map((producto, index) => (
        <div key={index} className="product-selection-row mb-3">
            <input
                className="form-control mb-2"
                list={`productos-${index}`}
                value={availableProducts.find((product) => product.id === producto.id)?.nombre || producto.tempProductName || ""}
                onChange={(e) => handleProductSelectionChange(index, "id", e.target.value)}
                required
                placeholder="Seleccionar Producto"
                style={{ height: "60px" }}
            />
            <datalist id={`productos-${index}`}>
                {availableProducts.map((product) => (
                    <option key={product.id} value={product.nombre}>
                        {product.nombre}
                    </option>
                ))}
            </datalist>
            <input
                className="form-control"
                type="number"
                min="1"
                placeholder="Cantidad"
                value={producto.cantidad}
                onChange={(e) => handleProductSelectionChange(index, "cantidad", Number(e.target.value))}
                required
                style={{ height: "60px" }}
            />
        </div>
    ));
};

export default function EditarVentaForm({ params }) {
    const { id } = params;
    const { 
        venta, 
        setVenta, 
        availableProducts, 
        availableUsers, 
        modificationDate 
    } = useVentaData(id);
    const [mensaje, setMensaje] = useState("");

    return (
        <div className="container">
            <h1 className="titulo">Modificar Venta</h1>
            <form onSubmit={(e) => modificarVenta(e, id, venta, setMensaje)} className="col-12">
                <div className="card text-center">
                    <div className="card-body">
                        <ClientSelection 
                            venta={venta} 
                            setVenta={setVenta} 
                            availableUsers={availableUsers} 
                        />

                        <input
                            className="form-control mb-3"
                            type="text"
                            value={`Fecha de Modificación: ${modificationDate}`}
                            disabled
                            style={{ height: "60px" }}
                        />

                        <ProductSelections 
                            venta={venta} 
                            setVenta={setVenta} 
                            availableProducts={availableProducts} 
                        />
                    </div>

                    <div className="card-footer">
                        <button type="submit" className="btn-red">
                            Modificar venta
                        </button>
                    </div>
                </div>
                {mensaje && <p className="text-center mt-3">{mensaje}</p>}
            </form>
        </div>
    );
}