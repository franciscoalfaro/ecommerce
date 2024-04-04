import React, { useState } from 'react';




export const ComisionTransaccion = () => {
    const [monto, setMonto] = useState('');
    const [comisionUSD, setComisionUSD] = useState(0);
    const [comisionCLP, setComisionCLP] = useState(0);
    const [totalUSD, setTotalUSD] = useState(0);
    const [totalCLP, setTotalCLP] = useState(0);
    const tasaCambioDolar = 750; // Tasa de cambio de pesos chilenos a dólares

    const handleInputChange = (event) => {
        setMonto(event.target.value);
    };

    const limpiarMonto = (monto) => {
        // Eliminar cualquier carácter que no sea un número o un punto decimal
        return monto.replace(/[^\d.]/g, '');
    };

    const calcularComision = () => {
        const tarifaFija = 0.30; // en dólares
        const porcentajeComision = 5.4 / 100; // convertimos el porcentaje a decimal

        // Limpiar el monto de cualquier carácter no válido
        const montoLimpio = limpiarMonto(monto);

        // Convertir el monto a número
        const montoFloat = parseFloat(montoLimpio);
        if (isNaN(montoFloat) || montoFloat <= 0) {
            alert('Por favor, ingrese un monto válido mayor que cero.');
            return;
        }

        // Convertir el monto a dólares usando la tasa de cambio
        const montoUSD = montoFloat / tasaCambioDolar;

        const comisionCalculadaUSD = montoUSD * porcentajeComision + tarifaFija;
        setComisionUSD(comisionCalculadaUSD.toFixed(2));

        // Convertir la comisión de dólares a pesos chilenos
        const comisionCLP = comisionCalculadaUSD * tasaCambioDolar;
        setComisionCLP(comisionCLP.toFixed(2));

        // Calcular el total que recibirá el cliente
        const totalUSD = montoUSD - comisionCalculadaUSD;
        setTotalUSD(totalUSD.toFixed(2));

        // Convertir el total a pesos chilenos
        const totalCLP = totalUSD * tasaCambioDolar;
        setTotalCLP(totalCLP.toFixed(2));
    };

    return (
        <div>
            <h2>Simulador de Comisión por Transacción</h2>
            <div>
                <label htmlFor="monto">Monto de la Transacción (en CLP):</label>
                <input
                    type="text" // Cambiado a texto para permitir puntos decimales
                    id="monto"
                    value={monto}
                    onChange={handleInputChange}
                />
            </div>
            <button onClick={calcularComision}>Calcular Comisión</button>
            <div>
                {comisionUSD > 0 && comisionCLP > 0 && (
                    <div>
                        <p>La comisión por transacción es:</p>
                        <p>En USD: ${comisionUSD}</p>
                        <p>En CLP: {comisionCLP} pesos chilenos</p>
                    </div>
                )}
            </div>
            <div>
                {totalUSD > 0 && totalCLP > 0 && (
                    <div>
                        <p>El total que recibirá el cliente es:</p>
                        <p>En USD: ${totalUSD}</p>
                        <p>En CLP: {totalCLP} pesos chilenos</p>
                    </div>
                )}
            </div>
        </div>
    );
};