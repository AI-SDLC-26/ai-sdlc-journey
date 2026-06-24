export function getStatusSlug(status: string) {
  return status.toLowerCase().replace(/\s+/g, "-");
}
