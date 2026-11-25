export const PENDING_KEY = "pending-section";

export function scrollToSection(id: string) {
  if (id === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}