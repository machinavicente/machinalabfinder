<?php 
	$server = 'localhost';
	$user = 'root';
	$pass = '';
	$bd = 'simuladores_db';
	
	//conexion a la base de datos
	$conexion = mysqli_connect($server, $user, $pass, $bd) or die("Error al conectar");

	$sql = "SELECT id, asignatura, categoria, name, link FROM simuladores";
   	$result = $conexion->query($sql);
?>