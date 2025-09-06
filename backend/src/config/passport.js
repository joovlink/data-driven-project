import linkedInStrategy from "passport-linkedin-oauth2";

const passport = linkedInStrategy();

passport.use(
  new linkedInStrategy({
    cliendID: LINKEDIN_KEY,
    clientSecret: LINKEDIN_SECRET,
    callbackURL: "http://localhost:3000/auth/linkedin/callback",
    scope: ["r_emailaddress", "r_liteprofile"],
    state: true,
  })
);
