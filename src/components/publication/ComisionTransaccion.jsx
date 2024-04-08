import React, { useState } from 'react';


export const ComisionTransaccion = () => {
    const [montoVenta, setMontoVenta] = useState('');
    const [comisionTotal, setComisionTotal] = useState(0);

    const calcularComision = () => {
        // Verificar que el monto de la venta sea un número válido
        if (!isNaN(parseFloat(montoVenta))) {
            // Calcular la comisión (2.3%)
            const comision = parseFloat(montoVenta) * 0.023;
            // Calcular el IVA (19%)
            const iva = comision * 0.19;
            // Calcular el total de la comisión (comisión + IVA)
            const totalComision = comision + iva;
            // Actualizar el estado con el total de la comisión
            setComisionTotal(totalComision);
        } else {
            // Si el monto de la venta no es válido, mostrar un mensaje de error
            alert('Por favor, introduce un monto de venta válido.');
        }
    };

    return (
        <div>
            <h2>Calculadora de Comisión de Venta en Chile</h2>
            <div>
                <label htmlFor="montoVenta">Monto de la Venta (CLP):</label>
                <input
                    type="text"
                    id="montoVenta"
                    value={montoVenta}
                    onChange={(e) => setMontoVenta(e.target.value)}
                />
            </div>
            <button onClick={calcularComision}>Calcular Comisión</button>
            {comisionTotal > 0 && (
                <div>
                    <h3>Comisión Total:</h3>
                    <p>{comisionTotal.toFixed(2)} CLP</p>
                </div>
            )}
        </div>
    );
};