// import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import crypto from "crypto";

export default async function handler(req, res) {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;
  const orderid = req.query?.id
  await mongooseConnect();



  const message = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(message)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;
  const orderDoc = await Order.updateOne({_id:orderid},{
    paid: isAuthentic //trur or false
  })

  if (isAuthentic) {
    res.redirect(`/cart?success=true`);
  } else {
    res.status(400).json({ success: false ,orderDoc});
  }
}
