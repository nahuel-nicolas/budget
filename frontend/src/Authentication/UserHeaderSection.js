import { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from './AuthContext'

const UserHeaderSection = () => {
    const { user, logoutUser } = useContext(AuthContext)
    return (
        <div id="user_section">
            {user ? (
                <>
                 <a href="" onClick={logoutUser}>Logout</a>
                 <span>Hello {user.username}</span>
                </>
            ): (
                <Link to="/login">Login</Link>
            )}
        </div>
    )
}

export default UserHeaderSection
