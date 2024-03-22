function NetworkErrorPage() {
  return (
    <div>
      <h2>We're having trouble contacting the backend servers.</h2>
      {window.navigator.onLine ? (
        <h3>
          This looks like an error on our end. Please hold tight as we fix the
          issue.
        </h3>
      ) : (
        <h3>Make sure your Internet connection is working.</h3>
      )}
    </div>
  );
}

export default NetworkErrorPage;
