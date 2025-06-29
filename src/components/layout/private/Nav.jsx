import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Global } from '../../../helpers/Global'
import useCart from '../../../hooks/useCart'

export const Nav = () => {
  const [categorys, setCategorys] = useState([])
  const navegar = useNavigate();
  const { totalItems } = useCart();

  const buscador = (e) => {
    e.preventDefault()
    let miBusqueda = e.target.search_field.value
    if (miBusqueda === '') {
      console.log('debe de ingresar texto')
      return;
    }
    navegar("/auth/search/" + miBusqueda, { replace: true })
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
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-shop me-2"></i>
          TuTienda
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav"
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                <i className="bi bi-house me-1"></i>
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/auth/products">
                <i className="bi bi-grid me-1"></i>
                Productos
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                id="navbarDropdown" 
                role="button" 
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-tags me-1"></i>
                Categorías
              </a>
              <ul className="dropdown-menu shadow">
                {categorys.map(category => (
                  <li key={category._id}>
                    <Link className="dropdown-item" to={`/auth/categorys/${category._id}`}>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/auth/offers">
                <i className="bi bi-percent me-1"></i>
                Ofertas
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/auth/perfil">
                <i className="bi bi-person me-1"></i>
                Perfil
              </Link>
            </li>
            
            <li className="nav-item position-relative">
              <Link className="nav-link" to="/auth/cart">
                <i className="bi bi-cart3 me-1"></i>
                Carrito
                {totalItems > 0 && (
                  <span className="cart-counter">{totalItems}</span>
                )}
              </Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link" to="/auth/seguimiento">
                <i className="bi bi-truck me-1"></i>
                Seguimiento
              </Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link" to="/auth/order">
                <i className="bi bi-box-seam me-1"></i>
                Mis compras
              </Link>
            </li>
            
            <li className="nav-item">
              <Link className="btn btn-outline-danger btn-sm ms-2" to="/auth/logout">
                <i className="bi bi-box-arrow-right me-1"></i>
                Salir
              </Link>
            </li>
          </ul>

          <form className="d-flex ms-3" onSubmit={buscador}>
            <div className="input-group">
              <input 
                className="form-control" 
                name="search_field" 
                type="search" 
                placeholder="Buscar productos..." 
                aria-label="Buscar"
              />
              <button className="btn btn-primary" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </nav>
  )
}