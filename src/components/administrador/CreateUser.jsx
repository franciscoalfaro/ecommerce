import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';

export const CreateUser = () => {
    const { form, changed } = useForm({})
    const [usuario, setUsuario] = useState([])
    const [emailMatch, setEmailMatch] = useState(true);

    function validar (){
        if (form.email !== form.confirmEmail) {
            setEmailMatch(false);
            return;
        }

    }

    const crearUsuario = async (e) => {
        e.preventDefault();
        try {

            //variable para almacenar datos del formulario
            let newUser = form


            //guardar datos en backend

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
                setUsuario(data)
                Swal.fire({ position: "bottom-end", title: 'Usuario creado correctamente', showConfirmButton: false, timer: 1500 });

            } if (data.status == "warning") {
                Swal.fire({ position: "bottom-end", icon: 'warning', title: 'usuario ya existe verifique el correo', showConfirmButton: false, timer: 1500 })

            } if (data.status == "error") {
                Swal.fire({ position: "bottom-end", icon: 'error', title: data.message, showConfirmButton: false, timer: 1500 })
            }

        } catch (error) {
            Swal.fire({ position: "bottom-end", icon: 'error', title: error, showConfirmButton: false, timer: 1500 })
        }



    }


    return (
        <div className="container mt-5">
            <h2>Crear Nuevo Usuario</h2>
            <form onSubmit={crearUsuario}>
                <div className="mb-3">
                    <label htmlFor="inputName" className="form-label">Nombre</label>
                    <input type="text" name='name' className={`form-control ${!form.name && 'is-invalid'}`} id="inputName" placeholder="Nombre" onChange={changed}></input>

                </div>
                <div className="mb-3">
                    <label htmlFor="inputSurname" className="form-label">Apellido</label>
                    <input type="text" name='surname' className={`form-control ${!form.surname && 'is-invalid'}`} id="inputSurname" placeholder="Apellido" onChange={changed}></input>
                </div>
                <div className="mb-3">
                    <label htmlFor="inputEmail" className="form-label">email</label>
                    <input type="email" name='email' className={`form-control ${(!form.email || !emailMatch) && 'is-invalid'}`} id="inputEmail" placeholder="Correo Electrónico" onKeyDown={validar} onChange={changed}></input>
                </div>

                <div className="mb-3">
                    <label htmlFor="inputEmail" className="form-label">confirma e-mail</label>
                    <input type="email" name='confirmEmail' className={`form-control ${(!form.confirmEmail || !emailMatch) && 'is-invalid'}`} id="inputConfirmEmail" placeholder="Confirmar Correo Electrónico" onKeyDown={validar}  onChange={changed}></input>
                    {!emailMatch && <div className="invalid-feedback">Los correos electrónicos no coinciden</div>}
                
                </div>

                <div className="mb-3">
                    <label htmlFor="role" className="form-label">Tipo de usuario</label>
                    <select className="form-select" id="nuevoEstado" name='role' onChange={changed}>
                        <option value='Seleccione una opcion'>Seleccione una opcion</option>
                        <option value='admin'>administrador</option>
                        <option value='root'>super usuario</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Crear Usuario</button>
            </form>
        </div>
    );
};
