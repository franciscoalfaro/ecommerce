import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';

export const Register = () => {

  const { form, changed } = useForm({})
  const [saved, setSaved] = useState('not_sended')

  const saveUser = async (e) => {
    //prevenir actualizacion de pagina o pantalla al realizar envio del form
    e.preventDefault()

    //variable para almacenar datos del formulario
    let newUser = form


    //guardar datos en backend

    const request = await fetch(Global.url + "user/register", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json"
      }
    })

    const data = await request.json()


    if (data.status == "success") {
      setSaved("saved")
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Usuario Registrado Correctamente',
        showConfirmButton: false,
        timer: 1100

      });
      setTimeout(() => { window.location.href = "/login" }, 1200);

    } if (data.status == "warning") {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'usuario ya existe intenta con otro'
      })
    } if (data.status == "error") {
      setSaved("error")
    }

  }



  return (
    <>
      <section className="min-vh-100 mb-8">
        <div className="page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg">
          <span className="mask bg-gradient-dark opacity-6"></span>
      </div>
      
        <div className="container">
          <div className="row mt-lg-n10 mt-md-n11 mt-n10">
            <div className="col-xl-5 col-lg-5 col-md-7 mx-auto">
              <div className="card z-index-0">
                <div className="card-header text-center pt-4">
                  <h5>Registrate</h5>
                </div>
                <div className="card-body">
                  <form role="form text-left" onSubmit={saveUser}>
                    <div className="mb-3">
                      <label htmlFor='name'>Nombre</label>
                      <input type="text" className="form-control" name="name" placeholder="Nombre" aria-label="Name" aria-describedby="name-addon" required onChange={changed}></input>
                    </div>
                    <div className="mb-3">
                      <label htmlFor='surname'>Apellido</label>
                      <input type="text" className="form-control" name="surname" placeholder="Apellido" aria-label="Apellido" aria-describedby="name-addon" required onChange={changed}></input>
                    </div>
                    <div className="mb-3">
                      <label htmlFor='nick'>Nick</label>
                      <input type="text" className="form-control" name="nick" placeholder="Nick" aria-label="Nick" aria-describedby="name-addon" required onChange={changed}></input>
                    </div>
                    <div className="mb-3">
                      <label htmlFor='email'>Email</label>
                      <input type="email" className="form-control" name="email" placeholder="Email" aria-label="Email" aria-describedby="email-addon" required onChange={changed}></input>
                    </div>
                    <div className="mb-3">
                      <label htmlFor='password'>Password</label>
                      <input type="password" className="form-control" name="password" placeholder="Password" aria-label="Password" aria-describedby="password-addon" required onChange={changed}></input>
                    </div>

                    <div className="form-check form-check-info text-left">
                      <label htmlFor="confirm" className="form-check-label"></label>
                      <input className="form-check-input" name="confirm" type="checkbox" value="" id="flexCheckDefault" checked onChange={changed}></input>
                      Acepto los <NavLink to="/terminoycondiciones" className="text-dark font-weight-bolder">Terminos y Condiciones</NavLink>
                    </div>
                    <div className="text-center">
                      <button type="submit" className="btn btn-primary">Registrarse</button>
                    </div>
                    <p className="text-sm mt-3 mb-0">Ya tienes cuenta? <NavLink to="/login" className="text-dark font-weight-bolder">Ingresar</NavLink></p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
