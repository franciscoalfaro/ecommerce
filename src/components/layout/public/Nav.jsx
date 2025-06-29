import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Global } from '../../../helpers/Global'
import useAuth from '../../../hooks/useAuth'
import useCart from '../../../hooks/useCart'

export const Nav = () => {
  const { auth } = useAuth()
  const [categorys, setCategorys] = useState([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navegar = useNavigate();
  const { totalItems } = useCart();

  const buscador = (e) => {
    e.preventDefault()
    let miBusqueda = e.target.search_field.value

    if (miBusqueda === '') {
      console.log('debe de ingresar texto')
      return;
    }
    navegar("search/" + miBusqueda, { replace: true })
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
        setCategorys(data.categorys)
      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.log(error.message)
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
            <div className="relative group">
              <button className="navbar-link flex items-center">
                <i className="bi bi-tags mr-2"></i>
                Categorías
                <i className="bi bi-chevron-down ml-1 text-xs"></i>
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-large border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {categorys.map(category => (
                    <Link 
                      key={category._id} 
                      to={`categorys/${category._id}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <NavLink to="/offers" className="navbar-link">
              <i className="bi bi-percent mr-2"></i>
              Ofertas
            </NavLink>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <form onSubmit={buscador} className="w-full">
              <div className="relative">
                <input 
                  name="search_field"
                  type="search" 
                  placeholder="Buscar productos..." 
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="bi bi-search text-gray-400"></i>
                </div>
                <button 
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary-600 hover:text-primary-700"
                >
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors duration-200">
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

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2">
              <Link to="/login" className="btn-primary">
                <i className="bi bi-box-arrow-in-right mr-2"></i>
                Iniciar sesión
              </Link>
              <Link to="/registro" className="btn-outline hidden sm:inline-flex">
                <i className="bi bi-person-plus mr-2"></i>
                Registrarse
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
            >
              <i className={`bi ${isMenuOpen ? 'bi-x' : 'bi-list'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 animate-slide-up">
            <div className="flex flex-col space-y-2">
              <NavLink to="/" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-house-door mr-2"></i>
                Inicio
              </NavLink>
              <NavLink to="/products" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-grid-3x3-gap mr-2"></i>
                Productos
              </NavLink>
              <NavLink to="/offers" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-percent mr-2"></i>
                Ofertas
              </NavLink>
              <NavLink to="/seguimiento" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-truck mr-2"></i>
                Seguimiento
              </NavLink>
              
              {/* Mobile Search */}
              <div className="pt-4">
                <form onSubmit={buscador}>
                  <div className="relative">
                    <input 
                      name="search_field"
                      type="search" 
                      placeholder="Buscar productos..." 
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="bi bi-search text-gray-400"></i>
                    </div>
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