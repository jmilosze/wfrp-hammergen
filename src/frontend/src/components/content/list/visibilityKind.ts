import { Visibility } from "@/services/wh/core/entity.ts";

// How an entry's visibility is shown to the viewer: the icon, its colour and a short label.
// Shared entries look different to their owner (shared by me) and to linked accounts (shared with me).
export type VisibilityKind = "public" | "mine" | "sharedByMe" | "sharedWithMe";

export const VISIBILITY_KINDS: Record<
  VisibilityKind,
  { icon: string; label: string; description: string; iconClass: string }
> = {
  public: {
    icon: "material-symbols:globe",
    label: "Public",
    description: "Hammergen content, for everyone",
    iconClass: "text-public-icon",
  },
  mine: {
    icon: "material-symbols:lock",
    label: "Mine",
    description: "yours, not shared",
    iconClass: "text-neutral-500",
  },
  sharedByMe: {
    icon: "material-symbols:backup",
    label: "Shared by me",
    description: "yours, shared with linked accounts",
    iconClass: "text-shared-icon",
  },
  sharedWithMe: {
    icon: "material-symbols:cloud-download",
    label: "Shared with me",
    description: "shared from a linked account",
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
