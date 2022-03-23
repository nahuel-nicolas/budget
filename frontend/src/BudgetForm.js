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

const BudgetForm = () => {
    const [modelFields, setModelFields] = useState(null);
    const [replacements, setReplacements] = useState(null);
    const [formData, setFormData] = useState(null)

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
        console.log(formData)
    }, [formData]) 

    if (modelFields == null || formData == null || replacements == null) {
        return <h2>Loading...</h2>
    }
    return (
        <div className='budget_form'>
            <form action="">
                <select 
                    name="vehicle_type" 
                    id="id_vehicle_type"
                     
                    required>
                    <option value="none">Select</option>
                    <option value="bike">Moto</option>
                    <option value="car">Automovil</option>
                </select>
                <fieldset id="generic_specifications">
                    {
                        modelFields["vehiculo"].map((field, index) => {
                            return (
                                <div className="field_container" key={index}>
                                    <label htmlFor={`id_${field}`}>{ field }</label>
                                    <input type="text" name={field} id={`id_${field}`} />
                                </div>
                            )
                        })
                    }
                </fieldset>
                <fieldset id="car_specifications">
                    <h4>Especificaciones - Automovil</h4>
                    <div className="field_container">
                        <label htmlFor="car_types">Clase de automovil</label>
                        <select name="car_types" id="id_car_types">
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
                        <select name="car_doors_number" id="id_car_doors">
                            <option value="">Select</option>
                            <option value="2">2</option>
                            <option value="4">4</option>
                        </select>
                    </div>
                </fieldset>
                <fieldset id="bike_specifications">
                    <h4>Especificaciones - Moto</h4>
                    <div className="field_container">
                        <label htmlFor="id_bike_engine_size">Cilindrada</label>
                        <select name="engine_size" id="id_bike_engine_size">
                            <option value="">Select</option>
                            <option value="S">125 cc</option>
                            <option value="M">250 cc</option>
                            <option value="L">500 cc</option>
                        </select>
                    </div>
                </fieldset>
                <fieldset id="failure_fieldset">
                    <div id="main_failure_container" className="container" >
                        {
                            formData.desperfectos.map((desperfecto, index) => {
                                return <FailureContainer 
                                    key={index}
                                    failure_idx={index}
                                    modelFields={modelFields}
                                    replacements={replacements}
                                />
                            })
                        }
                    </div>
                    <div 
                        id="pusher_button" 
                        onClick={() => addFailure(formData, setFormData, modelFields)} 
                    >
                        +
                    </div>
                </fieldset>
                <input type="submit" value="Guardar datos" name="submit" id="submit_button" />
            </form>
        </div>
    )
}

export default BudgetForm