import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'




export const Nav = () => {



  return (
    <>
      <nav className="nav flex-column custom-nav">
        <NavLink className="nav-link active" aria-current="page" to="/auth/dashboard">Dashboard</NavLink>
        <NavLink className="nav-link" to="/auth/consumo">Tabla de Gastos</NavLink>
        <NavLink className="nav-link" to="/auth/gastos">Ingresar Gastos</NavLink>
        <NavLink className="nav-link" to="/auth/perfil">Perfil</NavLink>
        <NavLink className="nav-link" to="/auth/logout">Cerrar Sesión</NavLink>
      </nav>

    </>
  )
}
