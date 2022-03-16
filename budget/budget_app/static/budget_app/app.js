// console.log('app.js is loading')
console.log(replacement_objects_json)
// console.log(failure_fields)

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
const failure_fieldset = form.querySelector("#failure_fieldset");
const main_failure_container = failure_fieldset.querySelector("#main_failure_container");
let last_failure_container_id = -1;
const replacementOptionsPointers = []
const dynamic_vehicle_data = {
    "vehicle_type": null,
    "car_types": null,
    "car_doors": null,
    "bike_engine_size": null,
}

function getDynamicWebSelects() {
    const dynamicWebSelects = {}
    for (const currentDymanicVehicleDataName in dynamic_vehicle_data) {
        dynamicWebSelects[currentDymanicVehicleDataName] = form.
        querySelector(`#id_${currentDymanicVehicleDataName}`);
    }
    return dynamicWebSelects;
}

const dynamicWebSelects = getDynamicWebSelects();

function addEventsToDynamicWebSelects() {
    for (const currentDynamicWebSelectName in dynamicWebSelects) {
        const currentDynamicWebSelect = dynamicWebSelects[currentDynamicWebSelectName];
        currentDynamicWebSelect.addEventListener('change', (event) => {
            dynamic_vehicle_data[currentDynamicWebSelectName] = event.target.value;
            console.log(dynamic_vehicle_data);
        });
    }
}

addEventsToDynamicWebSelects()

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

function getAvailableReplacements() {
    const { 
        availableReplacementImportedStatus, availableReplacementSize
    } = getAvailableReplacementsData();
    const availableReplacements = replacementCategories[`${availableReplacementImportedStatus}_${availableReplacementSize}`];
    return availableReplacements;
}
function getReplacementOptions() {
    const availableRemplacements = getAvailableReplacements()
}

function getReplacementsFieldContainer(parentId) {
    const replacement_options = getReplacementOptions();
    const replacements_select = getCustomWebElement(
        webElementType="select",
        attributes={
            "name": "field_container",
            "id": "",
        },
        children=[],
    );
    replacements_select.multiple = true
    const field_container = getCustomWebElement(
        webElementType="div",
        attributes={
            "class": "field_container"
        },
        children=[],
    );
}

function getFailureFieldContainers(parentId, failure_fields) {
    const failure_field_containers = [];
    for (const fieldName of failure_fields) {
        if (fieldName != 'id') {
            const field_id = `id__${parentId}_${fieldName}`
            const input = getCustomWebElement(
                webElementType="input",
                attributes={
                    "type": "text",
                    "name": fieldName,
                    "id": field_id,
                },
            );
            const label = getCustomWebElement(
                webElementType="label",
                attributes={
                    "for": field_id,
                },
                children=[],
                text=capitalizeFirstLetter(fieldName),
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
    // failure_field_containers.push(replacements_field_container);
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

function addFailureContainer(last_failure_container_id, main_failure_container, failure_fields) 
{
    last_failure_container_id++;
    const currentFailureContainer = getFailureContainer(
        id=toString(last_failure_container_id), failure_fields
    );
    main_failure_container.appendChild(currentFailureContainer);
}

function addFailureContainerPusherButton(
    last_failure_container_id, main_failure_container, failure_fields, failure_fieldset, 
) {
    const failureContainerPusherButton = failure_fieldset.querySelector("#pusher_button")
    failureContainerPusherButton.addEventListener('click', () => {
        addFailureContainer(last_failure_container_id, main_failure_container, failure_fields);
    });
}

addFailureContainer(last_failure_container_id, main_failure_container, failure_fields);
addFailureContainerPusherButton(
    last_failure_container_id, main_failure_container, failure_fields, failure_fieldset
);