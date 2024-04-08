import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';

export const Dashboard = () => {
  // Datos de ejemplo para el gráfico de ventas
  const [salesData, setSalesData] = useState({
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
    datasets: [{
      label: 'Ventas',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 99, 132, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 1
    }]
  });

  // Crear referencia para el elemento canvas del gráfico
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Función para crear y actualizar el gráfico
  useEffect(() => {
    if (chartInstance.current) {
      // Destruir el gráfico existente antes de crear uno nuevo
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: salesData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom', // Cambiar la posición de la leyenda
          },
          title: {
            display: true,
            text: 'Gráfico de Ventas'
          }
        }
      }
    });

    // Retornar una función para limpiar el gráfico al desmontar el componente
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [salesData]);

  // Datos de ejemplo para los productos más vendidos
  const topProducts = [
    { name: 'Producto A', quantity: 100 },
    { name: 'Producto B', quantity: 90 },
    { name: 'Producto C', quantity: 80 },
    { name: 'Producto D', quantity: 70 },
    { name: 'Producto E', quantity: 60 }
  ];

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Panel de Control - Administrador</h2>
      <div className="row">
        <div className="col-md-6">
          <canvas ref={chartRef} className="w-100"></canvas> {/* Agregar clase w-100 para que el canvas ocupe todo el ancho */}
        </div>
        <div className="col-md-6">
          <h3>Productos Más Vendidos</h3>
          <ul className="list-group">
            {topProducts.map((product, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                {product.name}
                <span className="badge bg-primary rounded-pill">{product.quantity}</span> {/* Cambiar clase badge-pill a rounded-pill */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
