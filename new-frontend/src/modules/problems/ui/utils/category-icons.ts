export const getCategoryIcon = (categoryId: number) => {
  const icons: Record<number, string> = {
    1: 'mdi:code-braces',
    2: 'mdi:language-python',
    3: 'mdi:code-tags',
    4: 'mdi:web',
    5: 'mdi:cloud-search',
    6: 'mdi:console',
    7: 'mdi:calculator-variant',
    8: 'mdi:database',
    9: 'mdi:factory',
    10: 'mdi:shield-crown',
    11: 'mdi:puzzle-outline',
    12: 'mdi:lock',
  };

  return icons[categoryId];
};
