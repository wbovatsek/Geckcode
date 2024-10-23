import { BrowserRouter, Navigate, Routes, Route, Outlet } from 'react-router-dom'
import Home from './pages/home'
import Dashboard from './pages/privatePages/dashboard'
import Register from './pages/register'
import Login from './pages/login'
import Account from './pages/privatePages/account'
import Courses from './pages/privatePages/courses'
import YourForest from './pages/privatePages/yourforest'
import { useSelector } from 'react-redux'

const PrivateRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth)

  return <>{
    isAuth ? <Outlet /> : <Navigate to='/login' />
  }</>
}

const RestrictedRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth)

  return <>{
    !isAuth ? <Outlet /> : <Navigate to='/dashboard' />
  }</>
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />

        <Route element={<PrivateRoutes />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/courses' element={<Courses/>} />
          <Route path='/your-forest' element={<YourForest />} />
          <Route path='/account' element={<Account />} />
        </Route>

        <Route element={<RestrictedRoutes />}>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App