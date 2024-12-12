"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import qs from "qs";
import "../../estilos.css";

const fetchInitialData = async () => {
    const [productos, usuarios] = await Promise.all([
        axios.get("http://localhost:3000/productos"),
        axios.get("http://localhost:3000/")
    ]);
    return { 
        availableProducts: productos.data, 
        availableUsers: usuarios.data 
    };
};

const ProductSelectionRow = ({ 
    selection, 
    index, 
    availableProducts, 
    onProductChange, 
    onRemove 
}) => {
    const selectedProduct = availableProducts.find((p) => p.id === selection.productId);
    
    return (
        <div className="product-selection-row mb-3">
            <input
                style={{ height: "60px" }}
                className="form-control mb-2"
                list={`productos-${index}`}
                value={selectedProduct?.nombre || selection.tempProductName || ""}
                onChange={(e) => onProductChange(index, "productId", e.target.value)}
                required
                placeholder="Seleccionar Producto"
            />
            <datalist id={`productos-${index}`}>
                {availableProducts.map((product) => (
                    <option key={product.id} value={product.nombre}>
                        {product.nombre}
                    </option>
                ))}
            </datalist>
            <input
                style={{ height: "60px" }}
                className="form-control"
                type="number"
                min="1"
                placeholder="Cantidad"
                value={selection.quantity}
                onChange={(e) => onProductChange(index, "quantity", Number(e.target.value))}
                required
            />
            {index > 0 && (
                <button 
                    type="button" 
                    className="btn btn-danger ml-2" 
                    onClick={() => onRemove(index)}
                >
                    Eliminar
                </button>
            )}
        </div>
    );
};

export default function NuevaVenta() {
    const router = useRouter();
    const [ventaData, setVentaData] = useState({
        clientId: "",
        tempClientName: "",
        fecha: new Date().toLocaleDateString(),
    });
    const [availableProducts, setAvailableProducts] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [productSelections, setProductSelections] = useState([
        { productId: "", tempProductName: "", quantity: 1 }
    ]);

    useEffect(() => {
        fetchInitialData().then(({ availableProducts, availableUsers }) => {
            setAvailableProducts(availableProducts);
            setAvailableUsers(availableUsers);
        });
    }, []);

    const handleClientSelection = (e) => {
        const userInput = e.target.value;
        const selectedUser = availableUsers.find((user) => user.nombre === userInput);

        setVentaData(prev => selectedUser 
            ? { ...prev, clientId: selectedUser.id, tempClientName: "" }
            : { ...prev, clientId: "", tempClientName: userInput }
        );
    };

    const handleProductSelectionChange = (index, field, value) => {
        setProductSelections(prev => {
            const updatedSelections = [...prev];
            const selectedProduct = availableProducts.find((product) => product.nombre === value);
            
            updatedSelections[index] = field === "productId"
                ? {
                    ...updatedSelections[index],
                    productId: selectedProduct ? selectedProduct.id : "",
                    tempProductName: value
                }
                : { ...updatedSelections[index], [field]: value };

            return updatedSelections;
        });
    };

    const removeProductSelection = (indexToRemove) => {
        setProductSelections(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const enviarVenta = async (e) => {
        e.preventDefault();

        const productos = productSelections
            .filter((selection) => selection.productId)
            .map((selection, index) => ({
                [`productos[${index}].id`]: selection.productId,
                [`productos[${index}].cantidad`]: selection.quantity,
            }));

        const ventaPayload = {
            usuarioId: ventaData.clientId,
            ...Object.assign({}, ...productos),
        };

        try {
            await axios.post(
                "http://localhost:3000/ventas/nuevaVenta", 
                qs.stringify(ventaPayload), 
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            );
            
            alert("Gracias por tu compra");
            router.replace("/ventas/mostrar");
        } catch (error) {
            console.error("Detalles del error al enviar la solicitud de venta:", error.response?.data || error.message);
            alert("Ocurrió un error al enviar la solicitud de venta");
        }
    };

    return (
        <div className="container">
            <h1 className="titulo">Nueva Venta</h1>
            <p className="descripcion">Completa la información para registrar una nueva venta</p>
            
            <form onSubmit={enviarVenta} className="col-12">
                <div className="card text-center">
                    <div className="card-body">
                        <input
                            style={{ height: "60px" }}
                            className="form-control mb-3"
                            list="usuarios"
                            value={availableUsers.find((user) => user.id === ventaData.clientId)?.nombre || ventaData.tempClientName || ""}
                            onChange={handleClientSelection}
                            required
                            placeholder="Seleccionar Cliente"
                        />
                        <datalist id="usuarios">
                            {availableUsers.map((user) => (
                                <option key={user.id} value={user.nombre}>
                                    {user.nombre}
                                </option>
                            ))}
                        </datalist>

                        <input
                            style={{ height: "60px" }}
                            className="form-control mb-3"
                            type="text"
                            value={`Fecha de Venta: ${ventaData.fecha}`}
                            disabled
                        />

                        {productSelections.map((selection, index) => (
                            <ProductSelectionRow
                                key={index}
                                selection={selection}
                                index={index}
                                availableProducts={availableProducts}
                                onProductChange={handleProductSelectionChange}
                                onRemove={removeProductSelection}
                            />
                        ))}

                        <button 
                            type="button" 
                            className="btn btn-secondary mb-3" 
                            onClick={() => setProductSelections(prev => [
                                ...prev, 
                                { productId: "", tempProductName: "", quantity: 1 }
                            ])}
                        >
                            Agregar Otro Producto
                        </button>

                        <div className="selected-products">
                            <h5>Productos Seleccionados:</h5>
                            <ul>
                                {productSelections.map((prod, index) => {
                                    const product = availableProducts.find((p) => p.id === prod.productId);
                                    return product ? (
                                        <li key={index}>
                                            {product.nombre} - Cantidad: {prod.quantity}
                                        </li>
                                    ) : null;
                                })}
                            </ul>
                        </div>
                    </div>

                    <div className="card-footer">
                        <button type="submit" className="btn-red">
                            Enviar solicitud de venta
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}