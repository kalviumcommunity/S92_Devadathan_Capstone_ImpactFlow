const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { validateRegistrationInput } = require("../utils/registration");

describe("validateRegistrationInput", () => {
  it("normalizes supplied email, username, and name", () => {
    assert.deepEqual(
      validateRegistrationInput({
        username: "  NGO_Admin ",
        email: "  TEAM@Example.org ",
        name: "  Impact Team  ",
        password: "securepass"
      }),
      {
        error: null,
        normalizedEmail: "team@example.org",
        accountName: "Impact Team",
        accountUsername: "ngo_admin"
      }
    );
  });

  it("uses the normalized email as the username when none is supplied", () => {
    const result = validateRegistrationInput({
      email: "TEAM@Example.org",
      password: "securepass"
    });

    assert.equal(result.error, null);
    assert.equal(result.accountUsername, "team@example.org");
  });

  it("allows registration with a username and no email", () => {
    const result = validateRegistrationInput({
      username: "Impact_Admin",
      password: "securepass"
    });

    assert.equal(result.error, null);
    assert.equal(result.normalizedEmail, undefined);
    assert.equal(result.accountUsername, "impact_admin");
  });

  it("rejects a missing username or email", () => {
    assert.equal(
      validateRegistrationInput({ password: "securepass" }).error,
      "Email and password are required"
    );
  });

  it("rejects malformed email addresses", () => {
    assert.equal(
      validateRegistrationInput({
        email: "not-an-email",
        password: "securepass"
      }).error,
      "Enter a valid email address"
    );
  });

  it("rejects passwords shorter than eight characters", () => {
    assert.equal(
      validateRegistrationInput({
        username: "impact",
        password: "short"
      }).error,
      "Password must be at least 8 characters long"
    );
  });

  it("rejects a provided but blank name", () => {
    assert.equal(
      validateRegistrationInput({
        username: "impact",
        name: "   ",
        password: "securepass"
      }).error,
      "Name cannot be empty"
    );
  });
});
