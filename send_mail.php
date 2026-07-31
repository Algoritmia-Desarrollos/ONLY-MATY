<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Método no permitido"]);
    exit;
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    $data = $_POST;
}

$name = isset($data['name']) ? strip_tags(trim($data['name'])) : '';
$email = isset($data['email']) ? filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL) : '';
$age = isset($data['age']) ? strip_tags(trim($data['age'])) : '';
$phone = isset($data['phone']) ? strip_tags(trim($data['phone'])) : '';
$social_media = isset($data['social_media']) ? strip_tags(trim($data['social_media'])) : '';
$onlyfans_link = isset($data['onlyfans_link']) ? strip_tags(trim($data['onlyfans_link'])) : '';
$agency_experience = isset($data['agency_experience']) ? strip_tags(trim($data['agency_experience'])) : '';
$explicit_content = isset($data['explicit_content']) ? strip_tags(trim($data['explicit_content'])) : '';
$promotion_method = isset($data['promotion_method']) ? strip_tags(trim($data['promotion_method'])) : '';
$message_text = isset($data['message']) ? strip_tags(trim($data['message'])) : '';

if (empty($name) || empty($email)) {
    echo json_encode(["status" => "error", "message" => "Nombre y email son requeridos."]);
    exit;
}

$to = "info@luxevibe.com.ar";
$subject = "Nueva Aplicacion LuxeVibe: " . $name;

$bodyText = "========================================\r\n";
$bodyText .= "NUEVA APLICACION RECIBIDA EN LUXEVIBE\r\n";
$bodyText .= "========================================\r\n\r\n";
$bodyText .= "1. DATOS PERSONALES:\r\n";
$bodyText .= "- Nombre: $name\r\n";
$bodyText .= "- Email: $email\r\n";
$bodyText .= "- Edad: $age\r\n";
$bodyText .= "- Telefono / WhatsApp: $phone\r\n\r\n";
$bodyText .= "2. PERFILES SOCIALES:\r\n";
$bodyText .= "- Red Social Principal: $social_media\r\n";
$bodyText .= "- Perfil OnlyFans: $onlyfans_link\r\n\r\n";
$bodyText .= "3. DETALLES:\r\n";
$bodyText .= "- Experiencia previa con agencia: $agency_experience\r\n";
$bodyText .= "- Crea contenido explicito: $explicit_content\r\n";
$bodyText .= "- Promociona en redes personales: $promotion_method\r\n\r\n";
$bodyText .= "4. METAS / MENSAJE:\r\n";
$bodyText .= "$message_text\r\n\r\n";
$bodyText .= "========================================\r\n";

/**
 * Función para enviar correo mediante conexión directa a Hostinger SMTP (SSL Port 465)
 */
function send_hostinger_smtp($to, $subject, $bodyText, $replyEmail, $replyName) {
    $smtp_host = "ssl://smtp.hostinger.com";
    $smtp_port = 465;
    $username  = "info@luxevibe.com.ar";
    $password  = "Lucagazze2000-";

    $socket = @fsockopen($smtp_host, $smtp_port, $errno, $errstr, 15);
    if (!$socket) {
        return ["success" => false, "error" => "No se pudo conectar al servidor SMTP: $errstr ($errno)"];
    }

    $read = function($socket) {
        $response = "";
        while ($str = fgets($socket, 515)) {
            $response .= $str;
            if (substr($str, 3, 1) == " ") break;
        }
        return $response;
    };

    $send = function($socket, $cmd) use ($read) {
        fputs($socket, $cmd . "\r\n");
        return $read($socket);
    };

    $read($socket); // Saludo inicial 220
    $send($socket, "EHLO luxevibe.com.ar");
    
    $authRes = $send($socket, "AUTH LOGIN");
    if (substr($authRes, 0, 3) != "334") {
        fclose($socket);
        return ["success" => false, "error" => "Error en AUTH LOGIN: $authRes"];
    }

    $userRes = $send($socket, base64_encode($username));
    if (substr($userRes, 0, 3) != "334") {
        fclose($socket);
        return ["success" => false, "error" => "Error en usuario SMTP: $userRes"];
    }

    $passRes = $send($socket, base64_encode($password));
    if (substr($passRes, 0, 3) != "235") {
        fclose($socket);
        return ["success" => false, "error" => "Error de contraseña SMTP: $passRes"];
    }

    $send($socket, "MAIL FROM: <$username>");
    $send($socket, "RCPT TO: <$to>");
    $send($socket, "DATA");

    $headers  = "From: LuxeVibe Web <$username>\r\n";
    $headers .= "Reply-To: $replyName <$replyEmail>\r\n";
    $headers .= "To: <$to>\r\n";
    $headers .= "Subject: $subject\r\n";
    $headers .= "Date: " . date("r") . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "MIME-Version: 1.0\r\n";

    $data = $headers . "\r\n" . $bodyText . "\r\n.";
    $dataRes = $send($socket, $data);

    $send($socket, "QUIT");
    fclose($socket);

    if (substr($dataRes, 0, 3) == "250") {
        return ["success" => true];
    } else {
        return ["success" => false, "error" => "Error al entregar mensaje: $dataRes"];
    }
}

// Intentar envío por Hostinger SMTP SSL direct socket
$result = send_hostinger_smtp($to, $subject, $bodyText, $email, $name);

if ($result["success"]) {
    echo json_encode(["status" => "success", "message" => "Aplicación enviada correctamente."]);
} else {
    // Fallback a la función mail() estándar si por alguna razón el socket es bloqueado localmente
    $fallbackHeaders  = "From: LuxeVibe Web <info@luxevibe.com.ar>\r\n";
    $fallbackHeaders .= "Reply-To: $name <$email>\r\n";
    $fallbackHeaders .= "Content-Type: text/plain; charset=UTF-8\r\n";

    if (@mail($to, $subject, $bodyText, $fallbackHeaders)) {
        echo json_encode(["status" => "success", "message" => "Aplicación enviada correctamente via PHP mail."]);
    } else {
        echo json_encode(["status" => "error", "message" => $result["error"]]);
    }
}
?>
