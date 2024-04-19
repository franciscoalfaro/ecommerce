import React, { createContext, useState, useEffect } from 'react';


const CartContext = createContext();


export const CartProvider = ({ children }) => {
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
  const addToCart = (product) => {
    const existingItemIndex = cart.findIndex((item) => item._id === product._id);

    //si carrito hago el al list carrito si no lo creo

    //hacer la consulta bk para comprobar por si por medio de mi ID existe el carrito si existe agrego los elementos que estan en el lst

    //list carrito

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
      Swal.fire({ position: "bottom-end", title: "producto actualizado en el carro",showConfirmButton: false,timer: 400});
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      Swal.fire({ position: "bottom-end", title: "producto agregado al carro",showConfirmButton: false,timer: 400});
    }
    localStorage.setItem('cart', JSON.stringify(cart));

  };





  //funcion para remover los productos 
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