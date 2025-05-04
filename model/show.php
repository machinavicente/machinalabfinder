<?php
$host = 'aws-0-us-east-1.pooler.supabase.com'; // Reemplaza con tu host de Supabase
$port = '5432';
$dbname = 'postgres'; // Nombre de la DB en Supabase (generalmente 'postgres')
$user = 'postgres.nthgofwioyfrjvocyvrs'; // Usuario de Supabase
$password = 'machinasynthlabs'; // Contraseña de la DB

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "¡Conexión exitosa a Supabase!";
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>