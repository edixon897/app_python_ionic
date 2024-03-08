<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';

$app = AppFactory::create();

function getDB(){
    $dbhost = "localhost";
    $dbname = "softgi";
    $dbuser = "root";
    $dbpass = "";
    $mysql_conn_string = "mysql:host=$dbhost;dbname=$dbname";
    $dbConnection = new PDO($mysql_conn_string, $dbuser, $dbpass);
    $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbConnection;
}



$app->get('/', function (Request $request, Response $response, $args) {
    $response->getBody()->write("Hello world!");
    return $response;
});




$app->get('/getUsrId/{cedula}/{password}', function (Request $request, Response $response, $args) {
    try {
        // Obtener instancia de la base de datos
        $db = getDB();

        // Encriptar la contraseña proporcionada
        $password = hash('sha512', $args['password']);

        // Preparar la consulta SQL
        $stmt = $db->prepare("SELECT * FROM `empleados` WHERE doc_empleado = :cedula AND contrasena = :password AND estado='ACTIVO' AND rol='administrador'");
        $stmt->bindParam(':cedula', $args['cedula']);
        $stmt->bindParam(':password', $password);
        $stmt->execute();
        
        // Obtener el resultado de la consulta
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Verificar si el usuario existe
        if ($user) {
            // Usuario existe
            $response->getBody()->write(json_encode(['resp' => 'existe']));
        } else {
            // Usuario no existe
            $response->getBody()->write(json_encode(['resp' => 'no_existe']));
        }

    } catch (PDOException $e) {
        // Error en la consulta
        $response->getBody()->write(json_encode(['resp' => 'error', 'mensaje' => $e->getMessage()]));
    }

    return $response->withHeader('Content-Type', 'application/json');
});


$app->get('/productosget', function($request, $response, $args) {
    try{
        $db = getDb(); // Cargo los datos
        $sth = $db->prepare("SELECT id_producto, ref_produ_1,nom_proveedor, nombre_producto, precio_compra, precio_venta, cantidad_producto, stockminimo FROM productos");//Consulta los datos
        $sth->execute();//ejecuta la consulta
        $test = $sth->fetchAll(PDO::FETCH_ASSOC);//Guarda los resultados de la consulta
        //Aca abajo verifica si se ha cargado algo
        if($test){
            $response->getBody()->write(json_encode($test));

            return $response->withHeader('Content-Type', 'application/json');
            //Write escribe las respuesta como texto, pero necesito un Json
            // Cerrar la conexion con la base de datos
        }
        else{
            $response->getBody()->write('{"error":"error"}');
        }
    }catch(PDOException $e){
        $response->getBody()->write('{"error":{"texto":'.$e->getMessage().'}}'); //En caso que se halla generado algun error
    }
    return $response
    ->withHeader('Content-Type', 'application/json')
    ->write(json_encode($test));
});


$app->get('/ventasSemanales', function ($request, $response, $args) {  //Defino los servicios
	try{
		$db =  getDB(); //Carga los datos
		$sth = $db->prepare("SELECT DATE(ventas.fechahora_venta) as fecha, detalleventas.total_pagar_factura as total
        FROM ventas 
        JOIN detalleventas ON detalleventas.num_factura_venta = ventas.num_factura WHERE ventas.fechahora_venta");//Consulta
		$sth->execute(); //Ejecutamos la consulta
		$test = $sth->fetchAll(PDO::FETCH_ASSOC);//Guardar los resultados de la consulta
		//Verificar si se ha cargado algo
if($test){
			$response->getBody()->write(json_encode($test)); //write Escribe la respuesta como texto, pero necesito un Json
			$db = null;//Cerrar la conexion con la base de datos
		}   
		else{
			$response->getBody()->write('{"error":"error"}');
		}
}catch(PDOException $e){
			$response->getBody()->write('{"error":{"texto":'.$e->getMessage().'}}'); //En caso que se halla generado algún error
		}
    return $response
    ->withHeader('Content-Type', 'application/json');
});

$app->get('/creditos', function($request, $response, $args) {
    try{
        $db = getDb(); // Cargo los datos
        $sth = $db->prepare("SELECT vc.contador, vc.cliente, vc.productos, vc.credito_total, vc.credito_restante, DATE(vc.fecha_venta) as fecha, vc.estado,
        CONCAT(c.nom_cliente, ' ', c.ape_cliente) as nombre_completo,
        MAX(v.num_factura) as num_factura
        FROM ventas_credito vc
        JOIN clientes c ON vc.cliente = c.doc_cliente
        LEFT JOIN ventas v ON vc.cliente = v.cliente_factura
        WHERE vc.estado = 'ACTIVO'
        GROUP BY vc.cliente, vc.productos, vc.credito_total, vc.credito_restante, vc.fecha_venta, vc.estado, nombre_completo;"); //Consulta los datos
        $sth->execute();//ejecuta la consulta
        $test = $sth->fetchAll(PDO::FETCH_ASSOC);//Guarda los resultados de la consulta
        //Aca abajo verifica si se ha cargado algo
        if($test){
            $response->getBody()->write(json_encode($test));

            return $response->withHeader('Content-Type', 'application/json');
            //Write escribe las respuesta como texto, pero necesito un Json
            // Cerrar la conexion con la base de datos
        }
        else{
            $response->getBody()->write('{"error":"error"}');
        }
    }catch(PDOException $e){
        $response->getBody()->write('{"error":{"texto":'.$e->getMessage().'}}'); //En caso que se halla generado algun error
    }
    return $response
    ->withHeader('Content-Type', 'application/json')
    ->write(json_encode($test));
});

$app->run();