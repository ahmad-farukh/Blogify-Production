import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import authService from '../appwrite/auth';

import { Login as authLogin } from '../components';

function Login() {

    const navigate=useNavigate();
    const dispatch=useDispatch();

    const [register,handleSubmit]=useForm();

    const[error,setError]=useState(null);
   
    const Login=async(data)=>{

        setError("");
        try{
            const session=await authService.login();

            if(session){
                const user=await authService.getCurrentUser();
                if(user){
                    dispatch(authLogin(user))
                    navigate('./')
                }
            }
        }
        catch(error){
            setError("there is an error in it ",error.message)
        }

    }


    return (
    
    <div className='border-red-600 border-2 rounded-2xl '>


        <Container>
            <Logo/>
        </Container>


        <h2>
            <Link to={'./Signup'} >
            
            Signup
            
            </Link>
        </h2>


        {error && (
            <p className='text-red font-bold text-2xl'>There is an error in it ok </p>
        ) }


        <form action={handleSubmit(Login)}>

            <Input
            
            label="Email"
        
            {...register("Email",{
                required:true,
                 validate: {
                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                        "Email address must be a valid address",
                    }

            })}


            />




        </form>


    </div>
  )
}

export default Login