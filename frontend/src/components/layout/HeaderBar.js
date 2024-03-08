import classes from "./HeaderBar.module.css";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import logoutIcon from "../../images/logout-icon.svg";
import { LoginContext } from "../auth/Auth";

function HeaderBar() {
  const [className, setClassName] = useState(classes.header_big);

  const { isAuth, logout } = useContext(LoginContext);

  // Contract the header on scrolling down, expand on scrolling all the way up
  useEffect(() => {
    const resizeHeader = () => {
      if (window.scrollY > 40) {
        setClassName(classes.header_small);
      } else {
        setClassName(classes.header_big);
      }
    };

    window.addEventListener("scroll", resizeHeader);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener("scroll", resizeHeader);
  }, []);

  return (
    <div className={classes.header_bar + " " + className}>
      <div className={classes.header_bar_left}>
        {isAuth && (
          <img
            alt="Log out"
            src={logoutIcon}
            className={classes.logout_button}
            onClick={logout}
            onKeyDown={(e) => {
              if ((e.key = "Enter")) logout();
            }}
            tabIndex="0" // Allow this to be focusable
          />
        )}
      </div>
      <div className={classes.header_bar_middle}>
        <Link aria-label="Home" className={classes.link} to="/">
          Commonplace
        </Link>
      </div>
      <div className={classes.header_bar_right}>
        <Link aria-label="About" className={classes.link} to="/about">
          ?
        </Link>
      </div>
    </div>
  );
}

export default HeaderBar;
