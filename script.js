const form = document.getElementById('queryForm');
const executeButton = document.getElementById('executeBtn');
if (executeButton !== null) {
    executeButton.addEventListener('click', executeRequest);
}

const conditionInputs = document.getElementById('conditionInputs');
let sqlQuery;
document.addEventListener('DOMContentLoaded', checkInput);


document.getElementById('fieldSelect').addEventListener('change', function() {
    const selectedField = this.value;
    const conditionInputs = document.getElementById('conditionInputs');
    conditionInputs.innerHTML = '';

    let inputHtml = '';
    if (selectedField === 'date') {
        inputHtml = `
            <label for="startDate">Date de début:</label>
            <input type="date" id="startDate" name="startDate" oninput="checkInput()">
            <label for="endDate">Date de fin:</label>
            <input type="date" id="endDate" name="endDate" oninput="checkInput()">
        `;
    } else if (selectedField != 'all') {
        inputHtml = `<input type="text" name="conditionValue" id="conditionValue" placeholder="Valeur de condition" oninput="checkInput()">`;
    }

    conditionInputs.innerHTML = inputHtml;

    checkInput();

    // Gérer l'affichage de sqlCodeDisplay en fonction de la sélection
    const sqlCodeDisplay = document.getElementById('sqlCodeDisplay');
    if (selectedField !== 'date') {
        sqlCodeDisplay.style.display = 'none';
    } else {
        sqlCodeDisplay.style.display = 'block';
    }
});
//Afficher la requete
document.getElementById('previewSqlBtn').addEventListener('click', function() {
    const selectedField = document.getElementById('fieldSelect').value;
    console.log("Selected Field:", selectedField);

    let sqlQuery = generateSqlQuery(selectedField);
    console.log("Generated SQL Query:", sqlQuery);

    const sqlCodeDisplay = document.getElementById('sqlCodeDisplay');
    const sqlCode = document.getElementById('sqlCode');
    sqlCode.textContent = sqlQuery;
    sqlCodeDisplay.style.display = 'block';
});




function checkInput() {
    const inputs = document.querySelectorAll('#conditionInputs input');
    const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');
    const selectedField = document.getElementById('fieldSelect').value;
    const executeBtn = document.getElementById('executeBtn');
    const previewBtn = document.getElementById('previewSqlBtn');

    if (selectedField && allFilled) {
        executeBtn.removeAttribute('disabled');
        executeBtn.classList.remove('inactive');
        previewBtn.style.opacity = 1;
        previewBtn.style.display = 'block';
        previewBtn.classList.remove('inactive');
    } else if (selectedField== 'all'){
        executeBtn.removeAttribute('disabled');
        executeBtn.classList.remove('inactive');
        previewBtn.style.opacity = 1;
        previewBtn.style.display = 'block';
        previewBtn.classList.remove('inactive');
    }else {
        executeBtn.setAttribute('disabled', 'disabled');
        executeBtn.classList.add('inactive');
        previewBtn.style.opacity = 0;
        setTimeout(() => {
            previewBtn.style.display = 'none';
        }, 300);
        previewBtn.classList.add('inactive');
    }
}


checkInput();
window.onload = function() {
    const selectedField = document.getElementById('fieldSelect').value;
    const executeBtn = document.getElementById('executeBtn');
    const previewBtn = document.getElementById('previewSqlBtn');
    // Réinitialiser les valeurs des inputs à leur état par défaut
    
    // Réinitialiser la sélection du dropdown menu à sa valeur par défaut
    document.getElementById('fieldSelect').selectedIndex = 0;

    // Réinitialiser l'état des boutons à leur état par défaut
    executeBtn.setAttribute('disabled', 'disabled');
    executeBtn.classList.add('inactive');
    setTimeout(() => {
    previewBtn.style.display = 'none';
    }, 300);
    previewBtn.style.display = 'none';
    previewBtn.classList.add('inactive');
    previewBtn.style.opacity = 0;
    //document.getElementById('bouton1').disabled = false;
    //document.getElementById('bouton2').disabled = true;
}



function generateSqlQuery(selectedField) {
    //console.log("Selected Field:", selectedField);

    let sqlQuery = '';
    const tableName = 'facebook_infos.users';
    const dateField = 'date';

    
    if (selectedField === 'date') {
        let startDate = document.getElementById('startDate').value;
        let endDate = document.getElementById('endDate').value;
        //console.log("Start Date:", startDate);
        //console.log("End Date:", endDate);
        sqlQuery = `SELECT * FROM ${tableName} WHERE ${dateField} BETWEEN '${startDate}' AND '${endDate}'`;
    }else if (selectedField === 'all') {
        sqlQuery = `SELECT * FROM ${tableName}`; // Sélectionner tous les utilisateurs
    } else { 
        let conditionValue = document.getElementById('conditionValue').value;
        console.log("Condition Value:", conditionValue);
        console.log("champ selectionné", selectedField);
        sqlQuery = `SELECT * FROM ${tableName} WHERE ${selectedField} = '${conditionValue}'`;
    }

    console.log("Generated SQL Query:", sqlQuery);

    return sqlQuery;
}

/**
 * 
 * @param {boolean} enable 
 */
function toggleExecuteButton(enable = true) {
    if (executeButton === null) {
        return;
    }

    if (enable) {
        executeButton.removeAttribute('disabled');
        executeButton.classList.remove('inactive');
    } else {
        executeButton.setAttribute('disabled', 'disabled');
        executeButton.classList.add('inactive');
    }
}

/**
 * 
 * @param {Event} event 
 * @returns 
 */
function executeRequest(event) {
    const selectedField = document.getElementById('fieldSelect').value;
    event.preventDefault();
    event.stopPropagation();

    if (sqlQuery == null || sqlQuery == '') {
        sqlQuery= generateSqlQuery(selectedField);
        if (sqlQuery == null || sqlQuery == '') {
            alert("Aucune requête n'a été construite.")
            return;
        }
    }

    if (form == null) {
        return;
    }

    const formData = new FormData(form);
    const url = '/dropdown_sql/execute_query.php';
    const options = {
        method: 'POST',
        body: formData,
    };
    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error submitting form:', error);
        })
        .finally();
}

/**
 * 
 * @param {Array} array 
 */
function arrayToHtmlTable(array) {
    // Flemme de faire
}