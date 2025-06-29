import React from 'react'
import { useForm } from '../../hooks/useForm'
import { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { Global } from '../../helpers/Global'
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export const Login = () => {
  const { form, changed } = useForm({})
  const [saved, setSaved] = useState('not_sended')
  const [isLoading, setIsLoading] = useState(false)
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  const loginUser = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
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
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setSaved("login");
        setAuth(data.user);

        if (window.Swal) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Login correcto',
            showConfirmButton: false,
            timer: 1150
          });
        }

        if(data.user.role === 'admin'){
          window.location.replace('/admin')
        } else {
          setTimeout(() => { window.location.reload() }, 1200);
        }
      } else if (data.status == "error_404") {
        setSaved("error_404");
        if (window.Swal) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Falta usuario o clave!',
          })
        }
      } else if (data.status == "Not Found") {
        setSaved("warning");
        if (window.Swal) {
          Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Usuario no registrado!',
          })
        }
      } else {
        setSaved("error");
        if (window.Swal) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'usuario o clave incorrecto!',
          })
        }
      }
    } catch (error) {
      console.error('Error:', error);
      if (window.Swal) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al iniciar sesión',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-large">
              <i className="bi bi-shop text-white text-2xl"></i>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Bienvenido de vuelta
          </h2>
          <p className="mt-2 text-gray-600">
            Inicia sesión en tu cuenta para continuar
          </p>
        </div>

        {/* Form */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={loginUser} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="bi bi-envelope text-gray-400"></i>
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="input-field pl-10"
                    placeholder="tu@email.com"
                    onChange={changed}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="bi bi-lock text-gray-400"></i>
                  </div>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    className="input-field pl-10"
                    placeholder="••••••••"
                    onChange={changed}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Recordarme
                  </label>
                </div>

                <div className="text-sm">
                  <NavLink
                    to="/recuperar"
                    className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
                  >
                    ¿Olvidaste tu contraseña?
                  </NavLink>
                </div>
              </div>

              <div>
                {isLoading ? (
                  <div className="w-full flex justify-center py-3">
                    <div className="loading-spinner"></div>
                  </div>
                ) : (
                  <button type="submit" className="btn-primary w-full justify-center">
                    <i className="bi bi-box-arrow-in-right mr-2"></i>
                    Iniciar sesión
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-600">
            ¿No tienes una cuenta?{' '}
            <NavLink
              to="/registro"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
            >
              Regístrate aquí
            </NavLink>
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <i className="bi bi-shield-check text-primary-600"></i>
            </div>
            <p className="text-xs text-gray-600">Seguro</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <i className="bi bi-lightning text-success-600"></i>
            </div>
            <p className="text-xs text-gray-600">Rápido</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <i className="bi bi-heart text-secondary-600"></i>
            </div>
            <p className="text-xs text-gray-600">Confiable</p>
          </div>
        </div>
      </div>
    </div>
  )
}