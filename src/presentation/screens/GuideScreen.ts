import { Overlay } from '../Overlay';
import { translateFood } from '../strings';
import { GAME_CONFIG } from '../../config/GameConfig';
import { FOOD_URLS } from '../../config/assets';
import { ITEM_DEFINITIONS, ITEM_KINDS, isHazard, type ItemKind } from '../../config/items';

export class GuideScreen {
  public readonly overlay = new Overlay('screen-guide');
  private readonly goodList = this.overlay.field<HTMLUListElement>('good');
  private readonly badList = this.overlay.field<HTMLUListElement>('bad');

  constructor(onBack: () => void) {
    this.overlay.onAction('back', onBack);
  }

  public present(): void {
    this.fill(
      this.goodList,
      ITEM_KINDS.filter((kind) => !isHazard(ITEM_DEFINITIONS[kind])),
    );
    this.fill(
      this.badList,
      ITEM_KINDS.filter((kind) => isHazard(ITEM_DEFINITIONS[kind])),
    );
  }

  private fill(list: HTMLUListElement, kinds: readonly ItemKind[]): void {
    list.replaceChildren();

    for (const kind of kinds) {
      list.appendChild(this.buildRow(kind));
    }
  }

  private buildRow(kind: ItemKind): DocumentFragment {
    const template = document.getElementById(GAME_CONFIG.dom.foodRowTemplateId);

    if (!(template instanceof HTMLTemplateElement)) {
      throw new Error(`Missing template #${GAME_CONFIG.dom.foodRowTemplateId}`);
    }

    const row = template.content.cloneNode(true) as DocumentFragment;
    const icon = row.querySelector('[data-field="icon"]');
    const name = translateFood(kind);
    const points = ITEM_DEFINITIONS[kind].points;

    if (icon instanceof HTMLImageElement) {
      icon.src = FOOD_URLS[kind];
      icon.alt = name;
    }

    this.fillField(row, 'name', name);
    this.fillField(row, 'points', points > 0 ? `+${points}` : String(points));

    return row;
  }

  private fillField(row: DocumentFragment, field: string, text: string): void {
    const element = row.querySelector(`[data-field="${field}"]`);

    if (element) {
      element.textContent = text;
    }
  }
}
