import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/Global';
import { Grafico } from './Grafico';

export const Dashboard = () => {
  const { auth } = useAuth({})
  const [detalles, setDetalles] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [categoria, setCategorias] = useState([])
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  })

  useEffect(() => {
    obtenerDetalle(page)
    obtenerEstadisticas()
  }, [page])

  const nextPage = () => {
    let next = page + 1;
    setPage(next);
  };
  
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const obtenerDetalle = async (nextPage = 1) => {
    try {
      const request = await fetch(Global.url + "product/bestlist/" + nextPage, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token")
        }
      })
      const data = await request.json()

      if (data.status === 'success') {
        setDetalles(data.bestselling)
        setTotalPages(data.totalPages)
      } else {
        setDetalles([])
        console.log('code', data.message)
      }
    } catch (error) {
      console.log('code', error)
    }
  }

  const obtenerEstadisticas = async () => {
    try {
      // Aquí puedes agregar llamadas a endpoints para obtener estadísticas
      // Por ahora usamos datos de ejemplo
      setStats({
        totalProducts: 150,
        totalOrders: 89,
        totalRevenue: 2450000,
        pendingOrders: 12
      })
    } catch (error) {
      console.log('Error obteniendo estadísticas:', error)
    }
  }

  function generatePaginationNumbers(totalPages, currentPage) {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= halfVisiblePages) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + halfVisiblePages >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - halfVisiblePages;
        endPage = currentPage + halfVisiblePages;
      }
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  }

  const visiblePageNumbers = generatePaginationNumbers(totalPages, page);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Control</h1>
          <p className="text-gray-600">Bienvenido de vuelta, {auth?.name || 'Administrador'}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card hover-lift">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                    <i className="bi bi-box-seam text-white text-xl"></i>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Productos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card hover-lift">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-success-600 to-success-700 rounded-lg flex items-center justify-center">
                    <i className="bi bi-cart-check text-white text-xl"></i>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card hover-lift">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-secondary-600 to-secondary-700 rounded-lg flex items-center justify-center">
                    <i className="bi bi-currency-dollar text-white text-xl"></i>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card hover-lift">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-danger-600 to-danger-700 rounded-lg flex items-center justify-center">
                    <i className="bi bi-clock text-white text-xl"></i>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pedidos Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart Section */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">
                <i className="bi bi-graph-up mr-2"></i>
                Análisis de Ventas
              </h3>
            </div>
            <div className="card-body">
              <Grafico />
            </div>
          </div>

          {/* Best Sellers */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">
                <i className="bi bi-trophy mr-2"></i>
                Productos Más Vendidos
              </h3>
            </div>
            <div className="card-body">
              {detalles.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <i className="bi bi-graph-up text-2xl text-gray-400"></i>
                  </div>
                  <p className="text-gray-600">Sin información de productos más vendidos</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {detalles.map((product, index) => (
                    <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.nombreproducto}</p>
                          <p className="text-sm text-gray-600">Vendidos: {product.quantity}</p>
                        </div>
                      </div>
                      <span className="badge-success">{product.quantity} unidades</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center space-x-2">
                    <button 
                      onClick={prevPage}
                      disabled={page === 1}
                      className={`p-2 rounded-lg border ${page === 1 
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      } transition-colors duration-200`}
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>
                    
                    {visiblePageNumbers.map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`px-3 py-2 rounded-lg border font-medium transition-colors duration-200 ${
                          page === pageNumber
                            ? 'bg-primary-600 border-primary-600 text-white'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                    
                    <button 
                      onClick={nextPage}
                      disabled={page === totalPages}
                      className={`p-2 rounded-lg border ${page === totalPages 
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      } transition-colors duration-200`}
                    >
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">
                <i className="bi bi-lightning mr-2"></i>
                Acciones Rápidas
              </h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <a href="/admin/crear" className="btn-primary justify-center">
                  <i className="bi bi-plus-circle mr-2"></i>
                  Crear Producto
                </a>
                <a href="/admin/administrar-productos" className="btn-secondary justify-center">
                  <i className="bi bi-box-seam mr-2"></i>
                  Gestionar Productos
                </a>
                <a href="/admin/pedidos" className="btn-success justify-center">
                  <i className="bi bi-truck mr-2"></i>
                  Ver Pedidos
                </a>
                <a href="/admin/crear-usuario" className="btn-outline justify-center">
                  <i className="bi bi-person-plus mr-2"></i>
                  Crear Usuario
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};