import axios from 'axios'
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from './types'
export function loginUser(dataToSubmit) {
    // connect with backend
    const request = axios.post('/api/users/login', dataToSubmit)
    .then(response => response.data )

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function registerUser(dataToSubmit) {
    // connect with backend
    const request = axios.post('/api/users/register', dataToSubmit)
    .then(response => response.data )

    return {
        type: REGISTER_USER,
        payload: request
    }
}

export function auth() {
    // connect with backend
    const request = axios.get('/api/users/auth')
    .then(response => response.data )

    return {
        type: AUTH_USER,
        payload: request
    }
}
