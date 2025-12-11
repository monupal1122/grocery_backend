import nodemailer from "nodemailer";

<<<<<<< HEAD
// 🔥 FIXED: Gmail SMTP (works on Render)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER, // No fallback
    pass: process.env.GMAIL_PASS, // App password only
=======
// Create transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER || "your-email@gmail.com",
    pass: process.env.GMAIL_PASS || "your-app-password",
>>>>>>> 390165dff0425ff7af12a2a621c0a3d0c612dcb8
  },
});

/**
 * @desc Send order confirmation email
<<<<<<< HEAD
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

=======
 * @param {Object} orderData - Order object with user, items, address, payment info
 */
export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const { userId, items, totalAmount, paymentMethod, paymentStatus, addressId, _id: orderId, createdAt } = orderData;

    // Get user email
>>>>>>> 390165dff0425ff7af12a2a621c0a3d0c612dcb8
    const userEmail = userId?.email || userId;
    if (!userEmail) {
      console.warn("User email not found for order confirmation");
      return;
    }

<<<<<<< HEAD
=======
    // Format items list
>>>>>>> 390165dff0425ff7af12a2a621c0a3d0c612dcb8
    const itemsList = items
      .map(
        (item) =>
          `<tr>
<<<<<<< HEAD
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
=======
             <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name || item.productId?.name || "Product"}</td>
             <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
             <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price || item.productId?.price || 0}</td>
             <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${(item.quantity * (item.price || item.productId?.price || 0)).toFixed(2)}</td>
>>>>>>> 390165dff0425ff7af12a2a621c0a3d0c612dcb8
           </tr>`
      )
      .join("");

<<<<<<< HEAD
    const paymentMethodDisplay =
      paymentMethod === "online"
        ? "Online Payment (Razorpay)"
        : "Cash on Delivery";
=======
    const paymentStatusColor = paymentStatus === "Paid" ? "#10b981" : "#f59e0b";
    const paymentMethodDisplay = paymentMethod === "online" ? "Online Payment (Razorpay)" : "Cash on Delivery";
