import passport from "passport";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_CALLBACK_URL,
      scope: ["openid", "profile", "email"], // 🔥 ubah scope-nya juga
      state: true,
    },
    (accessToken, refreshToken, profile, done) => {
      // 🔥 FIX DI SINI
      if (!profile.id && profile.sub) {
        profile.id = profile.sub; // fallback ke sub
      }

      console.log("✅ LinkedIn profile:", profile);
      done(null, profile);
    }
  )
);

export default passport;
