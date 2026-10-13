import { Visibility } from "../services/wh/core/entity.ts";

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
    badgeClass: "bg-info-100 text-info-800 border border-info-300",
    iconClass: "text-info-500",
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
    badgeClass: "bg-success-100 text-success-800 border border-success-300",
    iconClass: "text-success-600",
  },
  sharedWithMe: {
    icon: "material-symbols:cloud-download",
    label: "Shared with me",
    description: "shared from a linked account",
    badgeClass: "bg-linked-100 text-linked-800 border border-linked-300",
    iconClass: "text-linked-500",
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
