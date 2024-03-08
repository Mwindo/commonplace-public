import HeaderBar from "./HeaderBar";
import FooterBar from "./FooterBar";
import classes from "./Layout.module.css";

function Layout(props) {
  return (
    <div>
      <HeaderBar />
      <div className={classes.content_wrapper}>{props.children}</div>
      <FooterBar />
    </div>
  );
}

export default Layout;
