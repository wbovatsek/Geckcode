import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Navbar.css';

const Navbar = () => {
  const { isAuth } = useSelector((state) => state.auth);

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container">
        <NavLink to="/" className="navbar-brand d-flex align-items-center">
          <img src="/images/logo.png" alt="App Logo" className="navbar-logo" />
        </NavLink>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAuth ? (
              <>
                <li className="nav-item">
                  <NavLink to="/dashboard" className="nav-link">
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/your-forest" className="nav-link">
                    Your Forest
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/account" className="nav-link">
                    Account
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
