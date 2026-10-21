// An action of an ActionMenu (or a row of buttons): a labelled button with an icon. title is its tooltip, e.g. why a
// disabled action is off.
export type ActionMenuItem = {
  label: string;
  icon: string;
  action: () => void;
  disabled?: boolean;
  title?: string;
};
