import { Navigate, useSearchParams } from "react-router-dom";
import { getGoogleLoginUrl } from "../api/auth";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { user, loading } = useAuth();
  const [params] = useSearchParams();
  const error = params.get("error");

  if (loading) {
    return (
      <div className="page center">
        <p className="muted">Loading…</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page login">
      <div className="login-panel">
        <p className="brand">Auth Starter</p>
        <h1>Sign in to continue</h1>
        <p className="lede">
          Use your Google account to access this starter app.
        </p>
        {error ? (
          <p className="error" role="alert">
            Sign-in failed. Please try again.
          </p>
        ) : null}
        <a className="btn google" href={getGoogleLoginUrl()}>
          Sign in with Google
        </a>
      </div>
    </div>
  );
}