>>>>>>> 390165dff0425ff7af12a2a621c0a3d0c612dcb8

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
<<<<<<< HEAD
=======
            .status-badge { padding: 8px 12px; border-radius: 4px; color: white; font-weight: bold; }
            .status-paid { background: #10b981; }
            .status-pending { background: #f59e0b; }
>>>>>>> 390165dff0425ff7af12a2a621c0a3d0c612dcb8
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
<<<<<<< HEAD
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
=======
                <p><strong>Order Date:</strong> ${new Date(createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
>>>>>>> 390165dff0425ff7af12a2a621c0a3d0c612dcb8
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
<<<<<<< HEAD
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
=======
                <p><strong>Subtotal:</strong> ₹${totalAmount}</p>
                <p><strong>Delivery Charges:</strong> Free</p>
                <hr style="border: 1px solid #e5e7eb; margin: 10px 0;">
                <p style="font-size: 18px; font-weight: bold;"><strong>Total Amount:</strong> ₹${totalAmount}</p>
              </div>

              <div class="order-section">
                <h3>💳 Payment Information</h3>
                <p><strong>Payment Method:</strong> ${paymentMethodDisplay}</p>
                <p><strong>Payment Status:</strong> <span class="status-badge ${paymentStatus === 'Paid' ? 'status-paid' : 'status-pending'}">${paymentStatus}</span></p>
              </div>

              <div class="order-section">
                <h3>📍 Delivery Address</h3>
                <p>
                  ${addressId?.address || 'Address not available'}<br>
                  ${addressId?.city || ''}, ${addressId?.postalCode || ''}<br>
                  <strong>Phone:</strong> ${addressId?.phone || 'N/A'}
                </p>
              </div>

              <div class="order-section" style="background: #d1fae5; border-left: 4px solid #10b981;">
                <p><strong>✓ Your order has been confirmed!</strong></p>
                <p>We will notify you when your order is out for delivery. You can track your order status anytime.</p>
              </div>
>>>>>>> 390165dff0425ff7af12a2a621c0a3d0c612dcb8
            </div>

            <div class="footer">
              <p>Blinkit - Fast Grocery Delivery</p>
<<<<<<< HEAD
=======
              <p>For support, reply to this email or contact our customer service.</p>
>>>>>>> 390165dff0425ff7af12a2a621c0a3d0c612dcb8
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
<<<<<<< HEAD
      from: process.env.GMAIL_USER,
      to: userEmail,
      subject: `Order Confirmed - ${orderId}`,
=======
      from: process.env.GMAIL_USER || "noreply@blinkit.com",
      to: userEmail,
      subject: `Order Confirmed - ${orderId} | Blinkit`,
>>>>>>> 390165dff0425ff7af12a2a621c0a3d0c612dcb8
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
<<<<<<< HEAD
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
=======
 * @param {Object} orderData - Order object with status update
 * @param {String} oldStatus - Previous delivery status
 * @param {String} newStatus - New delivery status
 */
export const sendOrderStatusUpdateEmail = async (orderData, oldStatus, newStatus) => {
  try {
    const { userId, items, totalAmount, _id: orderId } = orderData;

    // Get user email
    const userEmail = userId?.email || userId;
    if (!userEmail) {
      console.warn("User email not found for status update");
      return;
    }

    const statusMessages = {
      "Confirmed": "✓ Your order has been confirmed and is being prepared!",
      "Out for delivery": "🚚 Your order is out for delivery! It will arrive soon.",
      "Delivered": "📦 Your order has been delivered! Thank you for shopping with us.",
      "Cancelled": "❌ Your order has been cancelled. Please contact support for assistance.",
    };

    const statusEmojis = {
      "Confirmed": "✓",
      "Out for delivery": "🚚",
      "Delivered": "📦",
      "Cancelled": "❌",
    };

    const statusColors = {
      "Confirmed": "#3b82f6",
      "Out for delivery": "#f59e0b",
      "Delivered": "#10b981",
      "Cancelled": "#ef4444",
    };

    const statusColor = statusColors[newStatus] || "#6b7280";
    const statusMessage = statusMessages[newStatus] || `Order status updated to ${newStatus}`;
    const statusEmoji = statusEmojis[newStatus] || "•";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 8px; }
            .header { background: ${statusColor}; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: white; padding: 20px; }
            .status-box { background: ${statusColor}20; border-left: 4px solid ${statusColor}; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .status-text { color: ${statusColor}; font-weight: bold; font-size: 16px; }
            .order-details { background: #f3f4f6; padding: 15px; border-radius: 4px; margin: 15px 0; }
            .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${statusEmoji} Order Update</h1>
            </div>

            <div class="content">
              <div class="status-box">
                <p class="status-text">${statusMessage}</p>
              </div>

              <div class="order-details">
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
                <p><strong>Number of Items:</strong> ${items.length}</p>
                <p><strong>Current Status:</strong> <strong style="color: ${statusColor};">${newStatus}</strong></p>
              </div>

              <p style="margin-top: 20px;">
                ${newStatus === "Delivered" ? "Thank you for shopping with Blinkit! We hope you enjoyed your order." : "We appreciate your patience and will keep you updated on your order."}
              </p>
            </div>

            <div class="footer">
              <p>Blinkit - Fast Grocery Delivery</p>
              <p>For support, please contact our customer service team.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.GMAIL_USER || "noreply@blinkit.com",
      to: userEmail,
      subject: `Order Update - ${newStatus} | ${orderId} | Blinkit`,
>>>>>>> 390165dff0425ff7af12a2a621c0a3d0c612dcb8
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
<<<<<<< HEAD
    console.log(`Status update email sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending status update email:", error.message);
=======
    console.log(`Order status update email sent to ${userEmail} - Status: ${newStatus}`);
  } catch (error) {
    console.error("Error sending order status update email:", error.message);
>>>>>>> 390165dff0425ff7af12a2a621c0a3d0c612dcb8
  }
};

export default { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail };
