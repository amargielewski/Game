export class Overlay {
  private readonly root: HTMLElement;

  constructor(elementId: string) {
    const element = document.getElementById(elementId);

    if (!element) {
      throw new Error(`Missing overlay element #${elementId}`);
    }

    this.root = element;
  }

  public show(): void {
    this.root.hidden = false;
  }

  public hide(): void {
    this.root.hidden = true;
  }

  public onAction(name: string, handler: () => void): void {
    this.require(`[data-action="${name}"]`).addEventListener('click', () => {
      handler();
    });
  }

  public onSubmit(handler: () => void): void {
    this.require('form').addEventListener('submit', (event) => {
      event.preventDefault();
      handler();
    });
  }

  public setText(field: string, text: string): void {
    this.require(`[data-field="${field}"]`).textContent = text;
  }

  public setVisible(field: string, isVisible: boolean): void {
    this.require(`[data-field="${field}"]`).hidden = !isVisible;
  }

  public field<TElement extends HTMLElement>(name: string): TElement {
    return this.require(`[data-field="${name}"]`) as TElement;
  }

  private require(selector: string): HTMLElement {
    const element = this.root.querySelector<HTMLElement>(selector);

    if (!element) {
      throw new Error(`Missing element ${selector} inside #${this.root.id}`);
    }

    return element;
  }
}
