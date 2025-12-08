import { HeroCategory, NavBarMenuItem } from "@/types";

export const NavBarMenuItems: NavBarMenuItem[] = [
  { label: "home", link: "/home" },
  { label: "menu", link: "/menu" },
];

export const HeroCategories: HeroCategory[] = [
  {
    imgSrc: "/images/dishes.png",
    label: "main",
    link: "/menu?category=main",
  },
  {
    imgSrc: "/images/drinks.png",
    label: "drink",
    link: "/menu?category=drink",
  },
  {
    imgSrc: "/images/deserts.png",
    label: "dessert",
    link: "/menu?category=dessert",
  },
  {
    imgSrc: "/images/snacks.png",
    label: "appetizer",
    link: "/menu?category=appetizer",
  },
];
