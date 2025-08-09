import { hashPassword, verifyPassword } from "../services/password-service";

describe("password service", () => {
  it("should hash password", async () => {
    const plainTextPassword = "password";

    const hashedPassword = await hashPassword(plainTextPassword);

    expect(hashedPassword).not.toBe(plainTextPassword);
    expect(hashedPassword.startsWith("$2")).toBe(true);
  });

  it("should verify password", async () => {
    const plainTextPassword = "password";
    const hashedPassword = await hashPassword(plainTextPassword);

    const isValid = await verifyPassword(plainTextPassword, hashedPassword);
    const isInvalid = await verifyPassword("wrongpassword", hashedPassword);

    expect(isValid).toBe(true);
    expect(isInvalid).toBe(false);
  });
});
