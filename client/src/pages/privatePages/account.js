import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchLoginStreak, fetchProtectedInfo, onLogout } from '../../api/auth';
import Layout from '../../components/layout';
import { unauthenticateUser } from '../../redux/slices/authSlice';
import './Account.css'; // Import the new CSS file

const Account = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [protectedData, setProtectedData] = useState(null);
  const [loginStreak, setLoginStreak] = useState(null);

  const logout = async () => {
    try {
      await onLogout();
      dispatch(unauthenticateUser());
      localStorage.removeItem('isAuth');
    } catch (error) {
      console.log(error.response);
    }
  };

  const protectedInfo = async () => {
    try {
      const { data } = await fetchProtectedInfo();
      setProtectedData(data.info);
      const response = await fetchLoginStreak();
      setLoginStreak(response.data.loginStreak)
      setLoading(false);
    } catch (error) {
      logout();
    }
  };

  useEffect(() => {
    protectedInfo();
  }, []);

  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <div>
      <Layout>
        <div className="account-container">
          <h1 className="account-title">Account Details</h1>
          <h2 className="account-data">User - {protectedData}</h2>
          <h3 className="account-data">Login Streak - {loginStreak} </h3>

          <button onClick={() => logout()} className="btn btn-primary logout-btn">
            Logout
          </button>
        </div>
      </Layout>
    </div>
  );
};

export default Account;
