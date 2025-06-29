import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { Global } from '../../helpers/Global';
import { FormattedNumber } from 'react-intl';

export const Grafico = () => {
  const [ventas, setVentas] = useState([]);
  const [detalleVentas, setDetalleVentas] = useState({ detalles: [], mes: null, venta: null });

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const request = await fetch(Global.url + "product/sales", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token")
          }
        });
        const data = await request.json();

        const ventasPorMes = data.ventasPorMes.map(venta => ({
          mes: venta._id.month,
          totalVentas: venta.totalVentas,
          detalles: venta.productos
        }));

        setVentas(ventasPorMes);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };
    obtenerDatos();
  }, []);

  // Array con los nombres de los meses
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // Referencia al elemento canvas del gráfico
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const generarColorRGB = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Array de colores para los trozos de la torta
  const colores = ventas.map(() => generarColorRGB());



  // Función para crear y actualizar el gráfico
  useEffect(() => {
    if (ventas.length === 0) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ventas.map(venta => meses[venta.mes - 1]), // Obtener el nombre del mes correspondiente
        datasets: [{
          label: 'Ventas por Mes',
          data: ventas.map(venta => venta.totalVentas),
          backgroundColor: colores,
          hoverOffset: 4
        }]
      },
      options: {
        onClick: (event, elements) => {
          console.log(event);
          if (elements.length) {
            const mesSeleccionado = elements[0].index;
            let mes = meses[ventas[mesSeleccionado].mes - 1];

            const ventaMes = ventas[mesSeleccionado].totalVentas - 1;

            const detalleMes = ventas[mesSeleccionado].detalles;
            setDetalleVentas({
              detalles: detalleMes,
              mes: mes,
              venta: ventaMes
            });

          } else {
            setDetalleVentas({
              detalles: [],
              mes: null,
              venta: null
            });
          }
        },


        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Total de Ventas por Mes'
          },
          legend: {
            position: 'bottom', // Cambiar la posición de la leyenda
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [ventas]);

  console.log('detalle', detalleVentas)

  return (
    <div>
      <h2>Total de Ventas por Mes</h2>
      <canvas ref={chartRef}></canvas>
      <hr></hr>
      {detalleVentas && detalleVentas.mes && (
        <div>
          <h3>Detalles de Ventas - {detalleVentas.mes}</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {detalleVentas.detalles.map((detalle, index) => (
                // Verificar si la cantidad es mayor que 0 antes de mostrar la fila
                detalle.cantidad > 0 && (
                  <tr key={index}>
                    {/* Mostrar el nombre del producto solo si está presente y no está vacío */}
                    <td>{detalle.nombreProducto[0] ? detalle.nombreProducto[0] : ''}</td>
                    {/* Mostrar la cantidad */}
                    <td>{detalle.cantidad}</td>
                  </tr>
                )
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2" className="text-end">Total</td>
                <td>
                  $<FormattedNumber value={detalleVentas.venta} style="currency" currency="CLP" />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};