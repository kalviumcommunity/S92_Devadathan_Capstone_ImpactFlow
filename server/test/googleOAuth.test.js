const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { isGoogleOAuthConfigured } = require("../config/googleOAuth");

const GOOGLE_SETTINGS = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL"
];

describe("isGoogleOAuthConfigured", () => {
  it("returns false when OAuth settings are missing", (t) => {
    const previousValues = GOOGLE_SETTINGS.map((name) => process.env[name]);
    t.after(() => {
      GOOGLE_SETTINGS.forEach((name, index) => {
        if (previousValues[index] === undefined) {
          delete process.env[name];
        } else {
          process.env[name] = previousValues[index];
        }
      });
    });

    GOOGLE_SETTINGS.forEach((name) => delete process.env[name]);

    assert.equal(isGoogleOAuthConfigured(), false);
  });

  it("returns false when some OAuth settings are missing", (t) => {
    const previousValues = GOOGLE_SETTINGS.map((name) => process.env[name]);
    t.after(() => {
      GOOGLE_SETTINGS.forEach((name, index) => {
        if (previousValues[index] === undefined) {
          delete process.env[name];
        } else {
          process.env[name] = previousValues[index];
        }
      });
    });

    process.env.GOOGLE_CLIENT_ID = "test-client";
    process.env.GOOGLE_CLIENT_SECRET = "test-secret";
    delete process.env.GOOGLE_CALLBACK_URL;

    assert.equal(isGoogleOAuthConfigured(), false);
  });

  it("returns true when all OAuth settings are present", (t) => {
    const previousValues = GOOGLE_SETTINGS.map((name) => process.env[name]);
    t.after(() => {
      GOOGLE_SETTINGS.forEach((name, index) => {
        if (previousValues[index] === undefined) {
          delete process.env[name];
        } else {
          process.env[name] = previousValues[index];
        }
      });
    });

    process.env.GOOGLE_CLIENT_ID = "test-client";
    process.env.GOOGLE_CLIENT_SECRET = "test-secret";
    process.env.GOOGLE_CALLBACK_URL =
      "http://localhost:8080/auth/google/callback";

    assert.equal(isGoogleOAuthConfigured(), true);
  });
});
