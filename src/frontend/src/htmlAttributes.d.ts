export {};

// Attributes the app puts on plain elements that Vue's DOM types don't list (templates are checked strictly).
declare module "vue" {
  interface HTMLAttributes {
    // A SheetTable cell's label (SheetGroup and SheetTable shrink labels through it).
    "data-sheet-label"?: boolean | string;
    // A page printed at desktop layout, scaled to the paper (style.css).
    "data-print-desktop"?: boolean | string;
    // The browser's popover attribute (InfoTip).
    popover?: "auto" | "manual" | "";
  }
}
