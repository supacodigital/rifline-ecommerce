// Service d'envoi d'emails via Brevo (SMTP)
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   'smtp-relay.brevo.com',
  port:   587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

const FROM = `"${process.env.SHOP_NAME || 'Boutique'}" <${process.env.BREVO_SMTP_USER}>`;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// --- Helpers HTML ---

function baseTemplate(content) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin: 0; padding: 0; background: #f5f5f0; font-family: Georgia, serif; color: #1a1a1a; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border: 1px solid #e8e3d9; }
    .header { background: #1a1a1a; padding: 32px 40px; text-align: center; }
    .header h1 { margin: 0; color: #c9a96e; font-size: 22px; letter-spacing: 3px; text-transform: uppercase; font-weight: normal; }
    .body { padding: 40px; }
    .body h2 { font-size: 18px; font-weight: normal; color: #1a1a1a; margin: 0 0 16px; }
    .body p { font-size: 14px; line-height: 1.7; color: #555; margin: 0 0 12px; }
    .order-box { background: #f9f7f2; border: 1px solid #e8e3d9; padding: 20px; margin: 24px 0; }
    .order-box table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .order-box td { padding: 8px 4px; border-bottom: 1px solid #e8e3d9; color: #444; }
    .order-box td:last-child { text-align: right; font-weight: bold; }
    .order-box tr:last-child td { border-bottom: none; font-size: 15px; color: #1a1a1a; }
    .btn { display: inline-block; margin: 24px 0; padding: 14px 32px; background: #1a1a1a; color: #ffffff !important; text-decoration: none; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; }
    .footer { background: #f9f7f2; padding: 24px 40px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e8e3d9; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>${process.env.SHOP_NAME || 'Boutique'}</h1>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>${process.env.SHOP_NAME || 'Boutique'} — ${process.env.SHOP_ADDRESS_LINE1 || ''}, ${process.env.SHOP_POSTAL_CODE || ''} ${process.env.SHOP_CITY || ''}</p>
      <p>Vous recevez cet email car vous avez passé une commande sur notre boutique.</p>
    </div>
  </div>
</body>
</html>`;
}

// --- Templates ---

function orderConfirmationHtml(order, items) {
  const itemsRows = items.map(i => `
    <tr>
      <td>${i.product_name} × ${i.quantity}</td>
      <td>${Number(i.subtotal).toFixed(2)} €</td>
    </tr>
  `).join('');

  return baseTemplate(`
    <h2>Merci pour votre commande !</h2>
    <p>Bonjour ${order.shipping_first_name},</p>
    <p>Nous avons bien reçu votre commande et elle est en cours de traitement.</p>

    <div class="order-box">
      <p style="margin:0 0 12px;font-size:13px;color:#999;letter-spacing:1px;text-transform:uppercase;">
        Commande ${order.order_number}
      </p>
      <table>
        ${itemsRows}
        <tr>
          <td style="color:#999;">Livraison</td>
          <td>${Number(order.shipping_cost_eur).toFixed(2)} €</td>
        </tr>
        ${order.discount_eur > 0 ? `
        <tr>
          <td style="color:#999;">Réduction</td>
          <td>− ${Number(order.discount_eur).toFixed(2)} €</td>
        </tr>` : ''}
        <tr>
          <td><strong>Total</strong></td>
          <td>${Number(order.total_eur).toFixed(2)} €</td>
        </tr>
      </table>
    </div>

    <p><strong>Adresse de livraison :</strong><br />
      ${order.shipping_first_name} ${order.shipping_last_name}<br />
      ${order.shipping_address1}${order.shipping_address2 ? ', ' + order.shipping_address2 : ''}<br />
      ${order.shipping_postal} ${order.shipping_city}, ${order.shipping_country}
    </p>

    <a href="${FRONTEND_URL}/commandes" class="btn">Voir ma commande</a>

    <p style="color:#999;font-size:12px;">
      Vous recevrez un email dès que votre commande sera expédiée.
    </p>
  `);
}

function passwordResetHtml(firstName, resetUrl) {
  return baseTemplate(`
    <h2>Réinitialisation de votre mot de passe</h2>
    <p>Bonjour ${firstName},</p>
    <p>Nous avons reçu une demande de réinitialisation du mot de passe associé à votre compte.</p>
    <p>Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe. Ce lien est valable <strong>1 heure</strong>.</p>

    <a href="${resetUrl}" class="btn">Réinitialiser mon mot de passe</a>

    <p style="color:#999;font-size:12px;">
      Si vous n'avez pas demandé de réinitialisation, ignorez cet email — votre mot de passe ne sera pas modifié.
    </p>
  `);
}

// --- Fonctions d'envoi ---

async function sendOrderConfirmation(order, items) {
  if (!process.env.BREVO_SMTP_KEY) return;
  try {
    await transporter.sendMail({
      from:    FROM,
      to:      order.email,
      subject: `Confirmation de commande ${order.order_number} — ${process.env.SHOP_NAME || 'Boutique'}`,
      html:    orderConfirmationHtml(order, items),
    });
  } catch (err) {
    console.error('Erreur envoi email confirmation commande :', err.message);
  }
}

async function sendPasswordReset(user, token) {
  if (!process.env.BREVO_SMTP_KEY) return;
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;
  try {
    await transporter.sendMail({
      from:    FROM,
      to:      user.email,
      subject: `Réinitialisation de votre mot de passe — ${process.env.SHOP_NAME || 'Boutique'}`,
      html:    passwordResetHtml(user.first_name, resetUrl),
    });
  } catch (err) {
    console.error('Erreur envoi email reset mot de passe :', err.message);
  }
}

module.exports = { sendOrderConfirmation, sendPasswordReset };
