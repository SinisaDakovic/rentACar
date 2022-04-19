import React,{ useState } from "react";
import "../login/login.css";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom'
import {useMutation} from 'react-query'
import {login} from '../../services/account'
import Logo from "../../logo.png";
import {useTranslation} from 'react-i18next'

function Login() {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate()

  const [reqError, setReqError] = useState('')

  const loginMutation = useMutation((data) => login(data), {
    onSuccess: (response) => {
      localStorage.setItem("jwt-token", response?.data["access_token"]);
      navigate("/home");
    },
    onError: (err) => {
      setReqError(t('wrongCred.1'))
    }
  });

   const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="container">
      <div className="loginImage">
        <img src={Logo} width="250px" height="150px" alt="Logo"></img>
      </div>
      <div className="loginForm">
        <div className="loginContainer">
          <h2>{t('logIn.1')}</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email">Email </label>
              <input
                placeholder="johndoe@gmail.com"
                {...register("email", {
                  required: {
                    value: true,
                    message: t('inputEmail.1'),
                  },
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('validEmail.1'),
                  },
                  minLength: {
                    value: 4,
                    message: t('minLen.1'),
                  },
                })}
                type="email"
                id="email"
              />
              {errors?.email?.message !== "" ? (
                <span>{errors?.email?.message}</span>
              ) : (
                <span></span>
              )}
            </div>

            <div>
              <label htmlFor="password">{t('passw.1')}</label>
              <input
                placeholder={t('passw.1')}
                {...register("password", {
                  required: {
                    value: true,
                    message: t('inputPass.1'),
                  },
                  minLength: {
                    value: 4,
                    message: t('minLen.1'),
                  },
                  maxLength: {
                    value: 12,
                    message: t('maxLen.1'),
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9!#%]+$/g,
                    message: t('validPass.1'),
                  },
                })}
                type="password"
                id="password"
              />
              {errors?.password?.message !== "" ? (
                <span>{errors?.password?.message}</span>
              ) : (
                <span></span>
              )}
            </div>
            <span style={{ color: "red", fontSize: "12px", textAlign:"center" }}>
              {reqError}
              </span>
            <input type="submit" value={t('logInCap.1')} id="loginButton" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
