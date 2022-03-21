// replacement_objects_json
// [
//     {
//         "model": "budget_app.replacement",
//         "pk": 1,
//         "fields": {
//             "importado": true,
//             "nombre": "Motor",
//             "precio": 947,
//             "size": "L"
//         }
//     }, 
//     {},
// ]

const form = document.getElementById("vehicle_form");
const enumerator = document.getElementById("enumerator");
const failures_section = enumerator.querySelector("#failures")
const failure_fieldset = form.querySelector("#failure_fieldset");
const main_failure_container = failure_fieldset.querySelector("#main_failure_container");
let last_failure_container_id = -1;
const replacementOptionsPointers = []
const vehicle_dynamic_data = {
    "marca": null,
    "modelo": null,
    "patente": null,
    "vehicle_type": null,
    "car_types": null,
    "car_doors": null,
    "bike_engine_size": null,
}

function getDynamicWebInputs(vehicle_dynamic_data, failureContainerParent_id=null) {
    const dynamicWebInputs = {}
    if (failureContainerParent_id==null) {
        for (const currentDymanicVehicleDataName in vehicle_dynamic_data) {
            dynamicWebInputs[currentDymanicVehicleDataName] = form.
            querySelector(`#id_${currentDymanicVehicleDataName}`);
        }
    } else {
        for (const currentDymanicVehicleDataName in vehicle_dynamic_data) {
            dynamicWebInputs[currentDymanicVehicleDataName] = form.
            querySelector(`#id_${failureContainerParent_id}_${currentDymanicVehicleDataName}`);
        }
    }
    
    return dynamicWebInputs;
}

const dynamicWebInputs = getDynamicWebInputs(vehicle_dynamic_data, null);

const generic_specifications = form.querySelector("#generic_specifications");
const car_specifications = form.querySelector("#car_specifications");
const bike_specifications = form.querySelector("#bike_specifications");
const failureContainerPusherButton = failure_fieldset.querySelector("#pusher_button")
const submit_button = form.querySelector("#submit_button")
const fieldsets = [
    generic_specifications, car_specifications, bike_specifications, failure_fieldset, 
    submit_button
];

for (const fieldSet of fieldsets) {
    fieldSet.disabled=true;
}

let optionsSet;

function checkForChangesHelper(parentParameters) {
    let shallDisableFailureField = false;
    optionsSet = new Set([null, ""]);
    for (const fieldName of parentParameters) {
        if (optionsSet.has(vehicle_dynamic_data[fieldName])) {
            shallDisableFailureField = true;
            break;
        }
    }
    failure_fieldset.disabled = shallDisableFailureField;
    submit_button.disabled = shallDisableFailureField;
    if (!(shallDisableFailureField)) {
        optionsSet = new Set([null, '']);
        let shallDisableSubmitButton = false;
        for (let idx=0; idx<failure_dynamic_data.length; idx++) {
            for (const fieldName in failure_dynamic_data[idx]) {
                const currentFieldValue = failure_dynamic_data[idx][fieldName];
                if (fieldName == 'replacements') {
                    if (currentFieldValue.length == 0) {
                        shallDisableSubmitButton = true;
                        break;
                    }
                } else if (optionsSet.has(currentFieldValue)) {
                    shallDisableSubmitButton = true;
                    break;
                }
            }
            submit_button.disabled = shallDisableSubmitButton;
        }
    }
}

function checkForChanges() {
    optionsSet = new Set(['none', null]);
    if (optionsSet.has(vehicle_dynamic_data['vehicle_type'])) {
        for (const fieldSet of fieldsets) {
            fieldSet.disabled=true;
        }
    } else if (vehicle_dynamic_data['vehicle_type'] == 'bike') {
        generic_specifications.disabled = false;
        car_specifications.disabled = true;
        bike_specifications.disabled = false;
        checkForChangesHelper(["marca", "modelo", "patente", "bike_engine_size"]);
    } else if (vehicle_dynamic_data['vehicle_type'] == 'car') {
        generic_specifications.disabled = false;
        bike_specifications.disabled = true;
        car_specifications.disabled = false;
        checkForChangesHelper(["marca", "modelo", "patente", "car_types", "car_doors"]);
    }
}

