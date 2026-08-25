type RegistrationInput = Partial<
  Record<"name" | "email" | "password" | "confirmPassword", unknown>
>;

export type RegistrationData = {
  name: string | null;
  email: string;
  password: string;
};

export type RegistrationErrors = Partial<
  Record<"name" | "email" | "password" | "confirmPassword", string>
>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegistration(input: RegistrationInput):
  | { data: RegistrationData; errors?: never }
  | { data?: never; errors: RegistrationErrors } {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email =
    typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";
  const confirmPassword =
    typeof input.confirmPassword === "string" ? input.confirmPassword : "";
  const errors: RegistrationErrors = {};

  if (name.length > 80) {
    errors.name = "Name must be 80 characters or fewer.";
  }

  if (!emailPattern.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (password.length > 72) {
    errors.password = "Password must be 72 characters or fewer.";
  }

  if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    data: {
      name: name || null,
      email,
      password,
    },
  };
}
