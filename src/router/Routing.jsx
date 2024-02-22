import React from 'react'
import { Products } from '../components/user/Products'
import { Login } from '../components/user/Login'
import { Register } from '../components/user/Register'
import { Recovery } from '../components/user/Recovery'
import { Dashboard } from '../components/user/Dashboard'
import { Cart } from '../components/user/Cart'
import { Orders } from '../components/user/Orders'
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../context/AuthProvider'
import { PublicLayout } from '../components/layout/public/PublicLayout'
import { TerminoyCondiciones } from '../components/layout/public/TerminoyCondiciones'
import { PrivateLayout } from '../components/layout/private/PrivateLayout'
import { Logout } from '../components/user/Logout'
import { Profile } from '../components/user/Profile'
import { Checkout } from '../components/user/Checkout'
import { Categorys } from '../components/user/Categorys'
import { FeaturedProducts } from '../components/user/FeaturedProducts'
import { Search } from '../components/user/Search'
import { Inicio } from '../components/user/Inicio'
import { Offers } from '../components/user/Offers'

export const Routing = () => {
    return (

        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path='/' element={<PublicLayout></PublicLayout>}>
                        <Route index element={<Inicio></Inicio>}></Route>
                        <Route path='login' element={<Login></Login>}></Route>
                        <Route path='registro' element={<Register></Register>}></Route>
                        <Route path='recuperar' element={<Recovery></Recovery>}></Route>

                        <Route path='products' element={<Products></Products>}></Route>
                        <Route path='categorys/:id/' element={<Categorys></Categorys>}></Route>
                        <Route path='checkout' element={<Checkout></Checkout>}></Route>
                        <Route path='cart' element={<Cart></Cart>}></Route>
                        <Route path='terminoycondiciones' element={<TerminoyCondiciones></TerminoyCondiciones>}></Route>
                        <Route path='standout' element={<FeaturedProducts></FeaturedProducts>}></Route>
                        <Route path='offers' element={<Offers></Offers>}></Route>
                        <Route path='search/:product' element={<Search></Search>}></Route>
                    </Route>

                    <Route path='/auth' element={<PrivateLayout></PrivateLayout>}>
                        <Route index element={<Inicio></Inicio>}></Route>
                        <Route path='dashboard' element={<Dashboard></Dashboard>}></Route>
                        <Route path='cart' element={<Cart></Cart>}></Route>
                        <Route path='checkout' element={<Checkout></Checkout>}></Route>
                        <Route path='order' element={<Orders></Orders>}></Route>
                        <Route path='logout' element={<Logout></Logout>}></Route>
                        <Route path='perfil' element={<Profile></Profile>}></Route>

                        <Route path='products' element={<Products></Products>}></Route>
                        <Route path='categorys/:id/' element={<Categorys></Categorys>}></Route>
                        <Route path='standout' element={<FeaturedProducts></FeaturedProducts>}></Route>
                        <Route path='search/:product' element={<Search></Search>}></Route>
                        <Route path='offers' element={<Offers></Offers>}></Route>

                    </Route>

                    <Route path='*' element={<><h1><p>Error 404 <Link to="/">Volver Al inicio</Link></p></h1></>}></Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>


    )
}
