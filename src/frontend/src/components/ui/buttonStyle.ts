// The look of AppButton and ButtonLink: bordered, with an icon. The app uses only these four:
// - dark: the top navigation bar's brand and parchment, for the calls to action outside the editors (the front page,
//   Create new on the lists);
// - light: parchment with brand text, for the actions of the log in and account pages and the editors' Save;
// - neutral (the default): light grey, for every ordinary action;
// - danger: red outline, for deleting.
// lg is for the few big calls to action (e.g. the front page and the log in form).
export type ButtonVariant = "dark" | "neutral" | "danger" | "light";
export type ButtonSize = "md" | "lg";

export const BUTTON_VARIANT_CLASS: Record<ButtonVariant, string> = {
  dark: "bg-brand border-brand-dark text-parchment transition-colors duration-100 hover:bg-brand-dark",
  light: "bg-parchment border-parchment-dark text-brand-dark  transition-colors duration-100 hover:bg-parchment-dark",
  neutral:
    "bg-neutral-100 border-neutral-400 text-neutral-800 font-medium transition-colors duration-100 hover:bg-neutral-200",
  danger: "bg-white border-danger-border text-danger font-medium transition-colors duration-100 hover:bg-danger-hover",
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
