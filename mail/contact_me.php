<?php
  $email_address = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);

  //Revisión de campos vacíos
  if(empty($_POST['name']) || empty($_POST['email']) || empty($_POST['phone']) || empty($_POST['message']) || !$email_address){
    echo "Los campos del formulario no pueden estar vacíos";
    return false;
  }

  $name = $_POST['name'];
  if($email_address === FALSE){
    echo 'La dirección de correo electrónico no es válida';
    exit(1);
  }
  $phone = $_POST['phone'];
  $message = $_POST['message'];

  //Se crea el mensaje de correo electrónico y se envía al destinatario
  $to = 'mamurciac@unal.edu.co';
  $email_subject = "Mensaje de tu Página Personal (mamurciac.github.io) de: $name";
  $email_body = "Has recibido un mensaje desde tu página personal.\n\n" . "Detalles del mensaje:\n\nNombre: $name\n\nDirección de Correo Electrónico: $email_address\n\nTeléfono: $phone\n\nMensaje:\n$message";
  $headers = "From: noreply@yourdomain.com\n"; //Esta es la dirección de correo electrónico desde la que se generará el mensaje. Se recomienda usar una dirección como noreply@yourdomain.com.
  $headers .= "Respuesta al mensaje de: $email_address";
  mail($to, $email_subject, $email_body, $headers);
  return true;
?>
