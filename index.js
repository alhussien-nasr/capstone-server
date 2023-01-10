require("dotenv").config();

const stripe = require("stripe")(process.env.SRTIPE_SECRET_KEY);
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("api is working");
});
app.get("/payment-sheet", (req, res) => {
  res.send("payment-sheet is working");
});

app.post("/", async (req, res) => {
  try {
    const customer = await stripe.customers.create();
    const { amount } = req.body;
    console.log(amount, "amount");

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2022-11-15" }
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey:
        "pk_test_51MLRwsK1laAoewbCONkr7O5BKnKN6KEQj0skaAmCI7xcGN0jI8IONf90NmDSseBAsFQXIiGdu6Y0yclUokXIwnXl00VgvowXsq",
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, (req, res) => {
  console.log("server is working");
});
