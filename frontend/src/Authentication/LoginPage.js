import { useContext } from 'react'
import AuthContext from './AuthContext'

const LoginPage = () => {
    const { loginUser } = useContext(AuthContext)
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={loginUser}>
                <input type="text" name="username" placeholder="Enter Username" />
                <input type="password" name="password" placeholder="Enter Password" />
                <input type="submit"/>
            </form>
        </div>
    )
}

export default LoginPage
