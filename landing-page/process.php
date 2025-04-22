<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST['nombre'];
    $email = $_POST['email'];
    $direccion = $_POST['direccion'];
    $mensaje = $_POST['mensaje'];
    
    $to = "contacto@nodocero.cl";
    $subject = "Nuevo mensaje de contacto - Nodo Cero";
    
    $message = "Nombre: " . $nombre . "\n";
    $message .= "Email: " . $email . "\n";
    $message .= "Dirección: " . $direccion . "\n\n";
    $message .= "Mensaje:\n" . $mensaje;
    
    $headers = "From: " . $email;
    
    mail($to, $subject, $message, $headers);
    
    // Redirigir de vuelta al formulario
    header("Location: index.html?mensaje=enviado");
    exit();
}
?>