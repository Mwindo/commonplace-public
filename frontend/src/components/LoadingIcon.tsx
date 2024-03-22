import classes from "./LoadingIcon.module.css";

function LoadingIcon({ size = "80px" }: { size?: string }) {
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
