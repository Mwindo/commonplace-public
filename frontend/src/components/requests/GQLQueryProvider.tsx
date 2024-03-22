import { ReactNode, createContext, useContext } from "react";
import { getGQLQueryClient } from "./gqlQueryClient";
import { LoginContext } from "../auth/Auth";

interface GQLQueryContextProps {
  gqlFetch: (query: string, variables?: any) => any;
  showSessionExpired: () => void;
}

export const GQLQueryContext = createContext({} as GQLQueryContextProps);

// To avoid recreating the same query client across the app.
const GQLQueryProvider = ({ children }: { children: ReactNode }) => {
  const { showSessionExpired } = useContext(LoginContext);

  const gqlFetch = async (query: string, variables?: any) => {
    try {
      const response = await getGQLQueryClient().request(query, variables);
      return response;
    } catch (e) {
      // TODO: Better error handling!
      const errorData = JSON.parse(JSON.stringify(e));
      const errorMessage = errorData["response"]["errors"][0]["message"];
      if (
        errorData["response"]["errors"][0]["message"] ===
        "Signature has expired"
      ) {
        showSessionExpired();
        throw e;
      } else {
        throw new Error(errorMessage);
      }
    }
  };

  return (
    <GQLQueryContext.Provider
      value={{
        gqlFetch,
        showSessionExpired,
      }}
    >
      {children}
    </GQLQueryContext.Provider>
  );
};

export default GQLQueryProvider;
