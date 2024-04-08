import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Global } from '../../../helpers/Global'
import useCart from '../../../hooks/useCart'

export const Nav = () => {


  return (
    <>
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
              <NavLink className="nav-link" to="/admin/crear">Crear Productos</NavLink>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/admin/administrar-productos">administrar productos</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/admin/pedidos">
                <i className="bi bi-truck"></i> Pedidos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/crear-usuario"><i className="bi bi-person"></i>Crear Usuarios</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/admin/perfil"><i className="bi bi-person"></i>Mi Perfil</Link>
            </li>

            <li className="nav-item">
              <Link className="btn btn-link" to="/admin/logout"><i className="bi bi-box-arrow-right"></i></Link>
            </li>
          </ul>
        </div>
      </nav>

    </>
  )
}
