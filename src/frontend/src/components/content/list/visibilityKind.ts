import { Visibility } from "../../../services/wh/core/entity.ts";

// How an entry's visibility is shown to the viewer: the icon, a short label and the colours of the badge and icon.
// Shared entries look different to their owner (shared by me) and to linked accounts (shared with me).
export type VisibilityKind = "public" | "mine" | "sharedByMe" | "sharedWithMe";

export const VISIBILITY_KINDS: Record<
  VisibilityKind,
  { icon: string; label: string; description: string; badgeClass: string; iconClass: string }
> = {
  public: {
    icon: "material-symbols:globe",
    label: "Public",
    description: "Hammergen content, for everyone",
    badgeClass: "bg-public-bg text-public-text border border-public-border",
    iconClass: "text-public-icon",
  },
  mine: {
    icon: "material-symbols:lock",
    label: "Mine",
    description: "yours, not shared",
    badgeClass: "bg-neutral-100 text-neutral-700 border border-neutral-300",
    iconClass: "text-neutral-500",
  },
  sharedByMe: {
    icon: "material-symbols:backup",
    label: "Shared by me",
    description: "yours, shared with linked accounts",
    badgeClass: "bg-shared-by-me-bg text-shared-by-me-text border border-shared-by-me-border",
    iconClass: "text-shared-by-me-icon",
  },
  sharedWithMe: {
    icon: "material-symbols:cloud-download",
    label: "Shared with me",
    description: "shared from a linked account",
    badgeClass: "bg-shared-with-me-bg text-shared-with-me-text border border-shared-with-me-border",
    iconClass: "text-shared-with-me-icon",
  },
};

export function visibilityKind(canEdit: boolean, visibility: Visibility): VisibilityKind {
  if (visibility === Visibility.Public) {
    return "public";
  }
  if (visibility === Visibility.Shared) {
    return canEdit ? "sharedByMe" : "sharedWithMe";
  }
  return "mine";
}
