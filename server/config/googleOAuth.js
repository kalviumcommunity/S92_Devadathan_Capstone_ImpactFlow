function isGoogleOAuthConfigured() {
  return [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL"
  ].every((name) => Boolean(process.env[name]));
}

module.exports = { isGoogleOAuthConfigured };
