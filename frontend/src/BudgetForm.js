import React, { useState, useEffect } from 'react'
import FailureContainer from './FailureContainer'
import Box from './Box'
import * as utilities from './utilities'
import { useNavigate } from "react-router-dom";

const BudgetForm = () => {
    const [modelFields, setModelFields] = useState(null);
    const [perpetualReplacements, setPerpetualReplacements] = useState(null)
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
    const [isBoxDisplayed, setBoxDisplay] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        utilities.fetch_and_set('http://127.0.0.1:8000/fields/', [setModelFields])
        utilities.fetch_and_set(
            'http://127.0.0.1:8000/repuesto/', [setReplacements, setPerpetualReplacements]
        )
    }, [])
    useEffect(() => {
        if (modelFields != null) {
            setFormData(utilities.getFormDataStructure(modelFields))
        }
    }, [modelFields]) 
    useEffect(() => {
        if (formData !== null) {
            utilities.updateFieldsetDisableStatus(
                modelFields, formData, setGenericFieldsetDisabled, setBikeFieldsetDisabled, 
                setCarFieldsetDisabled, setFailureFieldsetDisabled, setSubmitButtonDisabled,
                setReplacements, perpetualReplacements
            )
            if (formData.desperfectos) {
                utilities.updateFailureCosts(
                    formData.desperfectos, setFailureCosts, replacements
                )
            }
        }
    }, [formData])

    if (modelFields == null || formData == null || replacements == null) {
        return <h2>Loading...</h2>
    }
    return (
        <div className='budget_form'>
            <Box isBoxDisplayed={isBoxDisplayed}>Storing data...</Box>
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
                        onClick={() => utilities.addFailure(formData, setFormData, modelFields)}
                        disabled={isSubmitButtonDisabled} 
                    >
                        +
                    </button>
                </fieldset>
                <input 
                    onClick={() => utilities.submitButtonHandler(formData, setBoxDisplay, navigate)}
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
                                    <p>
                                        Costo repuestos: {utilities.getReplacementsCost(desperfecto.repuestos, replacements)}
                                    </p>
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
                    <p>Costo total: {utilities.getTotalCost(failureCosts)}</p>
                    <p>Presupuesto final incluyendo ganancia taller: {utilities.getTotalCost(failureCosts) + utilities.getTotalCost(failureCosts) * 0.1}</p>
                </div>
            </div>
        </div>
    )
}

export default BudgetForm