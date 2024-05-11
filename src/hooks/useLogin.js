import { useState } from "react";
import { useAuthContext } from "./useAuthContext.js";
import axios from "axios";
import { AuthContextProvider } from "context/AuthContext.jsx";
import { Outlet, Navigate } from 'react-router-dom'
export function useLogIn() {
    const { setAuth, dispatch, auth } = useAuthContext();
    const [loading, setLoading] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    const logIn = async ( username, password ) => {
        try {
            const res = await axios.post('http://localhost:8000/admin/login', { username, password} )
            if (res.status === 200) {
                await setAuth(true);
                localStorage.setItem('admin', res.data);
                setTimeout(() => {
                    window.location.href = '/dashboard';
                },1000)

            }
            if(res.status === 404){
                setEmail('Không tìm thấy tài khoản!');
            }

        } catch (error) {
            if(error.response.status===404 && error.response.data.message ==='Không tìm thấy admin')
                setEmail('Email không tồn tại!');
            if (error.response.status === 400  && error.response.data.message === 'Sai mật khẩu')
                setPassword('Mật khẩu không khớp!')
            console.log('err', error)
        }
        
    };
    return { logIn };
}
