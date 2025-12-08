export const getAuthErrorMessage = (backendMessage: string): string => {
  if (!backendMessage) return "operationFailed";

  const msg = backendMessage.toLowerCase();

  if (msg.includes("invalid email or password")) return "invalidCredentials";
  if (
    msg.includes("email already registered") ||
    msg.includes("email already exists")
  )
    return "emailTaken";
  if (msg.includes("user not found")) return "userNotFound";
  if (msg.includes("invalid or expired")) return "invalidToken";
  if (msg.includes("password")) return "passwordWeak";
  if (msg.includes("verify")) return "verifyFirst";

  return "operationFailed";
};
