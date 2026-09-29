import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="page home">
      <header className="topbar">
        <p className="brand">Auth Starter</p>
        <button type="button" className="btn ghost" onClick={() => void handleLogout()}>
          Log out
        </button>
      </header>

      <main className="profile">
        {user.avatarUrl ? (
          <img className="avatar" src={user.avatarUrl} alt="" width={72} height={72} />
        ) : (
          <div className="avatar placeholder" aria-hidden>
            {user.name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <h1>Welcome, {user.name}</h1>
        <p className="muted">{user.email}</p>
        <p className="lede">You are signed in. This page is protected by your session cookie.</p>
      </main>
    </div>
  );
}
