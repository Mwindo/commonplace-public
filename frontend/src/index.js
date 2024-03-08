import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import ModalProvider from "./components/modals/ModalProvider";
import LoginProvider from "./components/auth/Auth";
import GQLQueryProvider from "./components/requests/GQLQueryProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Sentry from "@sentry/react";
import { isProductionEnvironment } from "./components/utilities/environment";

if (isProductionEnvironment()) {
  Sentry.init({
    dsn: "https://cd6fb1e848927a1b7acbd6756d097ac1@o4506728512946176.ingest.us.sentry.io/4506855644135424",
    integrations: [],
  });
}

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <LoginProvider>
          {" "}
          {/* The GQLQueryProvider needs the ModalProvider */}
          <GQLQueryProvider>
            {" "}
            {/* And the LoginProvider needs the GQLQueryProvider */}
            <App />
          </GQLQueryProvider>
        </LoginProvider>
      </ModalProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
