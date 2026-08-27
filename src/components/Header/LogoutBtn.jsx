import React from 'react'
import { useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'
import { useNavigate } from 'react-router-dom'

function LogoutBtn() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout()) // Redux state status = false and userData = null
            navigate('/login') // User ko Login Page par redirect kar dein
        })
    }

    return (
        <button
            onClick={logoutHandler}
            className='bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700'
        >
            Logout
        </button>
    )
}

export default LogoutBtn