export function useAuth() {
  const token = sessionStorage.getItem("token");
  return { isAuthenticated: !!token, token };
}
