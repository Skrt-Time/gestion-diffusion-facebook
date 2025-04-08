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

let sqlQuery, selectedRows = [], rowsData = [];
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
    } else if (selectedField.value != 'all') {
        inputHtml = `<input type="text" name="conditionValue" class="form-control mb-3" id="conditionValue" placeholder="Valeur de condition" oninput="checkInput()">`;
    }

    conditionInputs.innerHTML = inputHtml;
    checkInput();
     // Reinitialiser l'affichage de sqlCodeDisplay en fonction de la sélection
     const sqlCodeDisplay = document.getElementById('sqlCodeDisplay');
     sqlCodeDisplay.style.display = 'none';

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
    } else if (selectedField.value == 'all') {
        sqlQuery = `SELECT * FROM ${tableName}`;
    } else {
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
    const url = 'execute_query.php';
    const options = {
        method: 'POST',
        body: formData,
    };
    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            rowsData = data;
            const resultDiv = document.getElementById('result'); // Plus besoin de verifier si c'est different de `null` ou pas
            if (data.length == 0) {
                resultDiv.innerText = "Aucune correspondance retrouvée";
                return;
            }

            resultDiv.innerHTML = '';
            resultDiv.appendChild(arrayToHtmlTable(data));
            resultDiv.innerHTML += '<button class="btn btn-dark rounded w-25" onclick="sendSelectedRows();">Soumettre la selection</button>';
        })
        .catch(error => {
            console.error('Error submitting or processing form:', error);
        })
        .finally();
}

function sendSelectedRows() {
    selectedRows = selectedRows.filter(e => e !== null);

    const url = '/execute_query.php';
    const options = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
            rowsData.filter((r, index) => selectedRows.includes(index))
        ),
    };
    fetch(url, options)
        .then(response => response.json())
        .then(data => { window.open(data.filePath, '_blank') })
        .catch(error => {
            console.error('Error submitting data:', error);
        });
}

/**
 * 
 * @param {Array} array 
 */
function arrayToHtmlTable(array) {
    let table = document.createElement('table');
    table.className = 'table table-striped table-sm';
    if (array.length == 0) {
        return table;
    }

    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');

    const keys = Object.keys(array[0]);
    let th = document.createElement('tr');
    th.innerHTML = '<th></th>'
    keys.forEach((k) => {
        th.innerHTML += `<th>${k}</th>`;
    })
    thead.appendChild(th);

    array.forEach((row, index) => {
        let tr = document.createElement('tr');
        tr.innerHTML = `<td class="p-3"><input type="checkbox" checked onclick="updateSelectedRows(this);" class="form-checkbox" name="checked" value="${index}"></td>`;
        keys.forEach((k) => {
            tr.innerHTML += `<td>${row[k]}</td>`
        })
        tbody.appendChild(tr);
    });
    selectedRows = Array.from({ length: array.length }, (v, k) => k);

    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
}
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
}

/**
 * 
 * @param {HTMLInputElement} elt 
 */
function updateSelectedRows(elt) {
    if (elt.checked) {
        selectedRows.push(parseInt(elt.value));
    } else {
        selectedRows[selectedRows.indexOf(parseInt(elt.value))] = null;
    }
}
