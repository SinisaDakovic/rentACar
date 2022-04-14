import React from "react";
import "../login/login.css";
import { useForm } from "react-hook-form";
import Logo from "../../logo.png";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <div className="container">
      <div className="loginImage">
        <img src={Logo} width="250px" height="150px"></img>
      </div>
      <div className="loginForm">
        <div className="loginContainer">
          <h2>Login</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email">Email </label>
              <input
                placeholder="johndoe@gmail.com"
                {...register("email", {
                  required: {
                    value: true,
                    message: "Please input your email",
                  },
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email",
                  },
                  minLength: {
                    value: 4,
                    message: "Minimum length: 4 characters.",
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
              <label htmlFor="password">Password </label>
              <input
                placeholder="Password"
                {...register("password", {
                  required: {
                    value: true,
                    message: "Please input your password",
                  },
                  minLength: {
                    value: 4,
                    message: "Minimum length: 4 characters.",
                  },
                  maxLength: {
                    value: 12,
                    message: "Maximum length: 12 characters.",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9!#%]+$/g,
                    message: "Please enter a valid password",
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

            <input type="submit" value="LOGIN" id="loginButton" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
