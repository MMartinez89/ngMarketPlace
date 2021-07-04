<?php
    if(isset($_GET["key"]) && ($_GET["key"]) == "AIzaSyAwIu-uWRLt1gL_q1ajsSjoRPxQ0ck3RFw"){
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
        header('Access-Type: aplication/json; charset=utf-8');

        if(isset($_FILES['file']["tmp_name"]) && !empty($_FILES['file']["tmp_name"])){
            //configuramos la ruta del directorio donde se guarda la imagen
            $directory = strtolower($_POST["path"]."/".$_POST["folder"]);
            //Preguntamos si no existe el directorio para crearlo
            if(!file_exists($directory)){
                mkdir($directory, 0755);
            }
            //Eliminamos todos los archivos que existan en ese directorio
            $files = glob($directory."/*"); //recorre todos los archivos que hay en $directory
            foreach($files as $file){
                unlink($file); //borro el archivo existente
            }
            //Capturamos ancho y alto original de la imagen
            list($width, $height) = getimagesize($_FILES['file']["tmp_name"]);
            $newWidth = $_POST["width"];
            $newHeight = $_POST["height"];
            //Deacuerdo con la imagen aplicamos la funciones por defecto 
            if($_FILES["file"]["type"]== "image/jpeg"){
                //Definimos nombre del archivo
                $name = mt_rand(100, 9999).'.jpg';

                //Definimos el destino donde queremos guardarlo
                $folderPath = $directory.'/'.$name;

                //Creamos una copia de la imagen
                $start = imagecreatefromjpeg($_FILES['file']["tmp_name"]);

                //Instruciones para aplicar a la imagen
                $end = imagecreatetruecolor($newWidth, $newHeight);

                imagecopyresized($end, $start, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                imagejpeg($end, $folderPath);
            }
            if($_FILES["file"]["type"]== "image/png"){
                //Definimos nombre del archivo
                $name = mt_rand(100, 9999).'.png';

                //Definimos el destino donde queremos guardarlo
                $folderPath = $directory.'/'.$name;

                //Creamos una copia de la imagen
                $start = imagecreatefrompng($_FILES['file']["tmp_name"]);

                //Instruciones para aplicar a la imagen
                $end = imagecreatetruecolor($newWidth, $newHeight);

                imagealphabending($end, FALSE);
                imagesavealpha($enf, TRUE);

                imagecopyresampled($end, $start, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                imagepng($end, $folderPath); 
            }

            $json = array(
                'status' => 200,
                'result' => $name
            );
            echo json_encode($json, true);
            return;
        }

    }
  