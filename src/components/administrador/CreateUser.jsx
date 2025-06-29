import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';
import { Spiner } from '../../hooks/Spiner';

export const CreateUser = () => {
    const { form, changed } = useForm({})
    const [usuario, setUsuario] = useState([])
    const [emailMatch, setEmailMatch] = useState(true);
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
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

    function validar() {
        if (form.email !== form.confirmEmail) {
            setEmailMatch(false);
        } else {
            setEmailMatch(true);
        }
    }

    const crearUsuario = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            if (form.email !== form.confirmEmail) {
                console.log('correos no coinciden')
                if (window.Swal) {
                    Swal.fire({ 
                        position: "bottom-end", 
                        title: 'Los correos no coinciden', 
                        showConfirmButton: false, 
                        timer: 1500,
                        icon: 'warning'
                    });
                }
                return;
            }

            let newUser = form

            const request = await fetch(Global.url + "user/createuser", {
                method: "POST",
                body: JSON.stringify(newUser),
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': localStorage.getItem('token')
                }
            })
            const data = await request.json()

            if (data.status == "success") {
                const myForm = document.querySelector("#createUser");
                myForm.reset();

                setUsuario(data)
                if (window.Swal) {
                    Swal.fire({ 
                        position: "bottom-end", 
                        title: 'Usuario creado correctamente', 
                        showConfirmButton: false, 
                        timer: 1500,
                        icon: 'success'
                    });
                }
            } 
            if (data.status == "warning") {
                if (window.Swal) {
                    Swal.fire({ 
                        position: "bottom-end", 
                        icon: 'warning', 
                        title: 'Usuario ya existe, verifique el correo', 
                        showConfirmButton: false, 
                        timer: 1500 
                    })
                }
            } 
            if (data.status == "error") {
                if (window.Swal) {
                    Swal.fire({ 
                        position: "bottom-end", 
                        icon: 'error', 
                        title: data.message, 
                        showConfirmButton: false, 
                        timer: 1500 
                    })
                }
            }

        } catch (error) {
            if (window.Swal) {
                Swal.fire({ 
                    position: "bottom-end", 
                    icon: 'error', 
                    title: error, 
                    showConfirmButton: false, 
                    timer: 1500 
                })
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Nuevo Usuario</h1>
                    <p className="text-gray-600">Agrega un nuevo usuario administrador al sistema</p>
                </div>

                {/* Form */}
                <div className="card">
                    <div className="card-body">
                        <form id='createUser' onSubmit={crearUsuario} className="space-y-6">
                            {/* Personal Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre *
                                    </label>
                                    <input 
                                        type="text" 
                                        name='name' 
                                        id="name" 
                                        required
                                        className={`input-field ${!form.name && 'border-danger-300'}`}
                                        placeholder="Nombre del usuario"
                                        onChange={changed}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-2">
                                        Apellido *
                                    </label>
                                    <input 
                                        type="text" 
                                        name='surname' 
                                        id="surname" 
                                        required
                                        className={`input-field ${!form.surname && 'border-danger-300'}`}
                                        placeholder="Apellido del usuario"
                                        onChange={changed}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Correo electrónico *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="bi bi-envelope text-gray-400"></i>
                                    </div>
                                    <input 
                                        type="email" 
                                        name='email' 
                                        id="email" 
                                        required
                                        className={`input-field pl-10 ${(!form.email || !emailMatch) ? 'border-danger-300' : emailMatch ? 'border-success-300' : ''}`}
                                        placeholder="usuario@email.com"
                                        onBlur={validar} 
                                        onChange={changed}
                                    />
                                </div>
                            </div>

                            {/* Confirm Email */}
                            <div>
                                <label htmlFor="confirmEmail" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirmar correo electrónico *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="bi bi-envelope-check text-gray-400"></i>
                                    </div>
                                    <input 
                                        type="email" 
                                        name='confirmEmail' 
                                        id="confirmEmail" 
                                        required
                                        className={`input-field pl-10 ${(!form.confirmEmail || !emailMatch) && 'border-danger-300'}`}
                                        placeholder="Confirmar correo electrónico"
                                        onBlur={validar} 
                                        onChange={changed}
                                    />
                                </div>
                                {!emailMatch && (
                                    <p className="mt-2 text-sm text-danger-600">
                                        <i className="bi bi-exclamation-circle mr-1"></i>
                                        Los correos electrónicos no coinciden
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña temporal *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="bi bi-lock text-gray-400"></i>
                                    </div>
                                    <input 
                                        type="password" 
                                        name='password' 
                                        id="password" 
                                        required
                                        className="input-field pl-10"
                                        placeholder="••••••••"
                                        onChange={(e) => {
                                            changed(e);
                                            setPasswordStrength(checkPasswordStrength(e.target.value));
                                        }}
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
                                        <p className="text-xs text-gray-500 mt-1">
                                            El usuario deberá cambiar esta contraseña en su primer inicio de sesión
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Role */}
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de usuario *
                                </label>
                                <select 
                                    name='role' 
                                    id="role" 
                                    required
                                    className="input-field"
                                    onChange={changed}
                                >
                                    <option value=''>Seleccione un tipo de usuario</option>
                                    <option value='admin'>Administrador</option>
                                    <option value='root'>Super Usuario</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    <strong>Administrador:</strong> Puede gestionar productos y pedidos<br/>
                                    <strong>Super Usuario:</strong> Acceso completo al sistema
                                </p>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-6 border-t border-gray-200">
                                {loading ? (
                                    <div className="flex items-center space-x-2">
                                        <Spiner />
                                        <span className="text-gray-600">Creando usuario...</span>
                                    </div>
                                ) : (
                                    <button type="submit" className="btn-primary">
                                        <i className="bi bi-person-plus mr-2"></i>
                                        Crear Usuario
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Info Card */}
                <div className="card mt-6">
                    <div className="card-body">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                                    <i className="bi bi-info-circle text-primary-600"></i>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-1">Información importante</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• El usuario recibirá un correo con sus credenciales de acceso</li>
                                    <li>• Deberá cambiar la contraseña en su primer inicio de sesión</li>
                                    <li>• Los usuarios administradores pueden gestionar productos y pedidos</li>
                                    <li>• Los super usuarios tienen acceso completo al sistema</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};