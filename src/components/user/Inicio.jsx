import React from 'react'
import { FeaturedProducts } from './FeaturedProducts'
import { BestSellers } from './BestSellers'

export const Inicio = () => {
    return (
        <main>

            <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                <ol className="carousel-indicators">
                    <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                </ol>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="https://images.falabella.com/v3/assets/blt7c5c2f2f888a7cc3/bltc8a23d9a8cdce812/65d36d4bce7e23433bda094b/01-Vitrina-DK-Computacion-190224-AC.jpg?disable=upscale&format=webp&quality=70&width=1920" className="d-block w-100" alt="Imagen 1"></img>
                    </div>
                    <div className="carousel-item">
                        <img src="https://images.falabella.com/v3/assets/blt7c5c2f2f888a7cc3/bltc8a23d9a8cdce812/65d36d4bce7e23433bda094b/01-Vitrina-DK-Computacion-190224-AC.jpg?disable=upscale&format=webp&quality=70&width=1920" className="d-block w-100" alt="Imagen 2"></img>
                    </div>
                    <div className="carousel-item">
                        <img src="https://images.falabella.com/v3/assets/blt7c5c2f2f888a7cc3/bltc8a23d9a8cdce812/65d36d4bce7e23433bda094b/01-Vitrina-DK-Computacion-190224-AC.jpg?disable=upscale&format=webp&quality=70&width=1920" className="d-block w-100" alt="Imagen 3"></img>
                    </div>
                </div>
                <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Anterior</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Siguiente</span>
                </a>
            </div>


            <FeaturedProducts></FeaturedProducts>

            <BestSellers></BestSellers>


        </main>
    )
}
