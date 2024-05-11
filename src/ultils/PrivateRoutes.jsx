import { Outlet, Navigate } from 'react-router-dom'
// import { AuthContextProvider } from 'context/AuthContext.jsx'
import { useAuthContext } from 'hooks/useAuthContext.js'
const PrivateRoutes = () => {
    const { auth } = useAuthContext();
    const authVe = localStorage.getItem('admin');
    return(
        // auth.token ? <Outlet/> : <Navigate to="/"/>
        authVe ? <Outlet/> : <Navigate to="/"/>
    )
}

export default PrivateRoutes