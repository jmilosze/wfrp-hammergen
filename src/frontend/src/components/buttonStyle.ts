// The look of SectionButton and SectionLink: bordered, with an icon. primary (yellow) is a page's or form's main
// action, neutral (white) the others, danger (red outline) deleting. lg is for the few big calls to action (e.g. the
// front page and the log in form).
export type ButtonVariant = "primary" | "secondary" | "neutral" | "danger";
export type ButtonSize = "md" | "lg";

export const BUTTON_VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-primary-200 border-primary-400 text-neutral-900 hover:bg-primary-300",
  secondary: "bg-neutral-200 border-neutral-400 text-neutral-900 hover:bg-neutral-300",
  neutral: "bg-white border-neutral-400 text-neutral-800 hover:bg-neutral-200",
  danger: "bg-white border-danger-400 text-danger-700 hover:bg-danger-50",
};

export const BUTTON_SIZE_CLASS: Record<ButtonSize, string> = {
  md: "gap-1 px-2 py-1 text-sm",
  lg: "gap-2 px-4 py-2 text-base",
};

export const BUTTON_ICON_SIZE_CLASS: Record<ButtonSize, string> = {
  md: "size-4",
  lg: "size-5",
};

export const BUTTON_BASE_CLASS =
  "inline-flex items-center justify-center rounded border font-medium whitespace-nowrap select-none cursor-pointer";
