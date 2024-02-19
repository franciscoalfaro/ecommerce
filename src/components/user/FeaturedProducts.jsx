import React from 'react'

export const FeaturedProducts = () => {

    //llamado al end-point para listar los productos mas vendidos.

    //llamado al end-point para mostrar los productos en ofertas. 

    
    return (
        <>
            <section className="py-4 bg-light">
                <div className="container">
                    <h2>Productos Destacados</h2>
                    <div className="row">
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                            <div className="card">
                                <img src="assets/img/image1.jpg" className="card-img-top" alt="Producto 1"></img>
                                <div className="card-body">
                                    <h5 className="card-title">Producto 1</h5>
                                    <p className="card-text">$19.99</p>
                                    <button className="btn btn-primary"><i className="bi bi-cart-fill"></i> Agregar al carrito</button>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                            <div className="card">
                                <img src="assets/img/image1.jpg" className="card-img-top" alt="Producto 1"></img>
                                <div className="card-body">
                                    <h5 className="card-title">Producto 1</h5>
                                    <p className="card-text">$19.99</p>
                                    <button className="btn btn-primary"><i className="bi bi-cart-fill"></i> Agregar al carrito</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}
