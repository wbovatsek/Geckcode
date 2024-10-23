import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Navbar = () => {
  const { isAuth } = useSelector((state) => state.auth)

  return (
    <nav className='navbar navbar-light bg-light'>
      <div className='container'>


        {isAuth ? (
          <div>
            <NavLink to='/dashboard' className='mx-3'>
              <span>Dashboard</span>
            </NavLink>
            <NavLink to='/courses' className='mx-3'>
              <span>Courses</span>
            </NavLink>
            <NavLink to='/your-forest' className='mx-3'>
              <span>Your Forest</span>
            </NavLink>
            <NavLink to='/account' className='mx-3'>
              <span>Account</span>
            </NavLink>
          </div>
        ) : (
          <div>
            <NavLink to='/'>
            <span className='navbar-brand mb-0 h1'>Home</span>
            </NavLink>

            <NavLink to='/login'>
              <span>Login</span>
            </NavLink>

            <NavLink to='/register' className='mx-3'>
              <span>Register</span>
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar