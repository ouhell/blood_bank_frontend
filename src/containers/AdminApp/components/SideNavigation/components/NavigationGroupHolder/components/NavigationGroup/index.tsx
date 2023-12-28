import SideNavigationLink from "./components/SideNavigationLink";
import { LucideIcon } from "lucide-react";

export type NavigationGroupType = {
  name: string;
  links: SideNavigationLink[];
  icon: LucideIcon;
};

export const NavigationGroup = () => {
  return <div></div>;
};

export default NavigationGroup;
