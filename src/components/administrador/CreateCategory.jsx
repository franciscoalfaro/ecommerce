import React, { useEffect } from 'react'

export const CreateCategory = () => {

 

    console.log('categoria creada')

    useEffect(()=>{

    },[])


    return (
        <>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel" >Crear Categoria</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-6">
                                <label htmlFor="nombreCategoria" className="form-label">Nombre de la Categoría</label>
                                <input type="text" className="form-control" id="nombreCategoria" required placeholder="Ingrese el nombre de la categoría"></input>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                        <button type="submit" className="btn btn-primary">Crear Categoría</button>
                    </div>
                </div>
            </div>
        </>
    )
}
