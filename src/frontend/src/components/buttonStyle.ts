// The look of SectionButton and SectionLink: bordered, with an icon. The app uses only these four:
// - primary: emphasised amber, for the main call to action outside the editors (e.g. on the front page);
// - dark: emphasised dark grey, e.g. Create new on the lists;
// - neutral (the default): white, for every ordinary action, and the only kind in the editors and account pages
//   besides danger;
// - danger: red outline, for deleting.
// lg is for the few big calls to action (e.g. the front page and the log in form).
export type ButtonVariant = "primary" | "dark" | "neutral" | "danger";
export type ButtonSize = "md" | "lg";

export const BUTTON_VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-primary-300 border-primary-500 text-neutral-700 hover:bg-primary-400",
  dark: "bg-neutral-600 border-neutral-800 text-primary-300 hover:bg-neutral-800",
  neutral: "bg-neutral-100 border-neutral-400 text-neutral-800 hover:bg-neutral-200",
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
