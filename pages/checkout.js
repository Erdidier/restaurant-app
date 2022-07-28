/* pages/checkout.js */

import React, { useContext, useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/checkoutForm";
import AppContext from "../components/context";
import Cart from "../components/cart";
import Cookie from "js-cookie";

// load stripe to inject into elements components
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function Checkout() {
  // get app context
  // const {isAuthenticated} = useContext(AppContext);
  // isAuthenticated is passed to the cart component to display order button
  const isAuthenticated  = true;

  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads

    // Al consultar la dirección, no se resuelve la petición al levantar un error de stripe por ingresar un valor no numérico
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: "dishes" }] }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Row>
      {clientSecret && (<Col style={{ paddingRight: 0 }} sm={{ size: 3, order: 1, offset: 2 }}>
        <h1 style={{ margin: 20 }}>Checkout</h1>
        <Cart isAuthenticated={isAuthenticated} />
      </Col>)}
      {clientSecret && (<Col style={{ paddingLeft: 5 }} sm={{ size: 6, order: 2 }}>
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </Col>)}
    </Row>
  );
  // }
}
export default Checkout;