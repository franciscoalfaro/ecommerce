import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm';
import { NavLink, useNavigate } from 'react-router-dom';
import { Global } from '../../helpers/Global'
import { Spiner } from '../../hooks/Spiner';

export const Recovery = () => {
  const { form, changed } = useForm({});
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate()

  const recoverUser = async (e) => {
    e.preventDefault();
    setLoading(true);

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
        setEmailSent(true);
        if (window.Swal) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Correo enviado',
            text: 'Si existe una cuenta con ese email, recibirás un correo con una clave provisional',
            showConfirmButton: true,
            confirmButtonText: 'Ir a Login'
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/login');
            }
          });
        }
      } else {
        if (window.Swal) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al procesar tu solicitud. Intenta más tarde.',
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      if (window.Swal) {
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-secondary-600 to-secondary-700 rounded-2xl flex items-center justify-center shadow-large">
              <i className="bi bi-key text-white text-2xl"></i>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Recuperar contraseña
          </h2>
          <p className="mt-2 text-gray-600">
            Ingresa tu correo electrónico y te enviaremos una contraseña temporal
          </p>
        </div>

        {!emailSent ? (
          <>
            {/* Form */}
            <div className="card">
              <div className="card-body">
                <form onSubmit={recoverUser} className="space-y-6">
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
                    <p className="mt-2 text-xs text-gray-500">
                      Te enviaremos un correo con una contraseña temporal si existe una cuenta con este email
                    </p>
                  </div>

                  <div>
                    {loading ? (
                      <div className="w-full flex justify-center py-3">
                        <div className="loading-spinner"></div>
                      </div>
                    ) : (
                      <button type="submit" className="btn-primary w-full justify-center">
                        <i className="bi bi-send mr-2"></i>
                        Enviar contraseña temporal
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Security Info */}
            <div className="card">
              <div className="card-body">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                      <i className="bi bi-shield-check text-success-600"></i>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Proceso seguro</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Solo enviaremos el correo si la cuenta existe</li>
                      <li>• La contraseña temporal expira en 24 horas</li>
                      <li>• Deberás cambiarla en tu primer inicio de sesión</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="card">
            <div className="card-body text-center">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-check-circle text-success-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¡Correo enviado!
              </h3>
              <p className="text-gray-600 mb-6">
                Si existe una cuenta con ese correo, recibirás un email con una contraseña temporal en los próximos minutos.
              </p>
              <div className="space-y-3">
                <NavLink to="/login" className="btn-primary w-full justify-center">
                  <i className="bi bi-box-arrow-in-right mr-2"></i>
                  Ir a iniciar sesión
                </NavLink>
                <button 
                  onClick={() => setEmailSent(false)}
                  className="btn-secondary w-full justify-center"
                >
                  <i className="bi bi-arrow-left mr-2"></i>
                  Intentar con otro correo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Links */}
        <div className="text-center space-y-2">
          <p className="text-gray-600">
            ¿Recordaste tu contraseña?{' '}
            <NavLink
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
            >
              Iniciar sesión
            </NavLink>
          </p>
          <p className="text-gray-600">
            ¿No tienes cuenta?{' '}
            <NavLink
              to="/registro"
              className="font-medium text-secondary-600 hover:text-secondary-500 transition-colors duration-200"
            >
              Crear cuenta nueva
            </NavLink>
          </p>
        </div>

        {/* Help Section */}
        <div className="card">
          <div className="card-body">
            <div className="text-center">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                <i className="bi bi-question-circle mr-2"></i>
                ¿Necesitas ayuda?
              </h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <i className="bi bi-envelope text-primary-600"></i>
                  <span>soporte@tutienda.com</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <i className="bi bi-whatsapp text-success-600"></i>
                  <span>+56 9 8220 2241</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <i className="bi bi-clock text-secondary-600"></i>
                  <span>Lun - Vie: 9:00 - 18:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}