export function primerNombre(nombre) {
  return nombre?.trim().split(/\s+/)[0] || "Explorador";
}
