import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import * as utilities from './utilities'

const Vehicle = () => {
    const [vehicleData, setVehicleData] = useState(null);
    const params = useParams()
    useEffect(() => {
        const vehicle_type = params.vehicle_type == "car" ? 'automovil' : "moto"
        const vehicle_id = params.vehicle_id
        const url = `http://127.0.0.1:8000/${vehicle_type}/${vehicle_id}/`
        utilities.fetch_and_set(url, [setVehicleData])
        console.log(vehicleData)
    }, [])
    if (vehicleData == null) {
        return <h2>Loading...</h2>
    }
    return (
        <div className="vehicle">
            {
                Object.entries(vehicleData).map((currentKeyValuePair, index) => {
                    const currentFieldName = currentKeyValuePair[0]
                    const currentFieldValue = currentKeyValuePair[1]
                    if (Array.isArray(currentFieldValue)) {
                        return (
                            <p key={index}>
                                {currentFieldName}:{currentFieldValue.map(currentFieldSubValue => ` ${currentFieldSubValue}`)}
                            </p>
                        )  
                    }
                    return <p key={index}>{currentFieldName}: {currentFieldValue}</p>
                })
            }
        </div>
    )    
}

export default Vehicle