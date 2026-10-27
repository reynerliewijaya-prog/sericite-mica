export function allowedAdmin(
  email: string | undefined,
  confirmed: boolean,
  emails: string | undefined,
  fallback: string | undefined,
) {
  const allowed = (emails || fallback || "")
    .split(",")
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
  return (
    confirmed && Boolean(email) && allowed.includes(email!.trim().toLowerCase())
  );
}
