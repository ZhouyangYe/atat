export const getLeft = (dom: HTMLElement): number => {
  if (dom?.offsetParent) {
    return dom.offsetLeft + getLeft(dom.offsetParent as HTMLElement);
  }

  return dom.offsetLeft;
};
