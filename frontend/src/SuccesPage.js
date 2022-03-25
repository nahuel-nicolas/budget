import Vehicle from "./Vehicle"

const SuccesPage = ({ vehicleData }) => (
    <div id="succes_page">
        <h2>Your vehicle has been stored succesfully!</h2>
        <Vehicle data={vehicleData} />
    </div>
)

export default SuccesPage