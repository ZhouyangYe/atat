class BouncingStar {
  private container: HTMLElement;

  private star: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.createStar();
  }

  private getDom = () => {
    return this.star;
  };

  private createStar = () => {
    this.star = document.createElement('div');
    this.star.id = 'star';
  };
}

export default BouncingStar;
