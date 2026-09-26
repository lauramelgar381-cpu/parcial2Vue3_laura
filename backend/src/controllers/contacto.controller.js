import nodemailer from 'nodemailer';
import { crearTransporter } from '../config/mailer.js';

export async function enviarContacto(req, res, next) {
  try {
    const { email, mensaje } = req.body;
    const transporter = await crearTransporter();

    const info = await transporter.sendMail({
      from: '"Formulario de Contacto" <no-reply@citasmedicas.com>',
      to: 'destino@citasmedicas.com',
      replyTo: email,
      subject: 'Nuevo mensaje de contacto — Sistema de Citas Médicas',
      text: `De: ${email}\n\nMensaje:\n${mensaje}`,
      html: `<p><strong>De:</strong> ${email}</p><p><strong>Mensaje:</strong></p><p>${mensaje}</p>`,
    });

    console.log('Preview del correo (Ethereal):', nodemailer.getTestMessageUrl(info));

    res.json({ mensaje: 'Correo enviado correctamente' });
  } catch (error) {
    next(error);
  }
}