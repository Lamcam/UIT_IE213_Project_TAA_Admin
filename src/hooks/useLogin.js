import { useState } from "react";
import { useAuthContext } from "./useAuthContext.js";
import axios from "axios";
import { AuthContextProvider } from "context/AuthContext.jsx";
import { Outlet, Navigate } from 'react-router-dom'
export function useLogIn() {
    const { setAuth, dispatch, auth } = useAuthContext();
    const [loading, setLoading] = useState(null);
    const [email, setEmail] = useState('');
    const [passwordLog, setPassword] = useState(''); 
    const logIn = async ( username, password ) => {
        try {
            const res = await axios.post('http://localhost:8000/admin/login', { username, password} )
            if (res.status === 200) {
                await setAuth(true);
                localStorage.setItem('admin', res.data);
                localStorage.setItem('error', '');
                setTimeout(() => {
                    window.location.href = '/accounts';
                },1000)

            }
           
           
            

        } catch (error) {
            if(error.response.status===404 )
                localStorage.setItem("error", 'Không tìm thấy tài khoản!');
            if (error.response.status === 400 )
                localStorage.setItem("error", 'Sai mật khẩu!');

            console.log('err', error)
        }
        
    };
    return { logIn };
}
