import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Shield } from "lucide-react";
import { type RouteDomain } from "../../data";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

type Props = {
  domains: RouteDomain[];
};
const Header = ({ domains }: Props) => {
  return (
    <header className="fixed w-full  header z-20 max-h-14 h-14 min-h-14 border-b flex justify-between items-center px-4">
      <div className="flex gap-2 items-center">
        <Shield className="text-red-600" />
        <div className="text-lg font-bold ">BloodAdmin</div>
      </div>
      <nav className="flex items-center gap-2">
        {domains.map((domain) => {
          return (
            <NavLink
              to={domain.domainPath}
              key={domain.domainName}
              className={({ isActive }) =>
                cn("text-foreground/60 font-light text-[0.9rem]", {
                  "text-white ": isActive,
                })
              }
            >
              <div>{domain.domainName}</div>
            </NavLink>
          );
        })}
      </nav>
      <div>
        <Avatar>
          <AvatarImage />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;
