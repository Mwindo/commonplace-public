import { useLocation, Navigate } from "react-router-dom";

function LoggedOutPage() {
  const { state } = useLocation();

  // Only allow the app to route to this page
  if (!state?.fromApp) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h2>See you later, alligator! All signed out.</h2>
    </div>
  );
}

export default LoggedOutPage;
