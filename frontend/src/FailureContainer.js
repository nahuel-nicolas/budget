import React, { useState, useEffect } from 'react'

function getFailureFieldContainers(failure_idx, modelFields, replacements) {
    const failureFieldContainers = modelFields.desperfecto.map((fieldName, index) => {
        const inputType = fieldName == 'descripcion' ? "text" : "Number"
        const input_id = `id_${failure_idx}_${fieldName}`
        return (
            <div className="field_container" key={index}>
                <label htmlFor={input_id}>{ fieldName }</label>
                <input type={inputType} name={fieldName} id={input_id} />
            </div>
        )
    })
    failureFieldContainers.push(
        <div className="field_container" key={3}>
            <label htmlFor={`id_${failure_idx}_replacements`}>Repuestos</label>
            <select name="replacements" id={`id_${failure_idx}_replacements`} multiple>
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

const FailureContainer = ({ failure_idx, modelFields, replacements }) => {
    return (
        <div className="failure_container" id={failure_idx}>
            {getFailureFieldContainers(failure_idx, modelFields, replacements)}
        </div>
    )
}

export default FailureContainer