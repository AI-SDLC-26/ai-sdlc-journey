const STATUS_VARIANTS = new Set(["active", "paused", "inactive"]);

export function getStatusClassName(status: string) {
  const slug = status.trim().toLowerCase().replace(/\s+/g, "-");
  const variant = STATUS_VARIANTS.has(slug) ? slug : "unknown";

  return `app-shell__status--${variant}`;
}
