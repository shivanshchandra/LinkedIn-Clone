import UserLayout from '@/layout/UserLayout'
import React, { use, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import styles from './style.module.css'
import { loginUser, registerUser } from '@/config/redux/action/authAction'
import { emptyMessage } from '@/config/redux/reducer/authReducer'

export default function LoginComponent() {


  const authState = useSelector((state) => {
    return state.auth;
  });

  const router = useRouter();

  const dispatch = useDispatch();

  const [userLoginMethod, setUserLoginMethod] = useState(false);


  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (authState?.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);


  useEffect(() => {
     dispatch(emptyMessage());
  }, [userLoginMethod]);


  useEffect(() => {
    if(localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  }, []);


  const handleRegister = () => {
    console.log("Registering...");
    dispatch(registerUser({ username, password, email, name }));
  }


  const handleLogin = () => {
    console.log("Logging in");
    dispatch(loginUser({ email, password }));
  }


  return (
    <UserLayout>

      <div className={styles.container}>

        <div className={styles.cardContainer}>

          <div className={styles.cardContainer_left}>

            <p className= {styles.cardleft_heading}>{userLoginMethod ? "Sign In" : "Sign Up"}</p>

            <p style={{color: authState.isError ? "red" : "green"}}> {authState.message} </p>


            <div className= {styles.inputContainers}>

              { !userLoginMethod &&<div className= {styles.inputRow}>

                <input onChange={(e) => setUsername(e.target.value)} className= {styles.inputField} type="text" placeholder='Username' />
                <input onChange={(e) => setName(e.target.value)} className= {styles.inputField} type="text" placeholder='Name' />

              </div> }

              <input onChange={(e) => setEmailAddress(e.target.value)} className= {styles.inputField} type="text" placeholder='Email' />
              <input onChange={(e) => setPassword(e.target.value)} className= {styles.inputField} type="text" placeholder='Password' />


              <div onClick={ () => {
                if (userLoginMethod) {
                  handleLogin();
                } else {
                  handleRegister();
                }
              }} className= {styles.buttonWithOutline}>
                <p> {userLoginMethod ? "Sign In" : "Sign Up"}</p>
              </div>

            </div>


          </div>

          <div className={styles.cardContainer_right}>

              {userLoginMethod ? <p>Don't have an account?</p> : <p>Already Have an Account? </p>}
              <div onClick={() => {
                setUserLoginMethod(!userLoginMethod);
              }} style={{color: "black", textAlign: "center"}}  className= {styles.buttonWithOutline}>
                <p>{userLoginMethod ? "Sign Up" : "Sign In"}</p>
              </div>

          </div>

        </div>

      </div>

    </UserLayout>
  );
}
