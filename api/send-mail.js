// Envío del formulario de aplicación por el SMTP de Hostinger.
// Las credenciales viven en las variables de entorno de Vercel (SMTP_USER / SMTP_PASS),
// nunca en el código: el repositorio es público.
const nodemailer = require('nodemailer');

const limpiar = (v, max = 2000) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Método no permitido' });
  }
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    return res.status(500).json({ status: 'error', message: 'Falta configurar el correo' });
  }

  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const name = limpiar(b.name, 120);
  const email = limpiar(b.email, 160);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ status: 'error', message: 'Nombre y email son obligatorios' });
  }

  const mensaje = String(b.message ?? '').trim().slice(0, 4000);
  const texto = [
    '========================================',
    'NUEVA APLICACION RECIBIDA EN LUXEVIBE',
    '========================================',
    '',
    '1. DATOS PERSONALES:',
    `- Nombre: ${name}`,
    `- Email: ${email}`,
    `- Edad: ${limpiar(b.age, 10)}`,
    `- Telefono / WhatsApp: ${limpiar(b.phone, 40)}`,
    '',
    '2. PERFILES SOCIALES:',
    `- Red Social Principal: ${limpiar(b.social_media, 300)}`,
    `- Perfil OnlyFans: ${limpiar(b.onlyfans_link, 300)}`,
    '',
    '3. DETALLES:',
    `- Experiencia previa con agencia: ${limpiar(b.agency_experience, 60)}`,
    `- Crea contenido explicito: ${limpiar(b.explicit_content, 60)}`,
    `- Promociona en redes personales: ${limpiar(b.promotion_method, 60)}`,
    '',
    '4. METAS / MENSAJE:',
    mensaje,
    '',
    '========================================',
  ].join('\r\n');

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com', port: 465, secure: true, auth: { user, pass },
    });
    await transporter.sendMail({
      from: `"LuxeVibe Web" <${user}>`,
      to: process.env.MAIL_TO || user,
      replyTo: `"${name.replace(/"/g, '')}" <${email}>`,
      subject: `Nueva Aplicacion LuxeVibe: ${name}`,
      text: texto,
    });
    return res.status(200).json({ status: 'success' });
  } catch (err) {
    console.error('SMTP error:', err && err.message);
    return res.status(500).json({ status: 'error', message: 'No se pudo enviar el correo' });
  }
};
