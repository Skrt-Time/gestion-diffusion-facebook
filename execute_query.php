<?php


if (isset($_POST['fieldSelect'])) {
    $fieldSelect = $_POST['fieldSelect'];
    $sqlQuery = "";
    switch ($fieldSelect) {
        case 'date':
            $startDate = @$_POST['startDate'];
            $endDate = @$_POST['endDate'];
            if ($startDate != null && $endDate != null) {
                $sqlQuery = "SELECT * FROM `facebook_infos.users` WHERE `date` BETWEEN '$startDate' AND '$endDate'";
            }
            break;
        default:
            $conditionValue = @$_POST['conditionValue'];
            if ($conditionValue != null) {
                $sqlQuery = "SELECT * FROM `facebook_infos.users` WHERE `$fieldSelect` = '$conditionValue'";
            }
            break;
    }

    if ($sqlQuery != '') {
        $serverName = "localhost";
        $username = "root";
        $password = "";
        $dbname = "facebook_infos";

        // Mieux vaut PDO et les requêtes préparées  que mysqli...
        try {
            $conn = new mysqli($serverName, $username, $password, $dbname);
            $result = $conn->query($sqlQuery);

            echo json_encode($result->fetch_all());
            $conn->close();
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode($e->getMessage());
        }

        exit;
    }
}

http_response_code(400);
echo json_encode("Requête incomplete");
