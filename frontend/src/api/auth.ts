export type User = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export function getGoogleLoginUrl() {
  return `${API_URL}/auth/google`;
}

export async function fetchMe(): Promise<User | null> {
  const res = await fetch(`${API_URL}/auth/me`, {
    credentials: "include",
  });

  if (res.status === 401) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to load session");
  }

  return res.json();
}

export async function logout(): Promise<void> {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to log out");
  }
}
