import React, { useEffect } from 'react'
import { Header } from './Header'
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { Footer } from './Footer';

export const PublicLayout = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [auth, navigate]);
  return (
    <>

        <Header></Header>
        {auth && auth._id ? <Navigate to="/auth"></Navigate> : <Outlet></Outlet>}

        <Footer></Footer>

       

    </>
  )
}
