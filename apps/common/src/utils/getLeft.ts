export const getLeft = (dom: HTMLElement): number => {
  if (dom?.parentElement) {
    return dom.offsetLeft + getLeft(dom.parentElement);
  }

  return dom.offsetLeft;
};
