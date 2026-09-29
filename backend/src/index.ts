import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";
import { configurePassport } from "./auth/passport.js";
import authRoutes from "./auth/routes.js";

const PgSession = connectPgSimple(session);

declare global {
  namespace Express {
    interface User {
      id: string;
      googleId: string;
      email: string;
      name: string;
      avatarUrl: string | null;
    }
  }
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

const port = Number(process.env.PORT ?? 4000);
const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:5173";
const databaseUrl = requiredEnv("DATABASE_URL");
const sessionSecret = requiredEnv("SESSION_SECRET");
const isProd = process.env.NODE_ENV === "production";

configurePassport();

const pool = new pg.Pool({ connectionString: databaseUrl });

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/auth", authRoutes);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
);

app.listen(port, () => {
  console.log(`Auth Starter API listening on http://localhost:${port}`);
});
