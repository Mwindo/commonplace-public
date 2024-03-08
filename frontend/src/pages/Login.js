import { useMutation } from "@tanstack/react-query";
import { useContext, useRef } from "react";
import { LoginContext } from "../components/auth/Auth";
import classes from "./Login.module.css";
import LoadingIcon from "../components/LoadingIcon";

function LoginPage(props) {
  const usernameBox = useRef();
  const passwordBox = useRef();

  const { isAuth, login } = useContext(LoginContext);

  const loginMutation = useMutation({
    mutationFn: login,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({
      username: usernameBox.current.value,
      password: passwordBox.current.value,
    });
  };

  if (isAuth) {
    return <div className={classes.login_success_message}>Logged in!</div>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className={classes.login_input_wrapper}>
          {loginMutation.isError && (
            <div className={classes.login_error_message}>
              Wrong username and password
            </div>
          )}
          <span>
            <label htmlFor="username">Username:</label>
            <input
              aria-label="Username"
              className={classes.login_input}
              disabled={loginMutation.isPending}
              ref={usernameBox}
              type="text"
              id="username"
              name="username"
              required
            />
          </span>
          <span>
            <label htmlFor="password">Password:</label>
            <input
              aria-label="Password"
              className={classes.login_input}
              disabled={loginMutation.isPending}
              ref={passwordBox}
              type="password"
              id="password"
              name="password"
              required
            />
          </span>
        </div>
        <div className={classes.login_button_wrapper}>
          <button
            aria-label="Log in"
            type="submit"
            className={classes.login_button}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? <LoadingIcon size="2.5em" /> : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
