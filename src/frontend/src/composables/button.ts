export function useButton(variant?: "normal" | "red" | "amber", size?: "md" | "sm") {
  const btnClass = ["rounded", "active:outline", "outline-2", "outline-neutral-400", "select-none"];

  if (variant === "red") {
    btnClass.push(...["bg-red-600", "hover:bg-red-800", "text-neutral-50"]);
  } else if (variant === "amber") {
    btnClass.push(...["bg-amber-300", "hover:bg-amber-400", "text-neutral-600"]);
  } else {
    btnClass.push(...["bg-neutral-600", "hover:bg-neutral-800", "text-neutral-50"]);
  }

  if (size === "sm") {
    btnClass.push(...["p-2", "text-sm"]);
  } else {
    btnClass.push(...["px-3", "py-2"]);
  }
  return {
    btnClass,
  };
}
