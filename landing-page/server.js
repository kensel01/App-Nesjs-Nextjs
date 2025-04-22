import express from 'express';
import nodemailer from 'nodemailer';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

app.post('/process.php', async (req, res) => {
  const { nombre, email, direccion, mensaje } = req.body;
  
  // Configure email transport (you would need to set up proper email credentials)
  const transporter = nodemailer.createTransport({
    host: "smtp.example.com",
    port: 587,
    secure: false,
    auth: {
      user: "your-email@example.com",
      pass: "your-password"
    }
  });

  try {
    await transporter.sendMail({
      from: email,
      to: "contacto@nodocero.cl",
      subject: "Nuevo mensaje de contacto - Nodo Cero",
      text: `
        Nombre: ${nombre}
        Email: ${email}
        Dirección: ${direccion}
        
        Mensaje:
        ${mensaje}
      `
    });

    res.redirect('/?mensaje=enviado');
  } catch (error) {
    console.error('Error sending email:', error);
    res.redirect('/?mensaje=error');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});