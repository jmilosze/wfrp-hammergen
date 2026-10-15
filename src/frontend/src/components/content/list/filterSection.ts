// A section of a FilterSidebar: its options are the values an item can be filtered by. collapsed: starts folded (e.g.
// long lists such as sources).
export type FilterSection = {
  key: string;
  title: string;
  collapsed?: boolean;
  options: { text: string; value: string; heading?: string }[];
};
