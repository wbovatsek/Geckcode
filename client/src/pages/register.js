import Layout from "../components/layout"
import { useState } from 'react'

const Register = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
    })
const [error, setError] = useState(false)
const [success, setSucess] = useState(false)

const onChange = (e) => {

}

const onSubmit = (e) => {
    e.preventDefault()
}

    return (
        <Layout>
            <form onSumbit={(e) => onSubmit(e)} className='container mt-3'>
                <h1>Register</h1>

                <div className='mb-3'>
                    <label htmlFor='email' className='form-label'>
                        Email address
                    </label>
                    <input
                        onChange={(e) => onChange(e)}
                        type = 'email'
                        className = 'form-control'
                        id = 'email'
                        name = 'email'
                        value = {values.email}
                        placeholder = 'test@gmail.com'
                        required
                    />
                </div>

                <div className='mb-3'>
                    <label htmlFor='password' className='form-label'>
                        Password
                    </label>
                    <input 
                        onChange={(e) => onChange(e)}
                        type="password"
                        value={values.password}
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="password"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        </Layout>
    )
}

export default Register