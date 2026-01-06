<?php
require_once 'config.php';

// Verificar autenticación
$headers = getallheaders();
$token = $headers['Authorization'] ?? '';
$token = str_replace('Bearer ', '', $token);

if (empty($token)) {
    jsonResponse(['error' => 'Token requerido'], 401);
}

$stmt = $pdo->prepare("SELECT id, name, email, role FROM users WHERE auth_token = ?");
$stmt->execute([$token]);
$currentUser = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$currentUser) {
    jsonResponse(['error' => 'Token inválido'], 401);
}

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Listar usuarios (solo admin)
        if ($currentUser['role'] !== 'admin') {
            jsonResponse(['error' => 'Acceso denegado'], 403);
        }
        
        $stmt = $pdo->query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        jsonResponse(['users' => $users]);
        break;
        
    case 'POST':
        // Crear usuario (solo admin)
        if ($currentUser['role'] !== 'admin') {
            jsonResponse(['error' => 'Acceso denegado'], 403);
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        $name = $input['name'] ?? '';
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        $role = $input['role'] ?? 'user';
        
        if (empty($name) || empty($email) || empty($password)) {
            jsonResponse(['error' => 'Todos los campos son requeridos'], 400);
        }
        
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        
        try {
            $stmt = $pdo->prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)");
            $stmt->execute([$name, $email, $passwordHash, $role]);
            
            jsonResponse(['success' => true, 'message' => 'Usuario creado exitosamente']);
        } catch(PDOException $e) {
            if ($e->getCode() == 23000) {
                jsonResponse(['error' => 'El email ya existe'], 400);
            }
            jsonResponse(['error' => 'Error al crear usuario'], 500);
        }
        break;
        
    default:
        jsonResponse(['error' => 'Método no permitido'], 405);
}
?>