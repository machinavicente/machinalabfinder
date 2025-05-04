<?php
$host = 'db.nthgofwioyfrjvocyvrs.supabase.co'; // Reemplaza con tu host de Supabase
$port = '5432';
$dbname = 'postgres'; // Nombre de la DB en Supabase (generalmente 'postgres')
$user = 'postgres'; // Usuario de Supabase
$password = 'vicentejosemachinarebolledo'; // Contraseña de la DB

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "¡Conexión exitosa a Supabase!";
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>