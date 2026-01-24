export const cardList = /*tailwind*/ "flex flex-col gap-4";
export const border = "border border-neutral-300 dark:border-neutral-700";
export const card = (color?: string) => ({
  className: "flex flex-col gap-1 p-4 rounded-xl shadow-lg",
  style: { backgroundColor: color },
});
