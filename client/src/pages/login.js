import { useState } from 'react'
import { onLogin } from '../api/auth'
import Layout from '../components/layout'
import { useDispatch } from 'react-redux'
import { authenticateUser } from '../redux/slices/authSlice'

const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
    })
    const [error, setError] = useState(false)
    const [loginStreak, setLoginStreak] = useState(null) 

    const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    const dispatch = useDispatch()

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await onLogin(values)

            setLoginStreak(response.loginStreak) 
            dispatch(authenticateUser())
            localStorage.setItem('isAuth', 'true')
        } catch (err) {
            console.log(err.response.data.errors[0].msg)
            setError(err.response.data.errors[0].msg)
        }
    }

    return (
        <Layout>
            <form onSubmit={(e) => onSubmit(e)} className='container mt-3'>
                <h1>Login</h1>

                <div className='mb-3'>
                    <label htmlFor='email' className='form-label'>
                        Email address
                    </label>
                    <input
                        onChange={(e) => onChange(e)}
                        type='email'
                        className='form-control'
                        id='email'
                        name='email'
                        value={values.email}
                        placeholder='test@gmail.com'
                        required
                    />
                </div>

                <div className='mb-3'>
                    <label htmlFor='password' className='form-label'>
                        Password
                    </label>
                    <input
                        onChange={(e) => onChange(e)}
                        type='password'
                        value={values.password}
                        className='form-control'
                        id='password'
                        name='password'
                        placeholder='password'
                        required
                    />
                </div>

                <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>

                {loginStreak !== null && (
                    <div style={{ color: 'green', margin: '10px 0' }}>
                        You have logged in for {loginStreak} consecutive days!
                    </div>
                )}

                <button type='submit' className='btn btn-primary'>
                    Login
                </button>
            </form>
        </Layout>
    )
}

export default Login
