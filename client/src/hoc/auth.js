import React from 'react';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function(SpecificComponent, option, adminRoute = null) {
    function AuthenticationCheck(props) {
        
        const dispatch = useDispatch();
        useEffect(() => {
            
            dispatch(auth()=> {
                d
            })
            Axios.get('/api/users/auth')
            return () => {
                cleanup
            }
        }, [])
    }

    return AuthenticationCheck
}