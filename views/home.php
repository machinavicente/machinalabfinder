<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MachinaSynthLabs - UNEFA</title>
  <link href="../assets/bootstrap/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/home.css" type="text/css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
</head>
<body>

  <!-- Barra de navegación -->
  <nav class="navbar navbar-expand-lg navbar-dark navbar-unefa">
    <div class="container d-flex justify-content-center">
      <a class="navbar-brand d-flex align-items-center" href="../index.php">
        <div class="me-3"><img src="../assets/images/logo.png" alt="logo" width="40" height="60"></div>
        <span>Machina<span style=" color: #FFC72C;">Synth</span>Labs</span>
      </a>
    </div>
  </nav>

  <!-- Barra de búsqueda -->
  <div class="search-container text-white">
    <div class="container">
      <div class="search-box">
        <h2 class="text-center mb-4">Encuentra el simulador que necesitas</h2>
        <div class="input-group mb-3">
          <input type="text" class=" search-input" placeholder="Buscar simuladores..." id="search_bar">
          <script src="../assets/js/search-bar.js"></script>
        </div>
        <div class="text-center">
          <small>Ejemplo: redes, programación, bases de datos</small>
        </div>
      </div>
    </div>
  </div>

  <!-- Contenido principal -->
  <div class="container py-5">
    <?php 
        // Configuración de conexión (en producción, usa variables de entorno)
        $db_config = [
            'host' => 'aws-0-us-east-1.pooler.supabase.com',
            'port' => '5432',
            'dbname' => 'postgres',
            'user' => 'postgres.nthgofwioyfrjvocyvrs',
            'password' => 'machinasynthlabs',
            'sslmode' => 'require' // Prueba con 'prefer' si falla
        ];

        // Función para conectar a la base de datos con reintentos
        function connectDB($config, $max_attempts = 3) {
            $attempt = 1;
            $dsn = "pgsql:host={$config['host']};port={$config['port']};dbname={$config['dbname']};sslmode={$config['sslmode']}";
            
            while ($attempt <= $max_attempts) {
                try {
                    $conexion = new PDO($dsn, $config['user'], $config['password']);
                    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                    $conexion->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
                    return $conexion;
                } catch (PDOException $e) {
                    error_log("Intento $attempt fallido: " . $e->getMessage());
                    if ($attempt == $max_attempts) {
                        throw $e; // Relanza la excepción después del último intento
                    }
                    sleep(1); // Espera 1 segundo antes de reintentar
                    $attempt++;
                }
            }
        }

        try {
            // Establecer conexión con reintentos
            $conexion = connectDB($db_config);
            
            // Verificar si la tabla existe
            $table_check = $conexion->query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'simuladores')");
            $table_exists = $table_check->fetchColumn();
            
            if (!$table_exists) {
                throw new Exception("La tabla 'simuladores' no existe en la base de datos");
            }
            
            // Obtenemos las asignaturas únicas
            $consulta_asignaturas = "SELECT DISTINCT asignatura FROM simuladores ORDER BY asignatura";
            $resultado_asignaturas = $conexion->query($consulta_asignaturas);
            
            if ($resultado_asignaturas && $resultado_asignaturas->rowCount() > 0) {
                while ($asignatura_row = $resultado_asignaturas->fetch(PDO::FETCH_ASSOC)) {
                    $asignatura_actual = $asignatura_row['asignatura'];
    ?>
            
        <!-- Sección por asignatura -->
        <h3 class="section-title mb-4"><?php echo htmlspecialchars(ucfirst($asignatura_actual)); ?></h3>

        <div class="row g-4 mb-5">
            <?php
                    // Obtenemos los simuladores para esta asignatura
                    $consulta_simuladores = "SELECT * FROM simuladores WHERE asignatura = :asignatura ORDER BY nombre_del_simulador";
                    $stmt = $conexion->prepare($consulta_simuladores);
                    $stmt->bindParam(':asignatura', $asignatura_actual, PDO::PARAM_STR);
                    $stmt->execute();
                    
                    if ($stmt && $stmt->rowCount() > 0) {
                        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                            $id = $row['id'];
                            $categoria = $row['categoria'];
                            $nombre_del_simulador = $row['nombre_del_simulador'];
                            $enlace = $row['enlace'];
                            
                            // Validar el enlace antes de mostrarlo
                            $enlace_valido = filter_var($enlace, FILTER_VALIDATE_URL) ? $enlace : '#';
            ?>
            <!-- Card Individual -->
            <div class="col-md-4 col-lg-3">
                <div class="card shadow-sm h-100">
                    <div class="card-body text-center d-flex flex-column">
                        <i class="bi bi-terminal fs-1 my-4"></i>
                        <span class="badge category-badge mb-3"><?php echo htmlspecialchars(ucfirst($categoria)); ?></span>
                        <h5 class="card-title"><?php echo htmlspecialchars($nombre_del_simulador); ?></h5>
                        <hr>
                        <p class="card-text text-muted mb-4">Simulador interactivo</p>
                        <a href="<?php echo htmlspecialchars($enlace_valido); ?>" target="_blank" class="btn btn-simulator mt-auto">Ejecutar</a>
                    </div>
                </div>
            </div>
            <?php
                        }
                    } else {
                        echo '<div class="col-12"><p class="text-muted">No hay simuladores disponibles para esta asignatura.</p></div>';
                    }
            ?>
        </div> <!-- Cierre del row -->
        <?php
                }
            } else {
                echo '<div class="alert alert-info">No se encontraron asignaturas con simuladores disponibles.</div>';
            }
        } catch (PDOException $e) {
            error_log("Error de base de datos: " . $e->getMessage());
            echo '<div class="alert alert-danger">';
            echo '<h4>Error de conexión con la base de datos</h4>';
            echo '<p>Por favor verifica:</p>';
            echo '<ul>';
            echo '<li>Que las credenciales de conexión sean correctas</li>';
            echo '<li>Que el servidor de base de datos esté disponible</li>';
            echo '<li>Que tu conexión a internet esté activa</li>';
            echo '</ul>';
            // Solo muestra detalles del error en entorno de desarrollo
            if (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false) {
                echo '<div class="alert alert-warning mt-3"><strong>Detalles técnicos:</strong> ' . htmlspecialchars($e->getMessage()) . '</div>';
            }
            echo '</div>';
        } catch (Exception $e) {
            error_log("Error general: " . $e->getMessage());
            echo '<div class="alert alert-danger">Error: ' . htmlspecialchars($e->getMessage()) . '</div>';
        } finally {
            // Cerrar conexión si existe
            if (isset($conexion)) {
                $conexion = null;
            }
        }
    ?>
  </div> <!-- Cierre del container -->

  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>