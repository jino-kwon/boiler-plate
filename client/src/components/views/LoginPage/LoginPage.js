import axios from 'axios'
import React, {useState} from 'react'
import {useDispatch} from 'react-redux'
import {loginUser} from '../../../_actions/user_action'

function LoginPage(props) {
    const dispatch = useDispatch();
    // state를 만들어야함 : useState이라고 치면 폼이 뜸
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    
    const onEmailHandler = (event)=> {
        setEmail(event.currentTarget.value)
    }
    const onPasswordHandler = (event)=> {
        setPassword(event.currentTarget.value)
    }
    const onSubmitHandler = (event)=> {
        event.preventDefault(); //to prevent page from refreshing the page automatically everytime clicking 'login'
        
        let body = {
            email: Email,
            password: Password
        }

        dispatch(loginUser(body))
        .then(response => {
            // to let the user go back to the landing page
            if(response.payload.loginSuccess) {
                props.history.push('/') //go back to root page if loginsSuccess
            }
        })
        
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button type="submit">
                    Login
                </button>
            </form>            
        </div>
    )
}

export default LoginPage
