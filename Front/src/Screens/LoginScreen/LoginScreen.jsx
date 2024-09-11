import React, { useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { BloqueInputLabel, Botonera } from "../index.js";
import "./LoginScreen.css";
import { login } from "../../services/services.js";
import { AppContext } from "../../Components/appContext/AppContext.jsx";

const LoginScreen = () => {
  const navigate = useNavigate();
  const { setUserLogged } = useContext(AppContext);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email inválido")
      .min(8, "El email debe tener al menos 8 caracteres")
      .max(25, "El email no puede tener más de 25 caracteres")
      .required("El email es obligatorio"),
    password: Yup.string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(15, "La contraseña no puede tener más de 15 caracteres")
      .matches(
        /[A-Z]/,
        "La contraseña debe contener al menos una letra mayúscula"
      )
      .matches(/[0-9]/, "La contraseña debe contener al menos un número")
      .matches(/[\W_]/, "La contraseña debe contener al menos un símbolo")
      .required("La contraseña es obligatoria"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await login(values);

      if (response.status === 200) {
        console.log(response.user)
        setUserLogged(response.data.user)
        navigate("/");
      } else {
        console.log("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, isValid, touched, errors }) => (
          <Form>
            <h2>Inicio de Sesión</h2>
            <div className="bloqueCentro">
              <div>
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  name="email"
                  as={BloqueInputLabel}
                  fontSize={"23px"}
                />
                <ErrorMessage name="email" component="div" className="error" />
              </div>
              <div>
                <label htmlFor="password">Contraseña</label>
                <Field
                  type="password"
                  name="password"
                  as={BloqueInputLabel}
                  fontSize={"23px"}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error"
                />
              </div>
              <div>
                <span>{"¿No estás registrado? "}</span>
                <NavLink to={"/sign-up"}>{"Regístrate"}</NavLink>
              </div>
              <div>
                <NavLink
                  style={{ color: "black", textAlign: "start" }}
                  to={"/sign-up"}
                >
                  {"¿Olvidaste tu contraseña? "}
                </NavLink>
              </div>
            </div>
            <Botonera
              isValid={
                isValid &&
                Object.keys(errors).length === 0 &&
                Object.keys(touched).length > 0
              }
              touched={touched}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginScreen;
