import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from './AuthContext'
import UserHeaderSection from './UserHeaderSection';

const PrivateComponent = ({ children }) => {
    const { user } = useContext(AuthContext)
    if (user) {
        return (
                <>
                    <UserHeaderSection />
                    <>{children}</>
                </>
            )
    } else {
        return <Navigate to="/login" />
    }
}

export default PrivateComponent;