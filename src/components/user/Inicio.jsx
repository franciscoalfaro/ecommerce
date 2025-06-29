import React from 'react'
import { FeaturedProducts } from '../publication/FeaturedProducts'
import { BestSellers } from '../publication/BestSellers'
import { Link } from 'react-router-dom'

export const Inicio = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                            Bienvenido a 
                            <span className="block text-secondary-400">TuTienda</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto animate-fade-in">
                            Descubre productos increíbles con la mejor calidad y precios únicos. 
                            Tu experiencia de compra perfecta comienza aquí.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
                            <Link to="/products" className="btn-primary text-lg px-8 py-4">
                                <i className="bi bi-shop mr-2"></i>
                                Explorar productos
                            </Link>
                            <Link to="/offers" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-4 px-8 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center justify-center">
                                <i className="bi bi-percent mr-2"></i>
                                Ver ofertas
                            </Link>
                        </div>
                    </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full"></div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Por qué elegir TuTienda?</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Ofrecemos la mejor experiencia de compra online con beneficios únicos para nuestros clientes.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                                <i className="bi bi-truck text-white text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Envío Gratis</h3>
                            <p className="text-gray-600">Envío gratuito en todas tus compras sin monto mínimo.</p>
                        </div>
                        
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-r from-success-600 to-success-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                                <i className="bi bi-shield-check text-white text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Compra Segura</h3>
                            <p className="text-gray-600">Tus datos y pagos están 100% protegidos con nosotros.</p>
                        </div>
                        
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-r from-secondary-600 to-secondary-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                                <i className="bi bi-headset text-white text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Soporte 24/7</h3>
                            <p className="text-gray-600">Atención al cliente disponible las 24 horas del día.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Carousel Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ofertas Especiales</h2>
                        <p className="text-gray-600 text-lg">No te pierdas nuestras promociones exclusivas</p>
                    </div>
                    
                    <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                        <ol className="carousel-indicators">
                            <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                            <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                            <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                        </ol>
                        <div className="carousel-inner rounded-xl overflow-hidden shadow-large">
                            <div className="carousel-item active">
                                <img 
                                    src="https://images.falabella.com/v3/assets/blt7c5c2f2f888a7cc3/bltc8a23d9a8cdce812/65d36d4bce7e23433bda094b/01-Vitrina-DK-Computacion-190224-AC.jpg?disable=upscale&format=webp&quality=70&width=1920" 
                                    className="d-block w-100 h-96 object-cover" 
                                    alt="Oferta 1"
                                />
                                <div className="carousel-caption d-none d-md-block bg-black bg-opacity-50 rounded-lg p-4">
                                    <h5 className="text-2xl font-bold">Tecnología de última generación</h5>
                                    <p className="text-lg">Descubre los mejores productos tecnológicos con descuentos increíbles</p>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <img 
                                    src="https://images.falabella.com/v3/assets/blt7c5c2f2f888a7cc3/bltc8a23d9a8cdce812/65d36d4bce7e23433bda094b/01-Vitrina-DK-Computacion-190224-AC.jpg?disable=upscale&format=webp&quality=70&width=1920" 
                                    className="d-block w-100 h-96 object-cover" 
                                    alt="Oferta 2"
                                />
                                <div className="carousel-caption d-none d-md-block bg-black bg-opacity-50 rounded-lg p-4">
                                    <h5 className="text-2xl font-bold">Moda y estilo</h5>
                                    <p className="text-lg">Las últimas tendencias en moda al mejor precio</p>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <img 
                                    src="https://images.falabella.com/v3/assets/blt7c5c2f2f888a7cc3/bltc8a23d9a8cdce812/65d36d4bce7e23433bda094b/01-Vitrina-DK-Computacion-190224-AC.jpg?disable=upscale&format=webp&quality=70&width=1920" 
                                    className="d-block w-100 h-96 object-cover" 
                                    alt="Oferta 3"
                                />
                                <div className="carousel-caption d-none d-md-block bg-black bg-opacity-50 rounded-lg p-4">
                                    <h5 className="text-2xl font-bold">Hogar y decoración</h5>
                                    <p className="text-lg">Transforma tu hogar con nuestros productos exclusivos</p>
                                </div>
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
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
                        <p className="text-gray-600 text-lg">Descubre nuestros productos más populares y mejor valorados</p>
                    </div>
                    <FeaturedProducts />
                </div>
            </section>

            {/* Best Sellers */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Los Más Vendidos</h2>
                        <p className="text-gray-600 text-lg">Los productos favoritos de nuestros clientes</p>
                    </div>
                    <BestSellers />
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">¡Mantente al día!</h2>
                    <p className="text-xl text-gray-200 mb-8">
                        Suscríbete a nuestro newsletter y recibe ofertas exclusivas y novedades
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input 
                            type="email" 
                            placeholder="Tu email aquí..." 
                            className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-4 focus:ring-white focus:ring-opacity-50 focus:outline-none"
                        />
                        <button className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                            Suscribirse
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}