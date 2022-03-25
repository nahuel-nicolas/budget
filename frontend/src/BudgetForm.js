import React, { useState, useEffect } from 'react'
import FailureContainer from './FailureContainer';

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

const BudgetForm = () => {
    const [modelFields, setModelFields] = useState(null);
    const [replacements, setReplacements] = useState(null);
    const [formData, setFormData] = useState(null)
    const [isGenericFieldsetDisabled, setGenericFieldsetDisabled] = useState(true)
    const [isCarFieldsetDisabled, setCarFieldsetDisabled] = useState(true)
    const [isBikeFieldsetDisabled, setBikeFieldsetDisabled] = useState(true)
    const [isFailureFieldsetDisabled, setFailureFieldsetDisabled] = useState(true)
    const [isSubmitButtonDisabled, setSubmitButtonDisabled] = useState(true)
    const [failureCosts, setFailureCosts] = useState(
        {"replacements": 0, "working": 0, "parking": 0}
    )

    useEffect(() => {
        fetch_and_set('http://127.0.0.1:8000/fields/', setModelFields);
        fetch_and_set('http://127.0.0.1:8000/repuesto/', setReplacements);
    }, [])
    useEffect(() => {
        if (modelFields != null) {
            setFormData(getFormDataStructure(modelFields))
        }
    }, [modelFields]) 
    useEffect(() => {
        if (formData !== null) {
            updateFieldsetDisableStatus(
                modelFields, formData, setGenericFieldsetDisabled, setBikeFieldsetDisabled, 
                setCarFieldsetDisabled, setFailureFieldsetDisabled, setSubmitButtonDisabled
            )
            console.log(formData)
            if (formData.desperfectos) {
                updateFailureCosts(formData.desperfectos, setFailureCosts, replacements)
            }
        }
    }, [formData])

    if (modelFields == null || formData == null || replacements == null) {
        return <h2>Loading...</h2>
    }
    return (
        <div className='budget_form'>
            <form action="" onSubmit={(event) => {event.preventDefault()}}>
                <select 
                    onChange={
                        (event) => setFormData((prevFormData) => ({
                            ...prevFormData,
                            "vehiculo": {
                                ...prevFormData.vehiculo,
                                "tipo": event.target.value
                            }
                        }))
                    }
                    name="vehicle_type" 
                    id="id_vehicle_type"
                    required>
                    <option value="none">Select</option>
                    <option value="bike">Moto</option>
                    <option value="car">Automovil</option>
                </select>
                <fieldset 
                    id="generic_specifications" 
                    disabled={isGenericFieldsetDisabled}
                >
                    {
                        modelFields["vehiculo"].map((field, index) => {
                            return (
                                <div className="field_container" key={index}>
                                    <label htmlFor={`id_${field}`}>{ field }</label>
                                    <input 
                                        onChange={
                                            (event) => setFormData((prevFormData) => ({
                                                ...prevFormData,
                                                "vehiculo": {
                                                    ...prevFormData.vehiculo,
                                                    [field]: event.target.value
                                                }
                                            }))
                                        }
                                        type="text" 
                                        name={field} 
                                        id={`id_${field}`} 
                                    />
                                </div>
                            )
                        })
                    }
                </fieldset>
                <fieldset id="car_specifications" disabled={isCarFieldsetDisabled}>
                    <h4>Especificaciones - Automovil</h4>
                    <div className="field_container">
                        <label htmlFor="car_types">Clase de automovil</label>
                        <select 
                            onChange={
                                (event) => setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    "automovil": {
                                        ...prevFormData.automovil,
                                        "tipo": event.target.value
                                    }
                                }))
                            }
                            name="car_types" 
                            id="id_car_types"
                        >
                            <option value="">Select</option>
                            <option value="CM">Compacto</option>
                            <option value="MV">Monovolumen</option>
                            <option value="SD">Sedan</option>
                            <option value="UT">Utilitario</option>
                            <option value="LJ">Lujo</option>
                        </select>
                    </div>
                    <div className="field_container">
                        <label htmlFor="car_doors">Cantidad de puertas</label>
                        <select 
                            onChange={
                                (event) => setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    "automovil": {
                                        ...prevFormData.automovil,
                                        "cantidad_puertas": parseInt(event.target.value)
                                    }
                                }))
                            }
                            name="car_doors_number" 
                            id="id_car_doors"
                        >
                            <option value="">Select</option>
                            <option value="2">2</option>
                            <option value="4">4</option>
                        </select>
                    </div>
                </fieldset>
                <fieldset id="bike_specifications" disabled={isBikeFieldsetDisabled}>
                    <h4>Especificaciones - Moto</h4>
                    <div className="field_container">
                        <label htmlFor="id_bike_engine_size">Cilindrada</label>
                        <select 
                            onChange={
                                (event) => setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    "moto": {
                                        ...prevFormData.automovil,
                                        "cilindrada": event.target.value
                                    }
                                }))
                            }
                            name="engine_size" 
                            id="id_bike_engine_size"
                        >
                            <option value="">Select</option>
                            <option value="S">125 cc</option>
                            <option value="M">250 cc</option>
                            <option value="L">500 cc</option>
                        </select>
                    </div>
                </fieldset>
                <fieldset id="failure_fieldset" disabled={isFailureFieldsetDisabled}>
                    <div id="main_failure_container" className="container" >
                        {
                            formData.desperfectos.map((desperfecto, index) => {
                                return <FailureContainer 
                                    key={index}
                                    failure_idx={index}
                                    modelFields={modelFields}
                                    replacements={replacements}
                                    setFormData={setFormData}
                                />
                            })
                        }
                    </div>
                    <button 
                        id="pusher_button" 
                        onClick={() => addFailure(formData, setFormData, modelFields)}
                        disabled={isSubmitButtonDisabled} 
                    >
                        +
                    </button>
                </fieldset>
                <input 
                    onClick={() => submitButtonHandler(formData)}
                    type="submit" 
                    value="Guardar datos" 
                    name="submit" 
                    id="submit_button"
                    disabled={isSubmitButtonDisabled} 
                />
            </form>
            <div id="enumerator">
                <div id="failure_costs">
                    {
                        formData.desperfectos.map((desperfecto, index) => {
                            return (
                                <div className="desperfecto_costs" key={index}>
                                    <h4>Desperfecto Nº{index + 1}</h4>
                                    <p>Costo mano de obra: {desperfecto.mano_de_obra}</p>
                                    <p>Dias de estacionamiento: {desperfecto.tiempo_dias}</p>
                                    <p>Costo repuestos: {getReplacementsCost(desperfecto.repuestos, replacements)}</p>
                                </div>
                            )
                        })
                    }
                </div>
                <div id="total_costs">
                    <h4>Costos totales</h4>
                    <p>Costo mano de obra total: {failureCosts.working}</p>
                    <p>Costo estacionamiento total (días x 130): {failureCosts.parking}</p>
                    <p>Costo repuestos total: {failureCosts.replacements}</p>
                    <p>Costo total: {getTotalCost(failureCosts)}</p>
                    <p>Presupuesto final incluyendo ganancia taller: {getTotalCost(failureCosts) + getTotalCost(failureCosts) * 0.1}</p>
                </div>
            </div>
        </div>
    )
}

export default BudgetForm