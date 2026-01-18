export type Session = {
  userId: string;
  displayName: string;
};

export function getDemoSession(): Session {
  return {
    userId: "demo-user",
    displayName: "Guest"
  };
}
