export function handleButtonClick(
  element: HTMLElement | null,
  setAnimating: React.Dispatch<React.SetStateAction<boolean>>,
  animating: boolean,
  className: string
) {
  if (animating || !element) return;

  setAnimating(true);
  element.classList.add(className);
  setTimeout(() => element.classList.remove(className), 200);

  const stopId = setInterval(() => {
    element.classList.add(className);
    setTimeout(() => element.classList.remove(className), 200);
  }, 600);

  setTimeout(() => {
    clearInterval(stopId);
    setAnimating(false);
  }, 1200);
}
