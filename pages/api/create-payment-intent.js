import Cookie from "js-cookie";

// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (total) => {
  
  total = parseInt(Math.round(total * 100))
  return total;
};

export default async function handler(req, res) {
  const { items } = req.body;
  const total = parseInt(Cookie.get("total"));
  console.log(total);

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    // Se toma el valor de total como NAN
    amount: calculateOrderAmount(total),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};