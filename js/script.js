let input = document.querySelector(".input-sql");
let btnCreate = document.querySelector(".create");
let btnInsert = document.querySelector(".insert");
let btnClear = document.querySelector(".clear");
let h1 = document.querySelector(".tableTitle");
let error = document.querySelector("p");
let tbody = document.querySelector("tbody");
let isCreateTable = false;

// CREATE TABLE usuarios (id,email,senha);
// INSERT INTO usuarios (id,email,senha) VALUES (1,'teste','teste');

btnCreate.addEventListener("click", (e) => {
    e.preventDefault();

    let semicolon = validateSemicolon();

    if (!semicolon) {
        return;
    }

    if (!input.value.toUpperCase().includes("CREATE TABLE")) {
        setError();
        return;
    } else {
        resetError();
    }

    let instruction = getInstruction();
    let table = getTable();
    let fields = getFields();

    const action = validateInstruction(instruction);

    if (action) {
        createTable(isCreateTable, table, fields);
        resetError();
    } else {
        setError();
    }
});

btnInsert.addEventListener("click", (e) => {
    e.preventDefault();

    let semicolon = validateSemicolon();

    if (!semicolon) {
        return;
    }

    if (!input.value.toUpperCase().includes("INSERT INTO")) {
        setError();
    } else {
        resetError();
    }

    let instruction = getInstruction();
    let table = getTable();
    let fields = getFieldsInsert();
    let valores = getValues();

    let value = getValue();
    const action = validateInstruction(instruction);

    if (value && action) {
        createRow(table, fields, valores);
    }

    input.value = "";

    return;
});

btnClear.addEventListener("click", () => {});

function createRow(table, fields, valores) {
    let string = h1.textContent.split(" ")[1];
    string = string.replace(/"/g, "");

    let campos = fields.split(" ");

    for (let i = 0; i < campos.length; i++) {
        let child = document.querySelector(`.${campos[i]}`);
        try {
            if (campos[i] !== child.getAttribute("class")) {
                resetError();
                return;
            }
        } catch (erro) {
            setError();
            return;
        }
    }

    if (string === table) {
        let tr = document.createElement("tr");

        let campos = valores.split(" ");

        for (let i = 0; i < campos.length; i++) {
            let td = document.createElement("td");
            td.innerText = campos[i].replace(/'/g, "");
            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    }
}

function validateInstruction(instruction) {
    if (instruction.length == 2) {
        if (
            instruction[0].toUpperCase() == "CREATE" &&
            instruction[1].toUpperCase() == "TABLE"
        ) {
            return true;
        } else if (
            instruction[0].toUpperCase() == "INSERT" &&
            instruction[1].toUpperCase() == "INTO"
        ) {
            return true;
        }
    }

    return false;
}

function createTable(isCreate, table, fields) {
    if (isCreate) {
        return;
    }

    let thead = document.querySelector("thead");
    let tr = document.createElement("tr");
    h1.innerText = "Tabela: " + '"' + table + '"';

    const campos = fields.split(" ");

    for (let i = 0; i < campos.length; i++) {
        let th = document.createElement("th");
        th.classList.add(campos[i]);
        th.innerText = campos[i];
        tr.appendChild(th);
    }

    thead.appendChild(tr);

    isCreateTable = true;
    input.value = "";
}

function splitString() {
    let sql = input.value;
    let values = [];

    values = sql.split(" ");

    return values;
}

function getInstruction() {
    let values = splitString();

    let instruction = [];
    instruction.push(values[0], values[1]);

    return instruction;
}

function getTable() {
    let values = splitString();

    let table = values[2];

    return table;
}

function getFields() {
    let values = splitString();

    let fields = values[3];

    let fieldsSepareted = fields.replace(/,/g, " ");
    fieldsSepareted = fieldsSepareted.replace("(", "");
    fieldsSepareted = fieldsSepareted.replace(")", "");
    fieldsSepareted = fieldsSepareted.replace(";", "");

    return fieldsSepareted;
}

function getValue() {
    let values = splitString();

    let value = values[4];

    if (value.toUpperCase() === "VALUES") {
        resetError();
        return true;
    }

    setError();
    return false;
}

function getFieldsInsert() {
    let values = splitString();

    let fields = values[3];

    let fieldsSepareted = fields.replace(/,/g, " ");
    fieldsSepareted = fieldsSepareted.replace("(", "");
    fieldsSepareted = fieldsSepareted.replace(")", "");
    fieldsSepareted = fieldsSepareted.replace(";", "");

    return fieldsSepareted;
}

function getValues() {
    let values = splitString();

    let fields = values[5];

    try {
        let fieldsSepareted = fields.replace(/,/g, " ");
        fieldsSepareted = fieldsSepareted.replace("(", "");
        fieldsSepareted = fieldsSepareted.replace(")", "");
        fieldsSepareted = fieldsSepareted.replace(";", "");

        resetError();

        return fieldsSepareted;
    } catch (erro) {
        setError();
    }
}

function validateSemicolon() {
    let semicolon = input.value.includes(";");

    if (semicolon) {
        resetError();
        return true;
    } else {
        setError();
        return false;
    }
}

function setError() {
    error.innerText = "Erro!";
    error.style.color = "red";
    error.style.fontWeight = "600";
    error.style.fontSize = "1.8rem";
    error.style.marginTop = "10px";
}

function resetError() {
    error.innerText = "";
}
