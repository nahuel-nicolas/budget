import React, { useState, useEffect } from 'react'

function getNewFailures(event, fieldName, failure_index, prevFormData, inputType) {
    const newFailures = prevFormData.desperfectos.slice()
    if (fieldName == "repuestos") {
        const currentOptions = event.target.options
        const currentSelectedOptionsValue = []
        for (const currentOption of currentOptions) {
            if (currentOption.selected) {
                currentSelectedOptionsValue.push(currentOption.value)
            }
        }
        newFailures[failure_index] = {
            ...newFailures[failure_index], 
            [fieldName]: currentSelectedOptionsValue
        }
    } else {
        const currentValue = inputType == "text" ? event.target.value : parseInt(event.target.value)
        newFailures[failure_index] = {
            ...newFailures[failure_index], 
            [fieldName]: currentValue
        }
        // newFailures[failure_index][fieldName] = event.target.value
    }
    return newFailures
}

function getFailureFieldContainers(failure_idx, modelFields, replacements, setFormData) {
    const failureFieldContainers = modelFields.desperfecto.map((fieldName, index) => {
        const inputType = fieldName == 'descripcion' ? "text" : "Number"
        const input_id = `id_${failure_idx}_${fieldName}`
        return (
            <div className="field_container" key={index}>
                <label htmlFor={input_id}>{ fieldName }</label>
                <input 
                    onChange={
                        (event) => setFormData((prevFormData) => ({
                            ...prevFormData,
                            "desperfectos": getNewFailures(
                                event, fieldName, failure_idx, prevFormData, inputType
                            )
                        }))
                    }
                    type={inputType} 
                    name={fieldName} 
                    id={input_id} 
                />
            </div>
        )
    })
    failureFieldContainers.push(
        <div className="field_container" key={3}>
            <label htmlFor={`id_${failure_idx}_replacements`}>Repuestos</label>
            <select 
                onChange={
                    (event) => setFormData((prevFormData) => ({
                        ...prevFormData,
                        "desperfectos": getNewFailures(
                            event, 'repuestos', failure_idx, prevFormData, null
                        )
                    }))
                }
                name="replacements" 
                id={`id_${failure_idx}_replacements`} 
                multiple
            >
                {
                    replacements.map((currentReplacement, index) => {
                        return (
                            <option value={currentReplacement.url} key={index}>
                                {`${currentReplacement.nombre} - ${currentReplacement.size} - ${currentReplacement.importado ? "importado" : "nacional"}`}
                            </option>
                        )
                    })
                }
            </select>
        </div>
    )
    return failureFieldContainers
}

const FailureContainer = ({ failure_idx, modelFields, replacements, setFormData }) => {
    return (
        <div className="failure_container" id={failure_idx}>
            <h4 key={4}>Desperfecto Nº{failure_idx + 1}</h4>
            {getFailureFieldContainers(failure_idx, modelFields, replacements, setFormData)}
        </div>
    )
}

export default FailureContainer