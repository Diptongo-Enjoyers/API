import config from "../config.js";
import stripe from "stripe";

const Stripe = new stripe(config.STRIPE_SECRET_KEY);

export const postIntents = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await Stripe.paymentIntents.create({
      amount,
      currency: "mxn",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.status(200).json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
};
