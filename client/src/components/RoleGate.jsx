export default function RoleGate({ role, allow, children }) {
  if (!allow.includes(role)) return null;
  return children;
}