import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export const Nav = () => {

  //llamado al end-point para listar las categorias


  return (


    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="/">Logo</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav"
        aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/">Inicio</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link"  to="/products">Productos</NavLink>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
              Categorías
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <a className="dropdown-item" href="calefaccion.html">Calefaccion</a>
              <a className="dropdown-item" href="cocina.html">Cocina</a>
              <a className="dropdown-item" href="bano.html">Bano</a>
            </div>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Ofertas</a>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/checkout">
              <i className="bi bi-cart-fill"></i> Carro
            </Link>
          </li>
        </ul>
        <form className="form-inline">
          <input className="form-control mr-sm-2" type="search" placeholder="Buscar" aria-label="Buscar"></input>
          <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">Buscar</button>
        </form>
        <Link className="btn btn-primary ml-2" to="/login">Iniciar sesión</Link>
        <Link className="btn btn-link" to="/registro">Registrarse</Link>
      </div>
    </nav>



  )
}
