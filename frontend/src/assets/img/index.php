<?php
    if(isset($_GET["key"]) && ($_GET["key"]) == "AIzaSyAwIu-uWRLt1gL_q1ajsSjoRPxQ0ck3RFw"){
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
        header('Access-Type: aplication/json; charset=utf-8');

        if(isset($_FILES['file']["tmp_name"]) && !empty($_FILES['file']["tmp_name"])){
            $json = array(
                'status' => 200
            );
            echo json_encode($json, true);
            return;
        }

    }
  