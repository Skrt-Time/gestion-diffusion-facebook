<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>SKRT - Requête Dynamique</title>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <div class="container my-5">
        <form id="queryForm" class="w-50 container">
            <select name="fieldSelect" id="fieldSelect" class="form-select mb-3">
                <option value="">Sélectionner un champ</option>
                <option value="psid">Sender Psid</option>
                <option value="user_id">User Id</option>
                <option value="date">Date</option>
                <option value="localisation">location</option>
                <option value="day">day</option>
                <option value="all">All</option>
            </select>

            <div id="conditionInputs"></div>

            <button type="submit" class="btn btn-danger w-100 mb-3" id="executeBtn">Effectuer</button>
            <button type="button" class="btn btn-danger w-100 mb-3" id="previewSqlBtn" style="display: none;">Aperçu SQL</button>
        </form>

        <div id="sqlCodeDisplay" class="sql-code-display my-5 p-3">
            <h2>Code SQL</h2>
            <pre id="sqlCode"></pre>
        </div>

        <div id="result" class="container-fluid my-5 text-center"></div>
    </div>
    <script src="jquery-3.6.0.min.js"></script>
    <script src="script.js"></script>

</body>

</html>
