import React, { useState, useEffect } from 'react';
import ProductsList from './components/ProductsList';
import Cart from './components/Cart';
import CheckoutForm from './components/CheckoutForm';
import './App.css';
function App() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [pickupPoints, setPickupPoints] = useState([]);
  useEffect(() => {
    const fetchPickupPoints = async () => {
      if (selectedCity) {
        const response = await fetch(
          `https://api.novaposhta.ua/v2.0/json/AddressGeneral/getWarehouses?apiKey=${API_KEY}&Language=ru&CityRef=${selectedCity}`
        );
        const data = await response.json();
        setPickupPoints(data.data);
      }
    };
    fetchPickupPoints();
  }, [selectedCity]);
  const addToCart = (product) => {
    const existingProduct = cartItems.find((item) => item.id === product.id);
    if (existingProduct) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...existingProduct, quantity: existingProduct.quantity + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (product) => {
    const existingProduct = cartItems.find((item) => item.id === product.id);
    if (existingProduct.quantity === 1) {
      setCartItems(cartItems.filter((item) => item.id !== product.id));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...existingProduct, quantity: existingProduct.quantity - 1 } : item
        )
      );
    }
  };
  const checkout = (values) => {
    const order = {
      customer: {
        name: values.name,
        email: values.email,
        phone: values.phone,
      },
      items: cartItems,
      pickupPoint: values.pickupPoint,
    };
    console.log(order); // send order data to server or do something else with it
    setCartItems([]);
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Магазин</h1>
      </header>
      <main>
        <ProductsList products={products} onAddToCart={addToCart} />
        <Cart cartItems={cartItems} onRemoveFromCart={removeFromCart} />
        <CheckoutForm pickupPoints={pickupPoints} onSubmit={checkout} onCityChange={setSelectedCity} />
      </main>
    </div>
  );
