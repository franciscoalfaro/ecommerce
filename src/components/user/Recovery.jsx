import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm';
import { NavLink, useNavigate } from 'react-router-dom';
import { Global } from '../../helpers/Global'
import { Spiner } from '../../hooks/Spiner';
import userImage from '../../assets/img/default.png'
 

export const Recovery = () => {

  const { form, changed } = useForm({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const recoverUser = async (e) => {
    e.preventDefault();
    setLoading(true); // Iniciamos el indicador de carga

    try {
      let userRecovery = form;

      const request = await fetch(Global.url + "recovery/newpass", {
        method: "POST",
        body: JSON.stringify(userRecovery),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await request.json();

      if (data.status === "success") {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'En caso de existir cuenta se enviará correo con clave provisional',
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirigir a la página de login
            navigate('/login');
          }
        });

      } else {
        // Mostramos un mensaje de error si la solicitud no fue exitosa
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Existe un error, intenta más tarde',
        });
      }
    } catch (error) {
      console.error("Error:", error);
      // Manejo de errores
    } finally {
      setLoading(false); // Desactivamos el indicador de carga después de la solicitud
    }
  };


  return (
    <>
      <section className="min-vh-100 mb-8">
        <div className="page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg">
          <span className="mask bg-gradient-dark opacity-6"></span>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-5 text-center mx-auto">
                <h1 className="text-white mb-2 mt-5">Bienvenido!</h1>
                <p className="text-lead text-white">Recupera tu cuenta</p>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row mt-lg-n10 mt-md-n11 mt-n10">
            <div className="col-xl-4 col-lg-5 col-md-7 mx-auto">
              <div className="card z-index-0">
                <div className="card-header text-center pt-4">
                  <h5>Recuperar Cuenta</h5>
                  <img src={userImage} alt="Imagen superior" className="img-fluid mb-3"/>
                </div>
                <div className="card-body">
                  <form role="form text-left" onSubmit={recoverUser}>
                    <div className="mb-3">
                      <label htmlFor='email'>Email</label>
                      <input type="email" className="form-control" name="email" placeholder="Email" aria-label="Email" aria-describedby="email-addon" onChange={changed}></input>
                    </div>
                    {loading ? (
                      <Spiner></Spiner>
                    ) : (  
                    <div className="text-center">
                        <button type="submit" className="btn bg-gradient-dark w-100 my-4 mb-2">Recuperar</button>
                      </div>
                    )}
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
