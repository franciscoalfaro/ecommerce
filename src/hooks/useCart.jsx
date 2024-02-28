import { useState } from 'react';

export const useCart = () => {
  const [cart, setCart] = useState({
    products: [],
    shippingAddress: '',
  });

  console.log(cart)

  const addToCart = (product) => {
    console.log('aca al agregar')
    setCart((prevCart) => {
      // Verificar si el producto ya está en el carrito
      const existingProductIndex = prevCart.products.findIndex(
        (item) => item.product === product.product
      );

      if (existingProductIndex !== -1) {
        // Si el producto ya está en el carrito, incrementar la cantidad
        const updatedProducts = [...prevCart.products];
        updatedProducts[existingProductIndex].quantity += product.quantity;

        return {
          ...prevCart,
          products: updatedProducts,
        };
      } else {
        // Si el producto no está en el carrito, agregarlo
        return {
          ...prevCart,
          products: [...prevCart.products, product],
        };
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => ({
      ...prevCart,
      products: prevCart.products.filter((item) => item.product !== productId),
    }));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart((prevCart) => ({
      ...prevCart,
      products: prevCart.products.map((item) =>
        item.product === productId ? { ...item, quantity: newQuantity } : item
      ),
    }));
  };

  const updateShippingAddress = (address) => {
    setCart((prevCart) => ({
      ...prevCart,
      shippingAddress: address,
    }));
  };

  return { cart, addToCart, removeFromCart, updateQuantity, updateShippingAddress };
};
