import { ReactNode, createContext, useContext, useState } from "react";
import { gql } from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import { getGQLQueryClient } from "../requests/gqlQueryClient";
import { ModalContext } from "../modals/ModalProvider";
import MessageBox from "../modals/MessageBox";
import { useNavigate } from "react-router-dom";

interface LoginContextProps {
  isAuth: boolean;
  setAuth: (auth: boolean) => void;
  login: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => Promise<LoginResponse>;
  logout: () => Promise<LogoutResponse | undefined>;
  showSessionExpired: () => void;
}

interface LoginResponse {
  login: {
    status: string;
    error: string;
    id: number;
  };
}

interface LogoutResponse {
  logout: boolean;
}

interface IsLoggedInResponse {
  is_logged_in: boolean;
}

export const LoginContext = createContext({} as LoginContextProps);

const IS_AUTH_CHECK_INTERVAL = 60000; // TODO: make more dynamic as needed

const loginMutationQuery = gql`
  mutation loginUser($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      status
      error
      id
    }
  }
`;

const logoutMutationQuery = gql`
  mutation logout {
    logout
  }
`;

const loggedInQuery = gql`
  query isLoggedIn {
    is_logged_in
  }
`;

const LoginProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setAuth] = useState(document.cookie ? true : false);

  const { showAlertDialogue, closeAllModals } = useContext(ModalContext);

  const login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    const response: LoginResponse = await getGQLQueryClient().request(
      loginMutationQuery,
      {
        username: username,
        password: password,
      }
    );
    // TODO: Better error handling
    if (response["login"]["status"] === "true") {
      setAuth(true);
    } else {
      throw Error();
    }
    return response;
  };

  const navigate = useNavigate();

  const logout = async () => {
    if (!isAuth) {
      return;
    }
    const response: LogoutResponse = await getGQLQueryClient().request(
      logoutMutationQuery
    );
    if (response["logout"] === true) {
      setAuth(false);
    }
    navigate("/alligator", { state: { fromApp: true } });
    // window.location.reload(); // There is probably a more efficient way, but this ensures everything is properly reset
    return response;
  };

  const showSessionExpired = () => {
    setAuth(false);
    showAlertDialogue(
      <MessageBox
        message="Session has expired. Please log back in."
        onConfirmText="OK"
        onConfirm={() => {
          closeAllModals();
          logout();
        }}
      />
    );
  };

  const checkLoggedIn = async () => {
    const response: IsLoggedInResponse = await getGQLQueryClient().request(
      loggedInQuery
    );
    if (isAuth && response["is_logged_in"] === false) {
      showSessionExpired();
    }
    return response;
  };

  useQuery({
    queryKey: ["loggedInCheck"],
    queryFn: checkLoggedIn,
    refetchInterval: IS_AUTH_CHECK_INTERVAL,
    enabled: isAuth,
  });

  return (
    <LoginContext.Provider
      value={{ isAuth, setAuth, login, logout, showSessionExpired }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginProvider;
