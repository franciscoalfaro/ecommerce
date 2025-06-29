import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import { useForm } from '../../hooks/useForm';
import { FormattedNumber } from 'react-intl';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { GetProducts } from '../../helpers/GetProducts';

export const GestionProduct = () => {
  const { form, changed } = useForm({})
  const { auth } = useAuth({})

  const [product, setProduct] = useState([])
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  useEffect(() => {
    getDataProduct();
  }, [page]);

  const deleteProduct = async (productID, index) => {
    if (window.Swal) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) return;
    }

    try {
      const request = await fetch(Global.url + 'product/delete/' + productID, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      });
      const data = await request.json();

      if (data.status === 'success') {
        const newItems = [...product];
        newItems.splice(index, 1);
        setProduct(newItems);
        getDataProduct()

        if (window.Swal) {
          Swal.fire({
            position: "bottom-end",
            title: 'Producto eliminado correctamente',
            showConfirmButton: false,
            timer: 1500,
            icon: 'success'
          });
        }
      } else {
        setProduct([]);
      }
    } catch (error) {
      console.error(error);
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

  const getDataProduct = async () => {
    setIsLoading(true);
    try {
      let data = await GetProducts(page, setProduct, setTotalPages);
      setProduct(data.products);
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = product.filter(prod => 
    prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prod.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prod.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Productos</h1>
              <p className="text-gray-600">Administra tu inventario de productos</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link to="/admin/crear" className="btn-primary">
                <i className="bi bi-plus-circle mr-2"></i>
                Nuevo Producto
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar productos por nombre, categoría o marca..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="bi bi-search text-gray-400"></i>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {filteredProducts.length} de {product.length} productos
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="card">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((prod, index) => (
                    <tr key={prod._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {prod.images && prod.images.length > 0 ? (
                              <img 
                                className="h-12 w-12 rounded-lg object-cover" 
                                src={Global.url + 'product/media/' + prod.images[0].filename} 
                                alt={prod.name}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                <i className="bi bi-image text-gray-400"></i>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">
                              {prod.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {prod.brand}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="badge-primary">
                          {prod.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {prod.stock ? prod.stock.quantity : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {prod.stock ? prod.stock.location : 'Sin ubicación'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          <FormattedNumber value={prod.price} style="currency" currency="CLP" />
                        </div>
                        {prod.offerprice && prod.offerprice > 0 && (
                          <div className="text-sm text-success-600">
                            Oferta: <FormattedNumber value={prod.offerprice} style="currency" currency="CLP" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {prod.standout ? (
                          <span className="badge-success">Destacado</span>
                        ) : (
                          <span className="badge bg-gray-100 text-gray-800">Normal</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link 
                            to={`/admin/editar-producto/${prod._id}`}
                            className="text-primary-600 hover:text-primary-900 p-2 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                            title="Editar producto"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button 
                            onClick={() => deleteProduct(prod._id, index)}
                            className="text-danger-600 hover:text-danger-900 p-2 hover:bg-danger-50 rounded-lg transition-colors duration-200"
                            title="Eliminar producto"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <i className="bi bi-search text-4xl text-gray-400"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay productos registrados'}
                </p>
                {!searchTerm && (
                  <Link to="/admin/crear" className="btn-primary">
                    <i className="bi bi-plus-circle mr-2"></i>
                    Crear primer producto
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
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
                  className={`px-4 py-2 rounded-lg border font-medium transition-colors duration-200 ${
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
  );
};