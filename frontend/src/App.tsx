import "./App.css";
import AnimatedRoutes from "./components/layout/AnimatedRoutes";
import Layout from "./components/layout/Layout";
import { useContext } from "react";
import { ModalContext } from "./components/modals/ModalProvider";

function App() {
  const { modal, alertDialogue } = useContext(ModalContext);

  return (
    <>
      {alertDialogue ? alertDialogue : null}
      {modal ? modal : null}
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </>
  );
}

export default App;
