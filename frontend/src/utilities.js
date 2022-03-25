export function getModelDataStructure(modelFields, modelName) {
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

export function getFormDataStructure(modelFields) {
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

export async function fetch_and_set(url, setFunctionList) {
    const response = await fetch(url);
    const responseData = await response.json();
    for (const setFunction of setFunctionList) {
        setFunction(responseData);
    }
}

export function addFailure(formData, setFormData, modelFields) {
    const newFailures = formData.desperfectos.slice();
    newFailures.push(getModelDataStructure(modelFields, 'desperfecto'))
    setFormData((prevFormData) => ({
        ...prevFormData,
        "desperfectos": newFailures
    }))
}

export function isSomeFieldsetEmpty(modelName, fieldsetRequiredFields, nullValues, formData) {
    for (const currentFieldName of fieldsetRequiredFields) {
        if (nullValues.has(formData[modelName][currentFieldName])) {
            return true
        }
    }
    return false
}

export function isGenericFieldsetEmpty(genericRequiredFields, nullValues, formData) {
    return isSomeFieldsetEmpty("vehiculo", genericRequiredFields, nullValues, formData)
}

export function isDesperfectoFieldsetEmpty(desperfectoRequiredFields, nullValues, formData) {
    for (const currentDesperfecto of formData.desperfectos) {
        for (const currentFieldName of desperfectoRequiredFields) {
            if (nullValues.has(currentDesperfecto[currentFieldName])) {
                return true
            }
        }
    }
    return false
}

function isReplacementMatch(replacement, neededImportedStatus, neededSize) {
    return replacement.importado == neededImportedStatus && replacement.size == neededSize
}

function updateReplacements(perpetualReplacements, setReplacements, formData) {
    let isVehicleImported = false;
    let vehicleSize = "M";
    switch (formData.vehiculo.tipo) {
        case "car":
            switch (formData.automovil.tipo) {
                case "LJ":
                    isVehicleImported = true
                    break
                case "MV":
                    vehicleSize = "S"
                    break
                case  "CM":
                    vehicleSize = "S"
                    break
                case "UT":
                    vehicleSize = "L"
                    break
            }
            break
        case "bike":
            vehicleSize = formData.moto.cilindrada
    }
    setReplacements(() => (
        perpetualReplacements.filter(
            (currentReplacement) => isReplacementMatch(
                currentReplacement, isVehicleImported, vehicleSize
            )
        )
    ))
}

export function updateFieldsetDisableStatus(
    modelFields, formData, setGenericFieldsetDisabled, setBikeFieldsetDisabled, 
    setCarFieldsetDisabled, setFailureFieldsetDisabled, setSubmitButtonDisabled,
    setReplacements, perpetualReplacements
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
    } else if (formData.vehiculo.tipo == "car") {
        shallDisableGenericFieldset = false
        shallDisableBikeFieldset = true
        shallDisableCarFieldset = false
        shallDisableFailureFieldset = isGenericFieldsetEmpty(
            genericRequiredFields, nullValues, formData
        ) || isSomeFieldsetEmpty(
            "automovil", ["cantidad_puertas", "tipo"], nullValues, formData
        )
    }
    if (!(shallDisableFailureFieldset)) {
        updateReplacements(perpetualReplacements, setReplacements, formData)
        shallDisableSubmitButton = isDesperfectoFieldsetEmpty(
            modelFields.desperfecto, nullValues, formData
        )
    }
    setGenericFieldsetDisabled(shallDisableGenericFieldset)
    setBikeFieldsetDisabled(shallDisableBikeFieldset)
    setCarFieldsetDisabled(shallDisableCarFieldset)
    setFailureFieldsetDisabled(shallDisableFailureFieldset)
    setSubmitButtonDisabled(shallDisableSubmitButton)
}

export function getReplacementsCost(selectedReplacements, replacements) {
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

export function updateFailureCosts(failures, setFailureCosts, replacements) {
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

export function getTotalCost(failureCosts) {
    return failureCosts.working + failureCosts.parking + failureCosts.replacements
}

// const response = await fetch(
//     'http://127.0.0.1:8000/desperfecto/', 
//     {
//         method: "POST",
//         headers: {
//         'Accept': 'application/json, text/plain, */*',
//         'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//         "descripcion": "hey",
//         "mano_de_obra": 4,
//         "tiempo_dias": 5,
//         "repuestos": ["http://127.0.0.1:8000/repuesto/7/"]
//         })
//     }
// )
// const responseData = await response.json();

// console.log(responseData) = {
//     cilindrada: "S"
//     desperfectos: ['http://127.0.0.1:8000/desperfecto/18/']
//     marca: "Yamaha"
//     modelo: "X32"
//     patente: "ASD783"
//     url: "http://127.0.0.1:8000/moto/8/"
// }


export async function makePostRequest(url, data) {
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

export async function submitButtonHandler(formData, setBoxDisplay, navigate) {
    setBoxDisplay(true)
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
    vehicleResponse = vehicleResponse.url.split("/")
    const vehicle_id = vehicleResponse[vehicleResponse.length - 2]
    debugger;
    navigate(`vehicle/${formData.vehiculo.tipo}/${vehicle_id}`)
    // window.location.reload(true);
}