import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Global } from '../../../helpers/Global'
import useCart from '../../../hooks/useCart'
import useAuth from '../../../hooks/useAuth'

export const Nav = () => {
  const { auth } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-soft border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center space-x-2 text-2xl font-bold text-gradient">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <i className="bi bi-shield-check text-white text-lg"></i>
              </div>
              <span>Admin Panel</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/admin" className="navbar-link">
              <i className="bi bi-speedometer2 mr-2"></i>
              Dashboard
            </NavLink>
            <NavLink to="/admin/crear" className="navbar-link">
              <i className="bi bi-plus-circle mr-2"></i>
              Crear Producto
            </NavLink>
            <NavLink to="/admin/administrar-productos" className="navbar-link">
              <i className="bi bi-box-seam mr-2"></i>
              Gestionar Productos
            </NavLink>
            <NavLink to="/admin/pedidos" className="navbar-link">
              <i className="bi bi-truck mr-2"></i>
              Pedidos
            </NavLink>
            <NavLink to="/admin/crear-usuario" className="navbar-link">
              <i className="bi bi-person-plus mr-2"></i>
              Crear Usuario
            </NavLink>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                  <i className="bi bi-person text-white text-sm"></i>
                </div>
                <span className="hidden sm:block text-sm font-medium">{auth?.name || 'Admin'}</span>
                <i className="bi bi-chevron-down text-xs"></i>
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-large border border-gray-100 z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">Panel de Administración</p>
                      <p className="text-xs text-gray-500">Gestiona tu tienda</p>
                    </div>
                    <Link 
                      to="/admin/perfil" 
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <i className="bi bi-person mr-3"></i>
                      Mi Perfil
                    </Link>
                    <Link 
                      to="/" 
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <i className="bi bi-shop mr-3"></i>
                      Ver Tienda
                    </Link>
                    <hr className="my-2" />
                    <Link 
                      to="/admin/logout" 
                      className="flex items-center px-4 py-2 text-danger-600 hover:bg-danger-50 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <i className="bi bi-box-arrow-right mr-3"></i>
                      Cerrar Sesión
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors duration-200 hover:bg-primary-50 rounded-lg"
            >
              <i className={`bi ${isMenuOpen ? 'bi-x' : 'bi-list'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 animate-slide-up bg-white">
            <div className="flex flex-col space-y-3">
              <NavLink to="/admin" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-speedometer2 mr-2"></i>
                Dashboard
              </NavLink>
              <NavLink to="/admin/crear" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-plus-circle mr-2"></i>
                Crear Producto
              </NavLink>
              <NavLink to="/admin/administrar-productos" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-box-seam mr-2"></i>
                Gestionar Productos
              </NavLink>
              <NavLink to="/admin/pedidos" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-truck mr-2"></i>
                Pedidos
              </NavLink>
              <NavLink to="/admin/crear-usuario" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-person-plus mr-2"></i>
                Crear Usuario
              </NavLink>
              <NavLink to="/admin/perfil" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-person mr-2"></i>
                Mi Perfil
              </NavLink>
              
              <div className="pt-3 border-t border-gray-100">
                <Link 
                  to="/admin/logout" 
                  className="flex items-center px-4 py-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors duration-200" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="bi bi-box-arrow-right mr-2"></i>
                  Cerrar Sesión
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}