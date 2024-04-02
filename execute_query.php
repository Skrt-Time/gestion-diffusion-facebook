<?php

$content = file_get_contents('php://input');
if (!isset($_POST['fieldSelect']) && empty($content)) {
    http_response_code(400);
    echo json_encode("Requête incomplete");
    exit;
}

if (isset($_POST['fieldSelect'])) {

    $fieldSelect = $_POST['fieldSelect'];
    $sqlQuery = "SELECT * FROM `users` ";

    $params = [];

    switch ($fieldSelect) {
        case 'date':
            $startDate = filter_input(INPUT_POST, 'startDate');
            $endDate = filter_input(INPUT_POST, 'endDate');

            if ($startDate && $endDate) {
                $sqlQuery .= "WHERE `date` BETWEEN ? AND ?";
                $params[] = $startDate;
                $params[] = $endDate;
            }
            break;
        default:
            $conditionValue = filter_input(INPUT_POST, 'conditionValue');

            if ($conditionValue) {
                $sqlQuery .= "WHERE `$fieldSelect` = ?";
                $params[] = $conditionValue;
            }
            break;
    }

    // Use PDO and prepared statements for better security and performance
    try {
        $serverName = "localhost";
        $username = "root";
        $password = "";
        $dbname = "facebook_infos";

        $conn = new PDO("mysql:host=$serverName;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $conn->prepare($sqlQuery);
        $stmt->execute($params);

        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode($e->getMessage());
    } finally {
        $conn = null; // Close connection even if an exception occurs
    }
} else {
    $data = json_decode($content, true);

    try {
        $path = "fichier.csv";
        $fichier = fopen($path, "w");

        foreach ($data as $ligne) {
            fputcsv($fichier, $ligne);
        }

        fclose($fichier);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode($e->getMessage());
        exit;
    }

    echo json_encode(['filePath' => $path]);
}