function addEventsToDynamicWebInputs() {
    for (const currentDynamicWebInputName in dynamicWebInputs) {
        const currentDynamicWebInput = dynamicWebInputs[currentDynamicWebInputName];
        currentDynamicWebInput.addEventListener('change', (event) => {
            vehicle_dynamic_data[currentDynamicWebInputName] = event.target.value;
            checkForChanges();
            const replacementOptionsRelatedInputs = new Set(
                ["bike_engine_size", "car_types"]
            );
            if (replacementOptionsRelatedInputs.has(currentDynamicWebInputName)) {
                updateReplacementOptions();
            }
        });
    }
}

addEventsToDynamicWebInputs()

function getFailureFieldNames() {
    const failureFieldNames = ['descripcion', 'mano_de_obra', 'tiempo_dias', 'replacements'];
    return failureFieldNames;
}
const failureFieldNames = getFailureFieldNames()

const failure_dynamic_data = [];

function appendIndexToFailureDynamicData() {
    for (let i=failure_dynamic_data.length; i<=last_failure_container_id; i++) {
        failure_dynamic_data[i] = {};
        for (const fieldName of failureFieldNames) {
            if (fieldName == 'replacements') {
                failure_dynamic_data[i][fieldName] = [];
            } else {
                failure_dynamic_data[i][fieldName] = null;
            }
        }
    }
    return failure_dynamic_data;
}

function getFailureWebInputsList() {
    const failureWebInputsList = [];
    for (let i=0; i<failure_dynamic_data.length; i++) {
        failureWebInputsList[i] = getDynamicWebInputs(
            failure_dynamic_data[i], i
        );
    }
    return failureWebInputsList;
}

const totalParkingCostElement = enumerator.querySelector("#total_parking_cost");
const totalWorkingCostElement = enumerator.querySelector("#total_working_cost");
const totalReplacementsCostElement = enumerator.querySelector("#total_replacements_cost");
const totalBaseElement = enumerator.querySelector("#total_base");
const totalElement = enumerator.querySelector("#total");

function updateTotalBudget() {
    optionsSet = new Set([null, "", "0", " "]);
    let totalFailureParkingDays = 0;
    let totalWorkingCost = 0;
    let totalReplacementCost = 0;
    for (let i=0; i<failureSectionDataPointers.length; i++) {
        for (const currentField of ["tiempo_dias", "replacements", "mano_de_obra"]) {
            if (optionsSet.has(failureSectionDataPointers[i][currentField].textContent)) {
                return;
            }
        } 
        const currentFailureParkingDays = parseInt(
            failureSectionDataPointers[i]["tiempo_dias"].textContent
        );
        const currentWorkingCost = parseInt(
            failureSectionDataPointers[i]["mano_de_obra"].textContent
        );
        const currentReplacementsCost = parseInt(
            failureSectionDataPointers[i]["replacements"].textContent
        );
        totalFailureParkingDays += currentFailureParkingDays;
        totalWorkingCost += currentWorkingCost;
        totalReplacementCost += currentReplacementsCost;
    }
    const totalParkingCost = totalFailureParkingDays * 130;
    totalParkingCostElement.textContent = totalParkingCost.toString();
    totalWorkingCostElement.textContent = totalWorkingCost.toString();
    totalReplacementsCostElement.textContent = totalReplacementCost.toString();
    const totalBaseCost = totalParkingCost + totalWorkingCost + totalReplacementCost;
    totalBaseElement.textContent = totalBaseCost.toString();
    const totalCost = totalBaseCost + totalBaseCost * 0.1
    totalElement.textContent = totalCost.toString();
}

