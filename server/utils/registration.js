const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegistrationInput(input = {}) {
  const { username, email, name, password } =
    input && typeof input === "object" ? input : {};
  const normalizedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : undefined;
  const accountName = typeof name === "string" ? name.trim() : undefined;
  const usernameOrEmail = username || normalizedEmail;
  const accountUsername =
    typeof usernameOrEmail === "string"
      ? usernameOrEmail.trim().toLowerCase()
      : undefined;

  if (!accountUsername || typeof password !== "string" || !password) {
    return { error: "Email and password are required" };
  }

  if (email != null && typeof email !== "string") {
    return { error: "Enter a valid email address" };
  }

  if (normalizedEmail && !EMAIL_PATTERN.test(normalizedEmail)) {
    return { error: "Enter a valid email address" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long" };
  }

  if (name !== undefined && !accountName) {
    return { error: "Name cannot be empty" };
  }

  return {
    error: null,
    normalizedEmail,
    accountName,
    accountUsername
  };
}

module.exports = { validateRegistrationInput };
