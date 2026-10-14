// The look of SectionButton and SectionLink: bordered, with an icon. The app uses only these four:
// - primary: emphasised amber, for the main call to action outside the editors (e.g. on the front page);
// - dark: the top navigation bar's oxblood and parchment, e.g. Create new on the lists;
// - neutral (the default): white, for every ordinary action, and the only kind in the editors and account pages
//   besides danger;
// - danger: red outline, for deleting.
// lg is for the few big calls to action (e.g. the front page and the log in form).
export type ButtonVariant = "primary" | "dark" | "neutral" | "danger";
export type ButtonSize = "md" | "lg";

export const BUTTON_VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-primary-300 border-primary-500 text-neutral-700 font-medium hover:bg-primary-400",
  dark: "bg-oxblood border-oxblood-dark text-parchment transition-colors duration-150 hover:bg-oxblood-dark",
  neutral: "bg-neutral-100 border-neutral-400 text-neutral-800 font-medium hover:bg-neutral-200",
  danger: "bg-white border-danger-400 text-danger-700 font-medium hover:bg-danger-50",
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
  "inline-flex items-center justify-center rounded border whitespace-nowrap select-none cursor-pointer";
