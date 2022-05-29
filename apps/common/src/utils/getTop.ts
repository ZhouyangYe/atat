export const getTop = (dom: HTMLElement): number => {
  if (dom?.offsetParent) {
    return dom.offsetTop + getTop(dom.offsetParent as HTMLElement);
  }

  return dom.offsetTop;
};
