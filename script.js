const form = document.getElementById('queryForm');
const executeButton = document.getElementById('executeBtn');
if (executeButton !== null) {
    executeButton.addEventListener('click', executeRequest);
}

const conditionInputs = document.getElementById('conditionInputs');
const selectedField = document.getElementById('fieldSelect');
if (selectedField !== null) {
    selectedField.addEventListener('change', changeInputHtml);
}

const previewSqlButton = document.getElementById('previewSqlBtn');
if (previewSqlButton !== null) {
    previewSqlButton.addEventListener('click', () => {
        const sqlCodeDisplay = document.getElementById('sqlCodeDisplay');
        const sqlCode = document.getElementById('sqlCode');
        if (sqlCode !== null) { sqlCode.textContent = generateSqlQuery(); }
        if (sqlCodeDisplay !== null) { sqlCodeDisplay.style.display = 'block'; }
    });
}

let sqlQuery;
document.addEventListener('DOMContentLoaded', checkInput);



function checkInput() {
    const inputs = document.querySelectorAll('#conditionInputs input');
    const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');

    if (previewSqlButton === null) {
        return;
    }

    if (selectedField !== null && selectedField.value != null && allFilled) {
        toggleExecuteButton();
        previewSqlButton.style.opacity = 1;
        previewSqlButton.style.display = 'block';
        previewSqlButton.classList.remove('inactive');

    } else {
        toggleExecuteButton(false);
        previewSqlButton.style.opacity = 0;
        setTimeout(() => {
            previewSqlButton.style.display = 'none';
        }, 300);
        previewSqlButton.classList.add('inactive');

    }
}

function changeInputHtml() {
    if (conditionInputs === null) {
        return;
    }


    let inputHtml = '';
    if (selectedField.value === 'date') {
        inputHtml = `
            <label for="startDate">Date de début:</label>
            <input type="date" id="startDate" name="startDate" oninput="checkInput()">
            <label for="endDate">Date de fin:</label>
            <input type="date" id="endDate" name="endDate" oninput="checkInput()">
        `;
    } else if (selectedField.value) {
        inputHtml = `<input type="text" name="conditionValue" id="conditionValue" placeholder="Valeur de condition" oninput="checkInput()">`;
    }

    conditionInputs.innerHTML = inputHtml;
    checkInput();

}

function generateSqlQuery() {
    if (selectedField === null) {
        return;
    }
    console.log("Selected Field:", selectedField.value);

    const tableName = 'facebook_infos.users';
    const dateField = 'date';

    if (selectedField.value === 'date') {
        let startDate = document.getElementById('startDate').value;
        let endDate = document.getElementById('endDate').value;
        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);
        sqlQuery = `SELECT * FROM ${tableName} WHERE ${dateField} BETWEEN '${startDate}' AND '${endDate}'`;
    } else if (selectedField.value) {
        let conditionValue = document.getElementById('conditionValue').value;
        console.log("Condition Value:", conditionValue);
        sqlQuery = `SELECT * FROM ${tableName} WHERE ${selectedField.value} = '${conditionValue}'`;
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
    event.preventDefault();
    event.stopPropagation();

    if (sqlQuery == null || sqlQuery == '') {
        generateSqlQuery();
        if (sqlQuery == null || sqlQuery == '') {
            alert("Aucune requête n'a été construite.")
            return;
        }
    }

    if (form == null) {
        return;
    }

    const formData = new FormData(form);
    const url = '/execute_query.php';
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