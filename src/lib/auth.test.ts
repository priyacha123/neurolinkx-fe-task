import { describe, it, expect, beforeEach } from "vitest";
import { useAuth } from "./auth";

describe("useAuth", () => {
  beforeEach(() => {
    useAuth.getState().logout();
  });

  it("should initialize with no user", () => {
    const state = useAuth.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("should login a user", () => {
    const { login } = useAuth.getState();
    login("test@example.com", "Test User");

    const state = useAuth.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.name).toBe("Test User");
    expect(state.user?.email).toBe("test@example.com");
  });

  it("should logout a user", () => {
    const { login, logout } = useAuth.getState();
    login("test@example.com", "Test User");
    logout();

    const state = useAuth.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});
