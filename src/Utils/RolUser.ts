export type RolUser = "Patient" | "Admin" | "Practitioner";

export function loadUserRoleFromLocalStorage() {
  const storedUserRole = localStorage.getItem("userRol");
  if (
    storedUserRole === "Patient" ||
    storedUserRole === "Practitioner" ||
    storedUserRole === "Admin"
  )
    return storedUserRole;

  return undefined; // Si es "Patient", devolvemos undefined
}

export function checkPractitionerRol(): boolean {
  return loadUserRoleFromLocalStorage() === "Practitioner";
}

export function checkPatientRol(): boolean {
  return loadUserRoleFromLocalStorage() === "Patient";
}

export function checkAdminRol(): boolean {
  return loadUserRoleFromLocalStorage() === "Practitioner";
}

export function isAdmin(): boolean {
  return loadUserRoleFromLocalStorage() === "Admin";
}

export function isAdminOrPractitioner(): boolean {
  const rol = loadUserRoleFromLocalStorage();
  return rol === "Practitioner" || rol === "Admin";
}
