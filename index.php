<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>SKRT - Requête Dynamique</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <form id="queryForm">
            <select name="fieldSelect" id="fieldSelect">
                <option value="">Sélectionner un champ</option>
                <option value="senderpsid">senderpsid</option>
                <option value="userid">userid</option>
                <option value="date">date</option>
                <option value="location">location</option>
                <option value="day">day</option>
            </select>

            <div id="conditionInputs"></div>

            <button type="submit" id="executeBtn">Effectuer</button>
            <button type="button" id="previewSqlBtn" style="display: none;">Aperçu SQL</button>
        </form>
    </div>

    <div id="sqlCodeDisplay" class="sql-code-display">
        <h2>Code SQL</h2>
        <pre id="sqlCode"></pre>
    </div>

    <script src="script.js"></script>
    
</body>
</html>
