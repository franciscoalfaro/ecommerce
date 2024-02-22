import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom'
import { Global } from '../../../helpers/Global'
import useAuth from '../../../hooks/useAuth'

export const Nav = () => {
  const { auth } = useAuth()
  const [categorys, setCategorys] = useState([])
  const navegar = useNavigate();

  //crear un hooks para las ultimas publicaciones (3) y despues seleccionar al hacer clic en la publicacion se debe de ir a leer la misma

  const buscador = (e) => {
      e.preventDefault()
      let miBusqueda = e.target.search_field.value
      //aca paso el parametro del campo de la busquera y la derivo a la ruta donde esta, con este codigo { replace: true } reemplazo lo que se escribe en la url
      if (miBusqueda == '') {
          console.log('debe de ingresar texto')
      }
      navegar("search/" + miBusqueda, { replace: true })

  }
  
  useEffect(() => {
    listCategorys()
  }, [])

  //llamado al end-point para listar las categorias

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
      console.log(data.message)

    }

  }





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
            <NavLink className="nav-link" to="/products">Productos</NavLink>
          </li>


          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
              Categorías
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              {categorys.map(category => (
                <Link key={category._id} className="dropdown-item" to={`categorys/${category._id}`}>{category.name}</Link>))}
            </div>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/offers">Ofertas</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/checkout">
              <i className="bi bi-cart-fill"></i> Carro
            </Link>
          </li>
        </ul>
        <form className="form-inline" onSubmit={buscador}>
          <input className="form-control mr-sm-2" name="search_field" type="search" placeholder="Buscar" aria-label="Buscar"></input>
          <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">Buscar</button>
        </form>
        <Link className="btn btn-primary ml-2" to="/login">Iniciar sesión</Link>
        <Link className="btn btn-link" to="/registro">Registrarse</Link>
      </div>
    </nav>



  )
}