let failureWebInputsList = getFailureWebInputsList();
function addEventsToFailureWebInputsList() {
    for (let i=0; i<failureWebInputsList.length; i++) {
        const currentFailureWebInputs = failureWebInputsList[i];
        for (const failureFieldName in currentFailureWebInputs) {
            const currentWebInput = currentFailureWebInputs[failureFieldName];
            currentWebInput.addEventListener('change', (event) => {
                if (failureFieldName == 'replacements') {
                    const currentSelectOptions = event.target.options;
                    const currentSelectedOptionsValue = []
                    for (const currentOption of currentSelectOptions) {
                        if (currentOption.selected) {
                            currentSelectedOptionsValue.push(currentOption.value);
                        }
                    }
                    failure_dynamic_data[i][failureFieldName] = currentSelectedOptionsValue;
                    let currentFailureReplacementsAmountToPay = 0;
                    const selected_replacements_pk = new Set(currentSelectedOptionsValue.map(value => parseInt(value)));
                    for (const currentReplacement of replacement_objects_json) {
                        if (selected_replacements_pk.has(currentReplacement.pk)) {
                            currentFailureReplacementsAmountToPay += currentReplacement.fields.precio;
                        }
                    }
                    failureSectionDataPointers[i][failureFieldName].textContent = currentFailureReplacementsAmountToPay.toString(); 
                } else {
                    failure_dynamic_data[i][failureFieldName] = event.target.value;
                    failureSectionDataPointers[i][failureFieldName].textContent = event.target.value;
                    
                }
                updateTotalBudget();
                checkForChanges();
            });
        }
    }
}

