<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Método no permitido'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    jsonResponse(['error' => 'Email y contraseña son requeridos'], 400);
}

try {
    $stmt = $pdo->prepare("SELECT id, name, email, role, password_hash FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user && password_verify($password, $user['password_hash'])) {
        // Generar token simple (en producción usar JWT)
        $token = bin2hex(random_bytes(32));
        
        // Guardar token en base de datos
        $stmt = $pdo->prepare("UPDATE users SET auth_token = ? WHERE id = ?");
        $stmt->execute([$token, $user['id']]);
        
        unset($user['password_hash']);
        $user['token'] = $token;
        
        jsonResponse([
            'success' => true,
            'user' => $user
        ]);
    } else {
        jsonResponse(['error' => 'Credenciales inválidas'], 401);
    }
} catch(PDOException $e) {
    jsonResponse(['error' => 'Error del servidor'], 500);
}
?>