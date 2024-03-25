<?php
$fieldSelect = $_POST['fieldSelect'];

if(!empty($fieldSelect)) {
    $sqlQuery = "";
    switch($fieldSelect) {
        case 'date':
            $startDate = $_POST['startDate'];
            $endDate = $_POST['endDate'];
            $sqlQuery = "SELECT * FROM facebook_infos.users WHERE date BETWEEN '$startDate' AND '$endDate'";
            break;
        default:
            $conditionValue = $_POST['conditionValue'];
            $sqlQuery = "SELECT * FROM facebook_infos.users WHERE $fieldSelect = '$conditionValue'";
            break;
    
    }
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "facebook_infos";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("La connexion a échoué : " . $conn->connect_error);
    }

    $result = $conn->query($sqlQuery);

    $numUsers = $result->num_rows;
    echo "<p>$numUsers utilisateurs trouvés</p>";

    if ($result->num_rows > 0) {
        echo "<table>";
        while ($row = $result->fetch_assoc()) {
            echo "<tr>";
            foreach ($row as $value) {
                echo "<td>$value</td>";
            }
            echo "</tr>";
        }
        echo "</table>";
    }

    $conn->close();
} else {
    echo "Veuillez sélectionner un champ.";
}
?>
