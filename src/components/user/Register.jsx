import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';

export const Register = () => {
  const { form, changed } = useForm({})
  const [saved, setSaved] = useState('not_sended')
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  }

  const handlePasswordChange = (e) => {
    changed(e);
    const strength = checkPasswordStrength(e.target.value);
    setPasswordStrength(strength);
  }

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-danger-500';
    if (passwordStrength <= 3) return 'bg-secondary-500';
    return 'bg-success-500';
  }

  const getStrengthText = () => {
    if (passwordStrength <= 2) return 'Débil';
    if (passwordStrength <= 3) return 'Media';
    return 'Fuerte';
  }

  const saveUser = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let newUser = form

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
        if (window.Swal) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Usuario Registrado Correctamente',
            showConfirmButton: false,
            timer: 1100
          });
        }
        setTimeout(() => { window.location.href = "/login" }, 1200);
      } else if (data.status == "warning") {
        if (window.Swal) {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Usuario ya existe, intenta con otro'
          })
        }
      } else {
        setSaved("error")
      }
    } catch (error) {
      console.error('Error:', error);
      setSaved("error")
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
              <i className="bi bi-person-plus text-white text-2xl"></i>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Crear cuenta nueva
          </h2>
          <p className="mt-2 text-gray-600">
            Únete a nuestra comunidad y disfruta de beneficios exclusivos
          </p>
        </div>

        {/* Form */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={saveUser} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="input-field"
                    placeholder="Juan"
                    onChange={changed}
                  />
                </div>
                <div>
                  <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="surname"
                    id="surname"
                    required
                    className="input-field"
                    placeholder="Pérez"
                    onChange={changed}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="nick" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="bi bi-at text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    name="nick"
                    id="nick"
                    required
                    className="input-field pl-10"
                    placeholder="juanperez"
                    onChange={changed}
                  />
                </div>
              </div>

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
                    placeholder="juan@email.com"
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
                    onChange={handlePasswordChange}
                  />
                </div>
                
                {/* Password Strength Indicator */}
                {form.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{getStrengthText()}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="confirm"
                    name="confirm"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    onChange={changed}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="confirm" className="text-gray-700">
                    Acepto los{' '}
                    <NavLink
                      to="/terminoycondiciones"
                      className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
                    >
                      Términos y Condiciones
                    </NavLink>
                    {' '}y la Política de Privacidad
                  </label>
                </div>
              </div>

              <div>
                {isLoading ? (
                  <div className="w-full flex justify-center py-3">
                    <div className="loading-spinner"></div>
                  </div>
                ) : (
                  <button type="submit" className="btn-primary w-full justify-center">
                    <i className="bi bi-person-plus mr-2"></i>
                    Crear cuenta
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <NavLink
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
            >
              Inicia sesión aquí
            </NavLink>
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 gap-4 pt-8 border-t border-gray-200">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="bi bi-check text-primary-600"></i>
            </div>
            <span>Acceso a ofertas exclusivas</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="bi bi-truck text-success-600"></i>
            </div>
            <span>Envío gratis en tu primera compra</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="bi bi-star text-secondary-600"></i>
            </div>
            <span>Programa de puntos y recompensas</span>
          </div>
        </div>
      </div>
    </div>
  )
}