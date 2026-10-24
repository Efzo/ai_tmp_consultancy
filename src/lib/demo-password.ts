let demoPasswordOverride: string | undefined;
let demoResetToken: string | undefined;

export function getDemoPassword() {
  return demoPasswordOverride ?? process.env.ADMIN_PASSWORD;
}

export function setDemoPassword(password: string) {
  demoPasswordOverride = password;
}

export function createDemoResetToken() {
  demoResetToken = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return demoResetToken;
}

export function consumeDemoResetToken(token: string) {
  if (!demoResetToken || token !== demoResetToken) return false;
  demoResetToken = undefined;
  return true;
}
