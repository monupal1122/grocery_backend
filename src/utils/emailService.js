import nodemailer from "nodemailer";

// 🔥 FIXED: Gmail SMTP (works on Render)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER, // No fallback
    pass: process.env.GMAIL_PASS, // App password only
  },
});

/**
 * @desc Send order confirmation email
 */
export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const {
      userId,
      items,
      totalAmount,
      paymentMethod,
      paymentStatus,
      addressId,
      _id: orderId,
      createdAt,
    } = orderData;

    const userEmail = userId?.email || userId;
    if (!userEmail) {
      console.warn("User email not found for order confirmation");
      return;
    }

    const itemsList = items
      .map(
        (item) =>
          `<tr>
             <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name ||
               item.productId?.name ||
               "Product"}</td>
             <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${
               item.quantity
             }</td>
             <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${
               item.price || item.productId?.price || 0
             }</td>
             <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${(
               item.quantity *
               (item.price || item.productId?.price || 0)
             ).toFixed(2)}</td>
           </tr>`
      )
      .join("");

    const paymentMethodDisplay =
      paymentMethod === "online"
        ? "Online Payment (Razorpay)"
        : "Cash on Delivery";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 8px; }
            .header { background: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: white; padding: 20px; }
            .order-section { margin: 20px 0; padding: 15px; background: #f3f4f6; border-radius: 4px; }
            .order-id { font-size: 18px; font-weight: bold; color: #10b981; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th { background: #e5e7eb; padding: 10px; text-align: left; font-weight: bold; }
            .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📦 Order Confirmation</h1>
              <p>Thank you for your order!</p>
            </div>

            <div class="content">
              <div class="order-section">
                <p><strong>Order ID:</strong> <span class="order-id">${orderId}</span></p>
                <p><strong>Order Date:</strong> ${new Date(createdAt).toLocaleDateString(
                  "en-IN",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}</p>
              </div>

              <h3>📋 Order Items</h3>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Quantity</th>
                    <th style="text-align: right;">Unit Price</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
              </table>

              <div class="order-section">
                <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
              </div>

              <div class="order-section">
                <h3>💳 Payment</h3>
                <p><strong>Method:</strong> ${paymentMethodDisplay}</p>
                <p><strong>Status:</strong> ${paymentStatus}</p>
              </div>

              <div class="order-section">
                <h3>📍 Address</h3>
                <p>${addressId?.address || "N/A"} <br>
                   ${addressId?.city || ""}, ${addressId?.postalCode || ""}<br>
                   <strong>Phone:</strong> ${addressId?.phone || "N/A"} 
                </p>
              </div>
            </div>

            <div class="footer">
              <p>Blinkit - Fast Grocery Delivery</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: userEmail,
      subject: `Order Confirmed - ${orderId}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending order confirmation email:", error.message);
  }
};

/**
 * @desc Send order status update email
 */
export const sendOrderStatusUpdateEmail = async (
  orderData,
  oldStatus,
  newStatus
) => {
  try {
    const { userId, items, totalAmount, _id: orderId } = orderData;

    const userEmail = userId?.email || userId;
    if (!userEmail) return;

    const htmlContent = `
      <h2>Order Status Updated</h2>
      <p>Your order <strong>${orderId}</strong> status is now <strong>${newStatus}</strong></p>
      <p>Total: ₹${totalAmount}</p>
      <p>Items: ${items.length}</p>
    `;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: userEmail,
      subject: `Order Update - ${newStatus}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Status update email sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending status update email:", error.message);
  }
};

export default { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail };
