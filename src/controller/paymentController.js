import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: "rzp_test_Rdc6BMsOO1d57G", // Your Razorpay key
  key_secret: "86tuduC2Lci782X9w9ARw9M2", // Your Razorpay secret
});

/**
 * @desc Create Razorpay order
 * @route POST /api/payment/order
 * @access Private
 */
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // amount in paisa
      currency: "INR",
      receipt: "order_rcptid_" + Math.random().toString(36).substring(7),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

/**
 * @desc Verify Razorpay payment
 * @route POST /api/payment/verify
 * @access Private
 */
export const verifyPayment = async (req, res) => {
  try {
    const { order_id, payment_id, signature } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", "86tuduC2Lci782X9w9ARw9M2")
      .update(order_id + "|" + payment_id)
      .digest("hex");

    if (generated_signature === signature) {
      res.json({ status: "success" });
    } else {
      res.status(400).json({ status: "failure" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Verification failed" });
  }
};
