require("dotenv").config();

const stripe = require("stripe")(process.env.SRTIPE_SECRET_KEY);
const express = require("express");
const app = express();
// exports.handler = async (event) => {
//   try {
//     const { amount } = JSON.parse(event.body);

//     paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: "usd",
//       payment_method_types: ["card"],
//     });
//     return { status: 200, bodu: JSON.stringify({ paymentIntent }) };
//   } catch (error) {
//     console.log({ error });
//     return { status: 400, bodu: JSON.stringify({ error }) };
//   }
// };
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("api is working");
});
app.post("/payment-sheet", async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
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
    res.send("api working");
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, (req, res) => {
  console.log("server working");
  res.send("api work");
});
