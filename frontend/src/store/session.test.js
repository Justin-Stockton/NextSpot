import { demoLogin, login, signUp } from "./session";

beforeEach(() => {
  document.cookie = "csrf_token=test-token";
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: async () => ({ id: 1 }) }));
});

afterEach(() => jest.restoreAllMocks());

test.each([
  ["login", login("a@example.com", "password"), "/api/auth/login"],
  ["demo login", demoLogin(), "/api/auth/demo"],
  ["signup", signUp("alice", "a@example.com", "password"), "/api/auth/signup"],
])("%s sends the shared JSON and CSRF headers", async (_name, thunk, path) => {
  await thunk(jest.fn());
  expect(fetch).toHaveBeenCalledWith(path, expect.objectContaining({
    method: "POST",
    headers: { "Content-Type": "application/json", "X-CSRFToken": "test-token" },
  }));
});
