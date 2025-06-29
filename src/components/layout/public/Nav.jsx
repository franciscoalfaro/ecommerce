import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Global } from '../../../helpers/Global'
import useAuth from '../../../hooks/useAuth'
import useCart from '../../../hooks/useCart'

export const Nav = () => {
  const { auth } = useAuth()
  const [categorys, setCategorys] = useState([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const navegar = useNavigate();
  const { totalItems } = useCart();

  const buscador = (e) => {
    e.preventDefault()
    const miBusqueda = searchTerm.trim()

    if (miBusqueda === '') {
      if (window.Swal) {
        Swal.fire({
          icon: 'warning',
          title: 'Campo vacío',
          text: 'Por favor ingresa un término de búsqueda',
          toast: true,
          position: 'top-end',
          timer: 2000,
          showConfirmButton: false,
          background: '#fff3cd',
          color: '#856404'
        });
      }
      return;
    }
    
    // Limpiar el campo de búsqueda
    setSearchTerm('');
    setIsMenuOpen(false);
    
    navegar("search/" + miBusqueda, { replace: true })
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  }

  const clearSearch = () => {
    setSearchTerm('');
  }

  useEffect(() => {
    listCategorys()
  }, [])

  const listCategorys = async () => {
    try {
      const request = await fetch(Global.url + 'category/listcategorys', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await request.json()

      if (data.status === 'success') {
        setCategorys(data.categorys || [])
      } else {
        console.log('Error al cargar categorías:', data.message)
        setCategorys([])
      }
    } catch (error) {
      console.log('Error de red al cargar categorías:', error.message)
      setCategorys([])
    }
  }

  return (
    <nav className="bg-white shadow-soft border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-gradient">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <i className="bi bi-shop text-white text-lg"></i>
              </div>
              <span>TuTienda</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" className="navbar-link">
              <i className="bi bi-house-door mr-2"></i>
              Inicio
            </NavLink>
            <NavLink to="/products" className="navbar-link">
              <i className="bi bi-grid-3x3-gap mr-2"></i>
              Productos
            </NavLink>
            
            {/* Categories Dropdown */}
            <div className="relative">
              <button 
                className="navbar-link flex items-center"
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
              >
                <i className="bi bi-tags mr-2"></i>
                Categorías
                <i className="bi bi-chevron-down ml-1 text-xs"></i>
              </button>
              
              {isCategoriesOpen && (
                <div 
                  className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-large border border-gray-100 z-50"
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                >
                  <div className="py-2">
                    {categorys.length > 0 ? (
                      categorys.map(category => (
                        <Link 
                          key={category._id} 
                          to={`categorys/${category._id}`}
                          className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                          onClick={() => setIsCategoriesOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500 text-sm">
                        No hay categorías disponibles
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <NavLink to="/offers" className="navbar-link">
              <i className="bi bi-percent mr-2"></i>
              Ofertas
            </NavLink>
          </div>

          {/* Enhanced Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <form onSubmit={buscador} className="w-full">
              <div className={`relative transition-all duration-300 ${isSearchFocused ? 'transform scale-105' : ''}`}>
                <input 
                  type="search" 
                  placeholder="¿Qué estás buscando hoy?" 
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={`w-full pl-12 pr-20 py-3 border-2 rounded-xl transition-all duration-300 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 ${
                    isSearchFocused ? 'border-primary-300 shadow-medium' : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className={`bi bi-search transition-colors duration-300 ${isSearchFocused ? 'text-primary-600' : 'text-gray-400'}`}></i>
                </div>
                
                {/* Clear button */}
                {searchTerm && (
                  <button 
                    type="button"
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-12 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <i className="bi bi-x-circle"></i>
                  </button>
                )}
                
                {/* Search button */}
                <button 
                  type="submit"
                  className={`absolute inset-y-0 right-0 mr-2 px-4 py-1 rounded-lg transition-all duration-300 ${
                    searchTerm 
                      ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!searchTerm}
                >
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors duration-200 hover:bg-primary-50 rounded-lg">
              <i className="bi bi-bag text-xl"></i>
              {totalItems > 0 && (
                <span className="cart-counter">{totalItems}</span>
              )}
            </Link>

            {/* Tracking */}
            <Link to="/seguimiento" className="hidden sm:flex items-center navbar-link">
              <i className="bi bi-truck mr-2"></i>
              Seguimiento
            </Link>

            {/* Unified Auth Button */}
            <div className="relative">
              <button 
                onClick={() => setIsAuthMenuOpen(!isAuthMenuOpen)}
                className="group relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-2.5 px-5 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-300"
              >
                <span className="relative z-10 flex items-center">
                  <i className="bi bi-person-circle mr-2"></i>
                  Identificarse
                  <i className="bi bi-chevron-down ml-2 text-xs"></i>
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>
              
              {isAuthMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-large border border-gray-100 z-50">
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">¡Bienvenido!</p>
                      <p className="text-xs text-gray-500">Accede a tu cuenta o crea una nueva</p>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      <Link 
                        to="/login" 
                        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                        onClick={() => setIsAuthMenuOpen(false)}
                      >
                        <i className="bi bi-box-arrow-in-right mr-2"></i>
                        Iniciar sesión
                      </Link>
                      
                      <Link 
                        to="/registro" 
                        className="w-full border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
                        onClick={() => setIsAuthMenuOpen(false)}
                      >
                        <i className="bi bi-person-plus mr-2"></i>
                        Crear cuenta
                      </Link>
                    </div>
                    
                    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <i className="bi bi-shield-check text-success-600"></i>
                        <span>Registro rápido y seguro</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors duration-200 hover:bg-primary-50 rounded-lg ml-2"
            >
              <i className={`bi ${isMenuOpen ? 'bi-x' : 'bi-list'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 animate-slide-up bg-white">
            <div className="flex flex-col space-y-3">
              <NavLink to="/" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-house-door mr-2"></i>
                Inicio
              </NavLink>
              <NavLink to="/products" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-grid-3x3-gap mr-2"></i>
                Productos
              </NavLink>
              
              {/* Mobile Categories */}
              <div className="px-4 py-2 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <i className="bi bi-tags mr-2"></i>
                  Categorías:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {categorys.length > 0 ? (
                    categorys.map(category => (
                      <Link 
                        key={category._id} 
                        to={`categorys/${category._id}`}
                        className="block py-2 px-3 text-sm text-gray-600 hover:text-primary-600 hover:bg-white rounded-lg transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm col-span-2">No hay categorías</div>
                  )}
                </div>
              </div>
              
              <NavLink to="/offers" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-percent mr-2"></i>
                Ofertas
              </NavLink>
              <NavLink to="/seguimiento" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-truck mr-2"></i>
                Seguimiento
              </NavLink>
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 space-y-3 border-t border-gray-100">
                <Link 
                  to="/login" 
                  className="btn-primary w-full justify-center" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="bi bi-box-arrow-in-right mr-2"></i>
                  Iniciar sesión
                </Link>
                <Link 
                  to="/registro" 
                  className="btn-outline w-full justify-center" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="bi bi-person-plus mr-2"></i>
                  Crear cuenta
                </Link>
              </div>
              
              {/* Enhanced Mobile Search */}
              <div className="pt-4 border-t border-gray-100">
                <form onSubmit={(e) => { buscador(e); setIsMenuOpen(false); }}>
                  <div className="relative">
                    <input 
                      type="search" 
                      placeholder="Buscar productos..." 
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full pl-12 pr-16 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="bi bi-search text-gray-400"></i>
                    </div>
                    {searchTerm && (
                      <button 
                        type="button"
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-12 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        <i className="bi bi-x-circle"></i>
                      </button>
                    )}
                    <button 
                      type="submit"
                      className={`absolute inset-y-0 right-0 mr-2 px-4 py-1 rounded-lg transition-all duration-300 ${
                        searchTerm 
                          ? 'bg-primary-600 text-white hover:bg-primary-700' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!searchTerm}
                    >
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}