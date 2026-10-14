// The look of SectionButton and SectionLink: bordered, with an icon. The app uses only these three:
// - dark: the top navigation bar's brand and parchment, for the calls to action outside the editors (the front page,
//   Create new on the lists);
// - neutral (the default): light grey, for every ordinary action, and the only kind in the editors and account pages
//   besides danger;
// - danger: red outline, for deleting.
// lg is for the few big calls to action (e.g. the front page and the log in form); responsive is md on phones and lg
// from sm up.
export type ButtonVariant = "dark" | "neutral" | "danger";
export type ButtonSize = "md" | "lg" | "responsive";

export const BUTTON_VARIANT_CLASS: Record<ButtonVariant, string> = {
  dark: "bg-brand border-brand-dark text-parchment transition-colors duration-150 hover:bg-brand-dark",
  neutral: "bg-neutral-100 border-neutral-400 text-neutral-800 font-medium hover:bg-neutral-200",
  danger: "bg-white border-danger-border text-danger font-medium hover:bg-danger-hover",
};

export const BUTTON_SIZE_CLASS: Record<ButtonSize, string> = {
  md: "gap-1 px-2 py-1 text-sm",
  lg: "gap-2 px-4 py-2 text-base",
  responsive: "gap-1 px-2 py-1 text-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-base",
};

export const BUTTON_ICON_SIZE_CLASS: Record<ButtonSize, string> = {
  md: "size-4",
  lg: "size-5",
  responsive: "size-4 sm:size-5",
};

export const BUTTON_BASE_CLASS =
  "inline-flex items-center justify-center rounded border whitespace-nowrap select-none cursor-pointer";
