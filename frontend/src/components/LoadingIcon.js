import classes from "./LoadingIcon.module.css";

function LoadingIcon(props) {
  const size = props.size || "80px";

  return (
    <div className={classes.loading_wrapper}>
      <div style={{ width: size, height: size }}>
        <div className={classes.loading_ring}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingIcon;
