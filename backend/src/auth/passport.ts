import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import prisma from "../db.js";

export type AppUser = {
  id: string;
  googleId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
};

export function configurePassport() {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:4000";

  if (!clientID || !clientSecret) {
    throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required");
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: `${backendUrl}/auth/google/callback`,
      },
      async (_accessToken, _refreshToken, profile: Profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error("Google account did not provide an email"));
          }

          const user = await prisma.user.upsert({
            where: { googleId: profile.id },
            update: {
              email,
              name: profile.displayName || email,
              avatarUrl: profile.photos?.[0]?.value ?? null,
            },
            create: {
              googleId: profile.id,
              email,
              name: profile.displayName || email,
              avatarUrl: profile.photos?.[0]?.value ?? null,
            },
          });

          return done(null, user);
        } catch (err) {
          return done(err as Error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, (user as AppUser).id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (err) {
      done(err as Error);
    }
  });
}
