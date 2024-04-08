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
                    <label htmlFor="inputEmail" className="form-label">Correo Electrónico</label>
                    <input type="email" className="form-control" id="inputEmail" placeholder="Correo Electrónico"></input>
                </div>
                <div className="mb-3">
                    <label htmlFor="inputPassword" className="form-label">Contraseña</label>
                    <input type="password" className="form-control" id="inputPassword" placeholder="Contraseña"></input>
                </div>
                <div className="mb-3">
                    <label htmlFor="inputConfirmPassword" className="form-label">Confirmar Contraseña</label>
                    <input type="password" className="form-control" id="inputConfirmPassword" placeholder="Confirmar Contraseña"></input>
                </div>
                <button type="submit" className="btn btn-primary">Crear Usuario</button>
            </form>
        </div>
    );
};
