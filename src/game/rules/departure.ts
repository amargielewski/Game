export interface DepartedItem {
  readonly hasFallenBelowScreen: boolean;
  readonly hasDriftedOffScreen: boolean;
}

export function hasLeftTheArena(item: DepartedItem): boolean {
  return item.hasFallenBelowScreen || item.hasDriftedOffScreen;
}

export function costsALife(item: DepartedItem): boolean {
  return item.hasFallenBelowScreen;
}
