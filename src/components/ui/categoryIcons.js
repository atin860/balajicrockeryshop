import { Salad, Disc3, LayoutGrid, CupSoda, Package, Soup, Utensils, PartyPopper, ImageIcon } from 'lucide-react';

/** Lucide icon for each category id — used in image fallbacks, filters and menus. */
const categoryIcons = {
  dona: Salad,
  pattal: Disc3,
  thali: LayoutGrid,
  glasses: CupSoda,
  foil: Package,
  bowls: Soup,
  spoons: Utensils,
  combo: PartyPopper,
};

export const getCategoryIcon = (id) => categoryIcons[id] || ImageIcon;

export default categoryIcons;
