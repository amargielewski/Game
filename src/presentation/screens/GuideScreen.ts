import { Overlay } from '../Overlay';
import { translateFood } from '../strings';
import { cloneTemplateRow } from '../templateRow';
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
    const name = translateFood(kind);
    const points = ITEM_DEFINITIONS[kind].points;
    const row = cloneTemplateRow(GAME_CONFIG.dom.foodRowTemplateId, {
      name,
      points: points > 0 ? `+${points}` : String(points),
    });
    const icon = row.querySelector('[data-field="icon"]');

    if (icon instanceof HTMLImageElement) {
      icon.src = FOOD_URLS[kind];
      icon.alt = name;
    }

    return row;
  }
}
