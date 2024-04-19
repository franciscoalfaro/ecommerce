import React from 'react';

export const CreateUser = () => {


    return (
        <div className="container mt-5">
            <h2>Crear Nuevo Usuario</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="inputName" className="form-label">Nombre</label>
                    <input type="text" className="form-control" id="inputName" placeholder="Nombre"></input>
                </div>
                <div className="mb-3">
                    <label htmlFor="inputEmail" className="form-label">email</label>
                    <input type="email" className="form-control" id="inputEmail" placeholder="Correo Electrónico"></input>
                </div>

                <div className="mb-3">
                    <label htmlFor="inputEmail" className="form-label">confirma e-mail</label>
                    <input type="email" className="form-control" id="inputEmail" placeholder="Correo Electrónico"></input>
                </div>

                <div className="mb-3">
                    <label htmlFor="users" className="form-label">Tipo de usuario</label>
                    <select className="form-select" id="nuevoEstado" name='users'>
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
