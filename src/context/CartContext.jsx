import React, { createContext, useState, useEffect } from 'react';
import { Global } from '../helpers/Global';
import useAuth from '../hooks/useAuth';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { auth } = useAuth();
  const [cart, setCart] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (savedCart.length > 0) {
      setCart(savedCart);
    }
  }, []);

  // Sincronizar carrito cuando el usuario se loguea
  useEffect(() => {
    if (auth && auth._id && cart.length > 0) {
      syncCartWithServer();
    } else if (auth && auth._id) {
      loadCartFromServer();
    }
  }, [auth]);

  // Actualizar total de items cuando cambia el carrito
  useEffect(() => {
    const newTotalItems = cart.reduce((total, item) => total + item.quantity, 0);
    setTotalItems(newTotalItems);
    
    // Guardar en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Sincronizar carrito local con el servidor cuando el usuario se loguea
  const syncCartWithServer = async () => {
    if (!auth || !auth._id || cart.length === 0) return;

    setIsLoading(true);
    try {
      const cartData = {
        items: cart.map(item => ({
          size: item.size,
          product: item._id,
          quantity: item.quantity,
          priceunitary: item.offerprice && parseFloat(item.offerprice) > 0 ? item.offerprice : item.price
        }))
      };

      const request = await fetch(Global.url + 'cart/sync', {
        method: 'POST',
        body: JSON.stringify(cartData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
      });

      const data = await request.json();
      
      if (data.status === 'success') {
        console.log('Carrito sincronizado con el servidor');
        // Opcional: cargar el carrito actualizado desde el servidor
        await loadCartFromServer();
      } else {
        console.error('Error al sincronizar carrito:', data.message);
      }
    } catch (error) {
      console.error('Error al sincronizar carrito:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar carrito desde el servidor
  const loadCartFromServer = async () => {
    if (!auth || !auth._id) return;

    setIsLoading(true);
    try {
      const request = await fetch(Global.url + 'cart/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
      });

      const data = await request.json();

      if (data.status === 'success' && data.cart && data.cart.items) {
        const serverCart = data.cart.items.map(item => ({
          ...item.product,
          quantity: item.quantity,
          size: item.size,
          priceunitary: item.priceunitary
        }));
        
        setCart(serverCart);
        localStorage.setItem('cart', JSON.stringify(serverCart));
      }
    } catch (error) {
      console.error('Error al cargar carrito desde servidor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Agregar producto al carrito
  const addToCart = async (product) => {
    try {
      const existingItemIndex = cart.findIndex((item) => item._id === product._id);
      let updatedCart;

      if (existingItemIndex !== -1) {
        // Si el producto ya existe, incrementar cantidad
        updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += 1;
        setCart(updatedCart);
        
        if (window.Swal) {
          Swal.fire({ 
            position: "bottom-end", 
            title: "Cantidad actualizada en el carrito", 
            showConfirmButton: false, 
            timer: 1000,
            toast: true,
            icon: 'success'
          });
        }
      } else {
        // Si es un producto nuevo, agregarlo
        const cartItem = {
          ...product,
          quantity: 1,
          size: product.size || 'Talla única'
        };
        updatedCart = [...cart, cartItem];
        setCart(updatedCart);
        
        if (window.Swal) {
          Swal.fire({ 
            position: "bottom-end", 
            title: "Producto agregado al carrito", 
            showConfirmButton: false, 
            timer: 1000,
            toast: true,
            icon: 'success'
          });
        }
      }

      // Si el usuario está logueado, sincronizar con el servidor
      if (auth && auth._id) {
        await updateCartOnServer(updatedCart);
      }

    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      if (window.Swal) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo agregar el producto al carrito',
          toast: true,
          position: 'bottom-end',
          timer: 2000,
          showConfirmButton: false
        });
      }
    }
  };

  // Actualizar carrito en el servidor
  const updateCartOnServer = async (cartItems) => {
    if (!auth || !auth._id) return;

    try {
      const cartData = {
        items: cartItems.map(item => ({
          size: item.size,
          product: item._id,
          quantity: item.quantity,
          priceunitary: item.offerprice && parseFloat(item.offerprice) > 0 ? item.offerprice : item.price
        }))
      };

      const request = await fetch(Global.url + 'cart/update', {
        method: 'PUT',
        body: JSON.stringify(cartData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
      });

      const data = await request.json();
      
      if (data.status !== 'success') {
        console.error('Error al actualizar carrito en servidor:', data.message);
      }
    } catch (error) {
      console.error('Error al actualizar carrito en servidor:', error);
    }
  };

  // Remover producto del carrito
  const removeFromCart = async (productId) => {
    try {
      const updatedCart = cart.filter((item) => item._id !== productId);
      setCart(updatedCart);

      // Si el usuario está logueado, actualizar en el servidor
      if (auth && auth._id) {
        await updateCartOnServer(updatedCart);
      }

      if (window.Swal) {
        Swal.fire({ 
          position: "bottom-end", 
          title: "Producto eliminado del carrito", 
          showConfirmButton: false, 
          timer: 1000,
          toast: true,
          icon: 'info'
        });
      }
    } catch (error) {
      console.error('Error al remover producto del carrito:', error);
    }
  };

  // Actualizar cantidad de producto
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      const updatedCart = cart.map((item) =>
        item._id === productId ? { ...item, quantity: parseInt(newQuantity) } : item
      );
      setCart(updatedCart);

      // Si el usuario está logueado, actualizar en el servidor
      if (auth && auth._id) {
        await updateCartOnServer(updatedCart);
      }
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
    }
  };

  // Limpiar carrito
  const clearCart = async () => {
    try {
      setCart([]);
      localStorage.removeItem('cart');

      // Si el usuario está logueado, limpiar en el servidor
      if (auth && auth._id) {
        await fetch(Global.url + 'cart/clear', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
          },
        });
      }
    } catch (error) {
      console.error('Error al limpiar carrito:', error);
    }
  };

  // Calcular precio total
  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = item.offerprice && parseFloat(item.offerprice) > 0 
        ? parseFloat(item.offerprice) 
        : parseFloat(item.price);
      return total + (item.quantity * price);
    }, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      totalItems, 
      getTotalPrice,
      isLoading,
      syncCartWithServer,
      loadCartFromServer
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;