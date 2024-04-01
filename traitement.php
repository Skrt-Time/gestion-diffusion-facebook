<?php
if(isset($_POST['variableJS'])) {
    $sqlQuery = $_POST['variableJS'];
    
    // Effectuer des opérations avec $valeurJS (par exemple, enregistrer dans une base de données)
    
    echo 'Variable JavaScript reçue avec succès : ' . $sqlQuery;
} else {
    echo 'Aucune variable JavaScript reçue.';
}

// Connexion à la base de données avec PDO
try {
    $bdd = new PDO('mysql:host=localhost;dbname=facebook_infos', 'root', '');
} catch (PDOException $e) {
    echo 'Connexion échouée : ' . $e->getMessage();
}

// Exécution de la requête SQL stockée dans une variable $requete
$requete = $sqlQuery;
$resultat = $bdd->query($requete);
// Noms des entêtes du tableau
$entetes = array('Utiliser','psid', 'nom', 'user id', 'localisation', 'total messages', 'premier message', 'date premier message', 'date dernier message', 'Deuxième message');

// Affichage des données dans un tableau avec une case à cocher par défaut cochée
echo '<form method="post" action="export.php">';
echo '<table style="border: 1px solid black;">';
echo '<thead>';
foreach ($entetes as $entete) {
    echo '<th style="border: 1px solid black;">' . htmlspecialchars($entete) . '</th>';
}
echo '</tr>';
echo '</thead>';
echo '<tbody>';
$compteur = 0;
try {
    // Code susceptible de générer des erreurs ou des exceptions
    while ($row = $resultat->fetch(PDO::FETCH_ASSOC)) {
        echo '<tr>';
        echo '<td style="border: 1px solid black;"><input type="checkbox" name="enregistrement[]"  checked></td>';
        echo '<td style="border: 1px solid black;">' . $row['psid'] . '</td>';
        echo '<td style="border: 1px solid black;">' . $row['nom_utilisateur'] . '</td>';
        echo '<td style="border: 1px solid black;">' . $row['user_id'] . '</td>';
        echo '<td style="border: 1px solid black;">' . $row['localisation'] . '</td>';
        echo '<td style="border: 1px solid black;">' . $row['nombre_total_message'] . '</td>';
        echo '<td style="border: 1px solid black;">' . $row['message_1'] . '</td>';
        echo '<td style="border: 1px solid black;">' . $row['date_premier_message'] . '</td>';
        echo '<td style="border: 1px solid black;">' . $row['date_dernier_message'] . '</td>';
        echo '<td style="border: 1px solid black;">' . $row['message_2'] . '</td>';


        // Ajouter d'autres colonnes au besoin
        echo '</tr>';
        $compteur++;
    }
}catch (Exception $e) {
    echo 'Une erreur s\'est produite : ' . $e->getMessage();
}
echo '</tbody>';
echo '</table>';
echo '<br>' . $compteur  . " enregistrement(s) trouvé(s).";
echo '<input type="submit" name="submit" value="Envoyer">';
echo '</form>';

// Bouton "Envoyer" pour exporter les enregistrements cochés dans un fichier CSV
if (isset($_POST['submit'])) {
    $fichier_csv = fopen('export.csv', 'w');
    foreach ($_POST['enregistrement'] as $id) {
        // Écrire les données dans le fichier CSV
        fputcsv($fichier_csv, $id);
    }
    fclose($fichier_csv);
}
?>
