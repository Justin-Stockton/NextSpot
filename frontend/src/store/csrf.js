const csrfToken = () =>
  document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("csrf_token="))
    ?.split("=")[1];

export const csrfFetch = async (url, options = {}) => {
  if (!csrfToken()) await fetch("/api/auth/");
  return fetch(url, {
    ...options,
    headers: { ...options.headers, "X-CSRFToken": csrfToken() },
  });
};
