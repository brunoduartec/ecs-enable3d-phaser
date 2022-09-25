export class Concretefactory {
  private product: any;

  constructor() {
    this.product = {};
  }

  public addProduct(name: string, component: any) {
    if (!name || !component) {
      return;
    }
    this.product[name] = component;
  }

  public getProduct(name: string) {
    return this.product[name];
  }

  public removeProduct(name) {
    this.product[name] = null;
  }
}
