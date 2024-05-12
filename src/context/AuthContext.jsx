import { createContext, useReducer, useState } from "react";
export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case('LOGIN'):
            return {user: action.payload};
    
        case('LOGOUT'):
            return {user: null};
    
        default:
            return state;
    }
}
export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {user: null});
    const [auth, setAuth] = useState(false);
    return (
        <AuthContext.Provider value={{ ...state, dispatch, auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    );
};