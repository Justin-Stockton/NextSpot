function csrfToken() {
  const cookie = document.cookie.split("; ").find(value => value.startsWith("csrf_token="));
  return cookie ? decodeURIComponent(cookie.split("=").slice(1).join("=")) : "";
}

export function jsonHeaders() {
  return { "Content-Type": "application/json", "X-CSRFToken": csrfToken() };
}
