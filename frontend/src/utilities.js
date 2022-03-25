function getModelDataStructure(modelFields, modelName) {
    const currentModelDataStructure = {}
    for (const currentFieldName of modelFields[modelName]) {
        currentModelDataStructure[currentFieldName] = null
    }
    if (modelName == "desperfecto") {
        currentModelDataStructure['repuestos'] = []
    } else if (modelName == "vehiculo") {
        currentModelDataStructure['tipo'] = null
    }
    return currentModelDataStructure
}

function getFormDataStructure(modelFields) {
    const formData = {}
    const specialModels = new Set(["repuesto", "desperfecto"])
    for (const currentModelName in modelFields) {
        if (specialModels.has(currentModelName)) {
            continue
        }
        formData[currentModelName] = getModelDataStructure(
            modelFields, currentModelName
        )
    }
    formData['desperfectos'] = [getModelDataStructure(modelFields, 'desperfecto')]
    return formData
}

async function fetch_and_set(url, setFunction) {
    const response = await fetch(url);
    const responseData = await response.json();
    setFunction(responseData);
}

function addFailure(formData, setFormData, modelFields) {
    const newFailures = formData.desperfectos.slice();
    newFailures.push(getModelDataStructure(modelFields, 'desperfecto'))
    setFormData((prevFormData) => ({
        ...prevFormData,
        "desperfectos": newFailures
    }))
}

function isSomeFieldsetEmpty(modelName, fieldsetRequiredFields, nullValues, formData) {
    for (const currentFieldName of fieldsetRequiredFields) {
        if (nullValues.has(formData[modelName][currentFieldName])) {
            return true
        }
    }
    return false
}

function isGenericFieldsetEmpty(genericRequiredFields, nullValues, formData) {
    return isSomeFieldsetEmpty("vehiculo", genericRequiredFields, nullValues, formData)
}

function isDesperfectoFieldsetEmpty(desperfectoRequiredFields, nullValues, formData) {
    for (const currentDesperfecto of formData.desperfectos) {
        for (const currentFieldName of desperfectoRequiredFields) {
            if (nullValues.has(currentDesperfecto[currentFieldName])) {
                return true
            }
        }
    }
    return false
}

function updateFieldsetDisableStatus(
    modelFields, formData, setGenericFieldsetDisabled, setBikeFieldsetDisabled, 
    setCarFieldsetDisabled, setFailureFieldsetDisabled, setSubmitButtonDisabled
) {
    const genericRequiredFields = modelFields.vehiculo
    const nullValues = new Set([null, "none", "", " "])
    let shallDisableGenericFieldset = true
    let shallDisableBikeFieldset = true
    let shallDisableCarFieldset = true
    let shallDisableFailureFieldset = true
    let shallDisableSubmitButton = true
    if (formData.vehiculo.tipo == "bike") {
        shallDisableGenericFieldset = false
        shallDisableBikeFieldset = false
        shallDisableCarFieldset = true
        shallDisableFailureFieldset = isGenericFieldsetEmpty(
            genericRequiredFields, nullValues, formData
        ) || isSomeFieldsetEmpty(
            "moto", ["cilindrada"], nullValues, formData
        )
        if (!(shallDisableFailureFieldset)) {
            shallDisableSubmitButton = isDesperfectoFieldsetEmpty(
                modelFields.desperfecto, nullValues, formData
            )
        }
    } else if (formData.vehiculo.tipo == "car") {
        shallDisableGenericFieldset = false
        shallDisableBikeFieldset = true
        shallDisableCarFieldset = false
        shallDisableFailureFieldset = isGenericFieldsetEmpty(
            genericRequiredFields, nullValues, formData
        ) || isSomeFieldsetEmpty(
            "automovil", ["cantidad_puertas", "tipo"], nullValues, formData
        )
        if (!(shallDisableFailureFieldset)) {
            shallDisableSubmitButton = isDesperfectoFieldsetEmpty(
                modelFields.desperfecto, nullValues, formData
            )
        }
    }
    setGenericFieldsetDisabled(shallDisableGenericFieldset)
    setBikeFieldsetDisabled(shallDisableBikeFieldset)
    setCarFieldsetDisabled(shallDisableCarFieldset)
    setFailureFieldsetDisabled(shallDisableFailureFieldset)
    setSubmitButtonDisabled(shallDisableSubmitButton)
}

function getReplacementsCost(selectedReplacements, replacements) {
    let replacementsCost = 0
    for (const currentSelectedReplacementUrl of selectedReplacements) {
        for (const currentReplacement of replacements) {
            if (currentReplacement.url == currentSelectedReplacementUrl) {
                replacementsCost += currentReplacement.precio
            }
        }
    }
    return replacementsCost
}

function updateFailureCosts(failures, setFailureCosts, replacements) {
    let totalReplacementsCost = 0
    let totalWorkingCost = 0
    let totalParkingCost = 0
    for (const currentFailure of failures) {
        totalReplacementsCost += getReplacementsCost(currentFailure.repuestos, replacements)
        totalWorkingCost += currentFailure["mano_de_obra"]
        totalParkingCost += currentFailure["tiempo_dias"] * 130
    }
    setFailureCosts((prevFailureCosts) => ({
        ...prevFailureCosts,
        "replacements": totalReplacementsCost,
        "working": totalWorkingCost,
        "parking": totalParkingCost
    }))
}

function getTotalCost(failureCosts) {
    return failureCosts.working + failureCosts.parking + failureCosts.replacements
}

async function makePostRequest(url, data) {
  const response = await fetch(
    url, 
    {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  )
  const responseData = await response.json();
  return responseData
}

async function submitButtonHandler(formData) {
    const currentFailuresUrls = []
    for (const currentFailure of formData.desperfectos) {
        const failureResponse = await makePostRequest(
            'http://127.0.0.1:8000/desperfecto/', currentFailure
        )
        currentFailuresUrls.push(failureResponse.url)
    }
    const vehicleData = {}
    for (const currentFieldName in formData.vehiculo) {
        if (currentFieldName != "tipo") {
            vehicleData[currentFieldName] = formData.vehiculo[currentFieldName]
        }
    }
    let vehicleResponse;
    if (formData.vehiculo.tipo == "car") {
        vehicleData["tipo"] = formData.automovil.tipo
        vehicleData["cantidad_puertas"] = formData.automovil.cantidad_puertas
        vehicleData["desperfectos"] = currentFailuresUrls
        vehicleResponse = await makePostRequest(
            'http://127.0.0.1:8000/automovil/', vehicleData
        )
    } else if (formData.vehiculo.tipo == "bike") {
        vehicleData["cilindrada"] = formData.moto.cilindrada
        vehicleData["desperfectos"] = currentFailuresUrls
        vehicleResponse = await makePostRequest(
            'http://127.0.0.1:8000/moto/', vehicleData
        )
    }
    debugger;
}