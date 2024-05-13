import React, { createContext, useState, useEffect } from 'react';
import { Global } from '../helpers/Global';
import useAuth from '../hooks/useAuth';


const CartContext = createContext();


export const CartProvider = ({ children }) => {
  const { auth } = useAuth([])
  const [cart, setCart] = useState([]);
  const [totalItems, setTotalItems] = useState(0);



  useEffect(() => {
    const saveCart = JSON.parse(localStorage.getItem('cart'))
    if (saveCart) {
      setCart(saveCart)
    }

  }, [])


  useEffect(() => {
    const newTotalItems = cart.reduce((total, item) => total + item.quantity, 0);
    setTotalItems(newTotalItems);
  }, [cart]);




  //funcion para agregar los productos
  const addToCart = async (product) => {
    try {
      const existingItemIndex = cart.findIndex((item) => item._id === product._id);
      if (existingItemIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += 1;
        setCart(updatedCart);
        Swal.fire({ position: "bottom-end", title: "producto actualizado en el carro", showConfirmButton: false, timer: 400 });
      } else {
        // Crear el objeto que representa el producto en el carrito
        const cartItem = {
          ...product,
          quantity: 1,
          size: product.size // Agregar el tamaño del producto al objeto del carrito
        };
        const updatedCart = [...cart, cartItem]; // Actualizar el carrito local
        setCart(updatedCart);
        Swal.fire({ position: "bottom-end", title: "producto agregado al carro", showConfirmButton: false, timer: 400 });

        // Almacenar el carrito actualizado en el almacenamiento local
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        // Si el usuario está autenticado, enviar los datos del carrito actualizado al servidor
        if (auth && localStorage.getItem("token")) {
          const cartData = {
            items: updatedCart.map(item => ({
              size: item.size,
              product: item._id,
              quantity: item.quantity,
              priceunitary: item.offerprice && parseFloat(item.offerprice) > 0 ? item.offerprice : item.price
            }))
          };

          const request = await fetch(Global.url + 'cart/create', {
            method: 'POST',
            body: JSON.stringify(cartData),
            headers: {
              'Content-Type': 'application/json',
              "Authorization": localStorage.getItem("token")
            },
          });

          const data = await request.json();
          console.log('carrito creado', data);
          if (data.status === 'success') {

            // Limpiar el carrito localmente después de crearlo en el servidor
            setCart([]);
            localStorage.setItem('cart', JSON.stringify(updatedCart));

            // Manejar cualquier acción adicional después de agregar productos al carrito y enviarlos al servidor
          } else {
            console.error('Error al crear el carrito:', data.message);
          }
        }
      }
    } catch (error) {
      console.error('Error al agregar productos al carrito:', error);
    }
  };

  useEffect(() => {
    ListCart()
  })


  const ListCart = async () => {
    try {
      const request = await fetch(Global.url + 'cart/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": localStorage.getItem("token")
        },
      });
      const data = await request.json();

      data.cart.items.map((item) => {
        console.log('console', item);

      });

      if (data.status === 'success') {

        data.cart.items.map((item) => {

          localStorage.setItem('cart', JSON.stringify(item));
          setCart(item);
        });

      } else {
        setCart([]);
        // Manejar el caso en el que no se encuentre un carrito en el backend
      }
    } catch (error) {
      // Manejar cualquier error que ocurra durante la solicitud
    }
  }











  //funcion para remover los productos llamar al end-point para eliminar el producto del carrito
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);

  };

  //funcion para actualizar la cantidad de productos. 
  const updateQuantity = (productId, newQuantity) => {
    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.quantity * parseFloat(item.price), 0);
  };






  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};
export default CartContext