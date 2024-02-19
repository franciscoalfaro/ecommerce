import React from 'react'
import { useForm } from '../../hooks/useForm'
import { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { Global } from '../../helpers/Global'
import { NavLink } from 'react-router-dom'

export const Login = () => {

  const { form, changed } = useForm({})
  const [saved, setSaved] = useState('not_sended')

  const { setAuth } = useAuth()

  const loginUser = async (e) => {
    e.preventDefault()

    //obtener datos del formulario
    let userLogin = form

    const request = await fetch(Global.url + "user/login", {
      method: "POST",
      body: JSON.stringify(userLogin),
      headers: {
        "Content-Type": "application/json"
      }
    })
    const data = await request.json()

    if (data.status == "success") {
      // Persistir datos en el navegador - guardar datos de inicio de sesión
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setSaved("login");
      // Establecer datos en el auth
      setAuth(data.user);
      // Redirección

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Login correcto',
        showConfirmButton: false,
        timer: 1150

      });
      setTimeout(() => { window.location.reload() }, 1200);


    } else if (data.status == "error_404") {
      setSaved("error_404");
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Falta usuario o clave!',

      })
    } else if (data.status == "Not Found") {
      setSaved("warning");
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Usuario no registrado!',

      })


    } else {
      setSaved("error");
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'usuario o clave incorrecto!',

      })
    }


  }


  return (

    <>



      <form onSubmit={loginUser}>
        <div className="mb-3">
        <label htmlFor="email" className="">Dirección de correo</label>
        <input type="email" name="email" className="form-control" placeholder="Email" aria-label="Email" aria-describedby="email-addon" onChange={changed} required></input>

          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
        <label htmlFor="password" className="">Contraseña</label>
                          <input type="password" name="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="password-addon" onChange={changed} required></input>

        </div>
        <div className="mb-3 ">
          <p className="mb-4 text-sm mx-auto">
            No tienes cuenta?
            <NavLink className="nav-link" to="/registro">
              <span>Regístrate</span>
            </NavLink>
          </p>
          <NavLink className="nav-link" to="/recuperar">
            <span>¿Olvidaste tu contraseña?</span>
          </NavLink>

        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>

    </>







  )
}
