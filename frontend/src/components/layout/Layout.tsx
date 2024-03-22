import HeaderBar from "./HeaderBar";
import FooterBar from "./FooterBar";
import classes from "./Layout.module.css";
import { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <HeaderBar />
      <div className={classes.content_wrapper}>{children}</div>
      <FooterBar />
    </div>
  );
}

export default Layout;