function updateFailureDynamicDataAndInputs() {
    appendIndexToFailureDynamicData();
    failureWebInputsList = getFailureWebInputsList();
    addEventsToFailureWebInputsList();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getCustomWebElement(
    webElementType, attributes={}, children=[], text=null
) 
{
    const customWebElement = document.createElement(webElementType);
    for (const current_attr_name in attributes) {
        if (current_attr_name == "class" && Array.isArray(attributes[current_attr_name])) 
        {
            for (const current_attr_value of attributes[current_attr_name]) {
                customWebElement.classList.add(current_attr_value);
            }
        } else {
            const current_attr_value = attributes[current_attr_name];
            if (current_attr_name == "class") {
                customWebElement.classList.add(current_attr_value);
            }
            customWebElement.setAttribute(current_attr_name, current_attr_value);
        }
    }
    if (text !== null) {
        const currentTextNode = document.createTextNode(text);
        children.push(currentTextNode);
    }
    for (const currentChild of children) {
        customWebElement.appendChild(currentChild);
    }
    return customWebElement;
}

const hiddenInput = form.querySelector("#id_failure_counter");
hiddenInput.style.display = 'none';

function isCurrentReplacementObjectValid(currentReplacementObject, importedStatus, size) {
    return currentReplacementObject.fields.importado == importedStatus && currentReplacementObject.fields.size == size;
}

function getReplacementCategories() {
    const replacementCategories = {}
    for (const isImported of [true, false]) {
        const importado = isImported == true ? "importado" : "nacional"
        for (const size of ["S", "M", "L"]) {
            const currentCategorieReplacements = []
            for (const currentReplacementObject of replacement_objects_json) {
                if (isCurrentReplacementObjectValid(currentReplacementObject, isImported, size)) 
                {
                    currentCategorieReplacements.push(currentReplacementObject);
                }
            }
            replacementCategories[`${importado}_${size}`] = currentCategorieReplacements;
        }
    }
    return replacementCategories
}

const replacementCategories = getReplacementCategories();

function getBikeEngineSize(bikeEngineSizeString) {
    return parseInt(bikeEngineSizeString.split(' ')[0]);
}

function getAvailableReplacementsData() {
    let availableReplacementImportedStatus, availableReplacementSize;
    if (vehicle_dynamic_data["vehicle_type"] == "bike") {
        availableReplacementImportedStatus = false;
        availableReplacementSize = vehicle_dynamic_data["bike_engine_size"];
    } else if (vehicle_dynamic_data["vehicle_type"] == "car") {
        const carType = vehicle_dynamic_data["car_types"];
        if (carType !== null) {
            availableReplacementImportedStatus = carType == "LJ" ? true : false;
            const smallCarTypes = new Set(["CM", "MV"]);
            const mediumCarTypes = new Set(["SD", "LJ"]);
            if (smallCarTypes.has(carType)) {
                availableReplacementSize = "S";
            } else if (mediumCarTypes.has(carType)) {
                availableReplacementSize = "M";
            } else if (carType == 'UT') {
                availableReplacementSize = "L";
            }
        }
    }
    return [availableReplacementImportedStatus, availableReplacementSize];
}

function getAvailableReplacements() {
    const availableReplacementsData = getAvailableReplacementsData();
    let availableReplacementImportedStatus = availableReplacementsData[0];
    let availableReplacementSize = availableReplacementsData[1];
    if (availableReplacementImportedStatus == null || availableReplacementSize == null) {
        return replacement_objects_json;
    }
    const importedStatus = availableReplacementImportedStatus == true ? 'importado' : 'nacional';
    const availableReplacements = replacementCategories[
        `${importedStatus}_${availableReplacementSize}`
    ];
    return availableReplacements;
}
function getReplacementOptions() {
    const availableReplacements = getAvailableReplacements();
    const replacementOptions = [];
    for (const currentReplacementData of availableReplacements) {
        const replacementTitle = getCustomWebElement(
            webElementType="span",
            attributes={
                "class": "replacement_title",
            },
            children=[],
            text=currentReplacementData.fields.nombre,
        );
        const replacementImportedSpan = getCustomWebElement(
            webElementType="span",
            attributes={
                "class": "imported_span",
            },
            children=[],
            text=currentReplacementData.fields.importado === true ? " - Origen importado" : " - Origen nacional",
        );
        const replacementSizeSpan = getCustomWebElement(
            webElementType="span",
            attributes={
                "class": "size_span",
            },
            children=[],
            text=` - Tamaño ${currentReplacementData.fields.size}`,
        );
        const replacementInfoContainer = getCustomWebElement(
            webElementType="div",
            attributes={
                "class": "info_container",
            },
            children=[replacementImportedSpan, replacementSizeSpan],
        );
        const currentReplacementOption = getCustomWebElement(
            webElementType="option",
            attributes={
                "class": "replacement_option",
                "value": currentReplacementData.pk,
            },
            children=[replacementTitle, replacementInfoContainer]
        );
        replacementOptions.push(currentReplacementOption);
    }
    return replacementOptions;
}
const replacementSelectList = []
function getReplacementsFieldContainer(parentId) {
    const field_id = `id_${parentId}_replacements`
    const replacements_label = getCustomWebElement(
        webElementType="label",
        attributes={
            "for": field_id,
        },
        children=[],
        text="Repuestos"
    );
    const replacements_select = getCustomWebElement(
        webElementType="select",
        attributes={
            "class": "replacements_select",
            "name": `${parentId}_field_container`,
            "id": field_id,
        },
        children=getReplacementOptions(),
    );
    replacements_select.multiple = true
    replacementSelectList.push(replacements_select);
    
    const field_container = getCustomWebElement(
        webElementType="div",
        attributes={
            "class": "field_container"
        },
        children=[replacements_label, replacements_select],
    );
    return field_container;
}

function getFailureFieldContainers(parentId, failure_fields) {
    const field_container_title = getCustomWebElement(
        'h4',
        {},
        [],
        `Desperfecto ${(parseInt(parentId) + 1).toString()}`
    );
    const failure_field_containers = [field_container_title];
    for (const fieldName of failure_fields) {
        if (fieldName != 'id') {
            const field_id = `id_${parentId}_${fieldName}`
            let input;
            if (fieldName == 'descripcion') {
                input = getCustomWebElement(
                    webElementType="input",
                    attributes={
                        "type": "text",
                        // "name": `${parentId}_${fieldName}`,
                        "name": fieldName,
                        "id": field_id,
                    },
                );
            } else {
                input = getCustomWebElement(
                    webElementType="input",
                    attributes={
                        "type": "number",
                        "name": `${parentId}_${fieldName}`,
                        "id": field_id,
                    },
                );
            }
            
            const label = getCustomWebElement(
                webElementType="label",
                attributes={
                    "for": field_id,
                },
                children=[],
                text=`${capitalizeFirstLetter(fieldName.replace(/_/g, " "))} `,
            );
            const field_container = getCustomWebElement(
                webElementType="div",
                attributes={
                    "class": "field_container"
                },
                children=[label, input],
            );
            failure_field_containers.push(field_container);
        }
    }
    const replacements_field_container = getReplacementsFieldContainer(parentId);
    failure_field_containers.push(replacements_field_container);
    return failure_field_containers;
}

function getFailureContainer(id="", failure_fields) {
    const failure_field_containers = getFailureFieldContainers(id, failure_fields);
    const failureContainer = getCustomWebElement(
        webElementType="div", 
        attributes={
            "class": "failure_container",
            "id": `id_${id}_failure_container`
        },
        children=failure_field_containers,
    );

    return failureContainer
}

const failureSectionDataPointers = [];

function addFailureSectionToEnumerator(parentId) {
    const failureSectionId = `id_fs_${parentId}`
    const sectionTitle = getCustomWebElement(
        'h4',
        {},
        [],
        `Desperfecto ${(parseInt(parentId) + 1).toString()}`
    );
    const failureDescription = getCustomWebElement(
        'span',
        {
            'id': `${failureSectionId}_descripcion`
        }
    );
    const workersCostTitle = getCustomWebElement(
        'span',
        {},
        [],
        "Costo mano de obra:"
    );
    const workersCost = getCustomWebElement(
        'span',
        {
            'id': `${failureSectionId}_mano_de_obra`
        }
    );
    const parkingCostTitle = getCustomWebElement(
        'span',
        {},
        [],
        "Costo por estacionamiento (día*130):"
    );
    const tiempoDias = getCustomWebElement(
        'span',
        {
            'id': `${failureSectionId}_tiempo_dias`
        }
    );
    const replacementsCostTitle = getCustomWebElement(
        'span',
        {},
        [],
        "Costo de los repuestos:"
    );
    const replacementsCost = getCustomWebElement(
        'span',
        {
            'id': `${failureSectionId}_replacements`
        }
    );
    const failureSectionContainer = getCustomWebElement(
        'div',
        {
            'id': `${failureSectionId}_container`,
            'class': 'container'
        },
        [
            sectionTitle, failureDescription, workersCostTitle, workersCost, 
            parkingCostTitle, tiempoDias, replacementsCostTitle, replacementsCost
        ]
    );
    failureSectionDataPointers[parentId] = {
        'descripcion': failureDescription,
        'mano_de_obra': workersCost,
        'tiempo_dias': tiempoDias,
        'replacements': replacementsCost,
    }
    failures_section.appendChild(failureSectionContainer);
}

function addFailureContainer() 
{
    last_failure_container_id++;
    const parentId = last_failure_container_id.toString();
    const currentFailureContainer = getFailureContainer(
        id=parentId, failure_fields
    );
    main_failure_container.appendChild(currentFailureContainer);
    addFailureSectionToEnumerator(parentId);
    updateFailureDynamicDataAndInputs();
    checkForChanges();
    let hiddenInputNewValue = last_failure_container_id + 1;
    hiddenInputNewValue = hiddenInputNewValue.toString()
    hiddenInput.setAttribute('value', hiddenInputNewValue);
    hiddenInput.textContent = hiddenInputNewValue
}

function addFailureContainerPusherButton() {
    failureContainerPusherButton.addEventListener('click', () => {
        addFailureContainer();
    });
}

function updateReplacementOptions() {
    for (const currentReplacementSelect of replacementSelectList) {
        const newOptions = getReplacementOptions();
        currentReplacementSelect.replaceChildren(...newOptions);
    }
}

addFailureContainer();
addFailureContainerPusherButton();
