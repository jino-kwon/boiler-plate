import React, { useEffect } from 'react';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function(SpecificComponent, option, adminRoute = null) {

    // option1: null => anyone can enter
    // option2: true => only logged in users
    // option3: false => logged in users can't enter

    function AuthenticationCheck(props) {
        
        const dispatch = useDispatch();
        useEffect(() => {
            
            dispatch(auth()).then(response => {
                console.log(response)
                // not logged in
                if(!response.payload.isAuth) {
                    if(option) { //when not logged in user trying to enter pages for loggedin users
                        props.history.push('/login')
                    }
                } else { //logged in
                    if(adminRoute && !response.payload.isAdmin) {
                        props.history.push('/')
                    } else if (option === false) {
                        props.history.push('/')
                    }
                    
                }
            })
            // Axios.get('/api/users/auth')
            
        }, [])

        return (<SpecificComponent />)
    }

    return AuthenticationCheck
}