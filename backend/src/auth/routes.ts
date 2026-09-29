import { Router, type Request, type Response, type NextFunction } from "express";
import passport from "passport";
import type { AppUser } from "./passport.js";

const router = Router();
const frontendUrl = () => process.env.FRONTEND_URL ?? "http://localhost:5173";

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${frontendUrl()}/login?error=auth_failed`,
    session: true,
  }),
  (_req, res) => {
    res.redirect(frontendUrl());
  }
);

router.get("/me", (req: Request, res: Response) => {
  if (!req.isAuthenticated?.() || !req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = req.user as AppUser;
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
  });
});

router.post("/logout", (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      next(err);
      return;
    }
    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        next(destroyErr);
        return;
      }
      res.clearCookie("connect.sid");
      res.json({ ok: true });
    });
  });
});

export default router;
