import React, { useActionState } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router";

interface LoginProp {
  isRegistering: boolean;
  UpdateToken: React.Dispatch<React.SetStateAction<string>>;
}

interface ActionResult {
  error: boolean;
  message: string;
}

export function LoginPage(props: LoginProp) {
  const usernameInputId = React.useId();
  const passwordInputId = React.useId();
  const navigate = useNavigate();

  async function handleRegister(
    username: string,
    password: string
  ): Promise<ActionResult> {
    const endpoint = "/auth/register";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const token = await response.text();
    console.log(`updatated token to=${token}`);
    if (response.ok) {
        props.UpdateToken(token);
        navigate("/");
        return {
            error: false,
            message: `Successfully registered ${username}`,
      };
    } else {
      return {
        error: true,
        message: "Register failed. Please check your credentials.",
      };
    }
  }

  async function handleLogin(
    username: string,
    password: string
  ): Promise<ActionResult> {
    const endpoint = "/auth/login";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const token = await response.text();
      console.log(`updatated token to=${token}`);
      props.UpdateToken(token);
      navigate("/");
      return {
        error: false,
        message: `Successfully logged in ${username}`,
      };
    } else {
      return {
        error: true,
        message: "Login failed. Please check your credentials.",
      };
    }
  }

  const [result, submitAction, isPending] = useActionState(
    async (_prev: unknown, formData: FormData): Promise<ActionResult> => {
      const username = formData.get("username") as string;
      const password = formData.get("password") as string;      try {
        if (props.isRegistering) {
          return handleRegister(username, password);
        } else {
          return handleLogin(username, password);
        }
      } catch (err) {
        return {
          error: true,
          message: "Network error. Please try again later.",
        };
      }
    },
    null
  );

  return (
    <div className="container">
      <h2>{props.isRegistering ? "Register a new account" : "Login"}</h2>

      <form className="LoginPage-form" action={submitAction}>
        <label htmlFor={usernameInputId}>Username</label>
        <input
          id={usernameInputId}
          name="username"
          disabled={isPending}
          required
        />

        <label htmlFor={passwordInputId}>Password</label>
        <input
          id={passwordInputId}
          name="password"
          type="password"
          disabled={isPending}
          required
        />

        <input type="submit" disabled={isPending} value="Submit" />

        <div aria-live="polite" className="message-area">
          {isPending && <p className="message loading">Loading...</p>}
          {result?.message && (
            <p className={`message ${result.error ? "error" : "success"}`}>
              {result.message}
            </p>
          )}
        </div>
      </form>

      {props.isRegistering ? (
        <Link to="/login">Already have an account? Login here</Link>
      ) : (
        <Link to="/register">Don't have an account? Register here</Link>
      )}
    </div>
  );
}
