import { motion as m } from "framer-motion";
import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";
import { RouteConfig } from "@/containers/AdminApp/data";
type Props = {
  data: RouteConfig[];
};

const NavigationGroupHolder = ({ data }: Props) => {
  return (
    <m.div className="path-holder flex flex-col gap-4 pl-4">
      {data.map((navGroup) => {
        return (
          <m.div
            key={navGroup.name}
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.4,
                duration: 0.5,
              },
            }}
          >
            <div className="flex pl-2 gap-2 text-gray-100 text-base font-semibold">
              <div>{<navGroup.icon size={20} className="text-red-600" />}</div>
              <div className="text-sm">{navGroup.name}</div>
            </div>
            <div className="pl-12 flex flex-col gap-2 pt-2">
              {navGroup.routes.map((link, index) => {
                return (
                  <NavLink
                    end
                    className={({ isActive }) => {
                      return cn(
                        "text-sm text-muted-foreground hover:underline",
                        {
                          "text-foreground ": isActive,
                        }
                      );
                    }}
                    to={link.path}
                    key={link.name}
                  >
                    <m.div
                      initial={{
                        opacity: 0,
                        x: -10,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: {
                          delay: 0.8 + index * 0.2,
                          duration: 0.8,
                        },
                      }}
                    >
                      {link.name}
                    </m.div>
                  </NavLink>
                );
              })}
            </div>
          </m.div>
        );
      })}
    </m.div>
  );
};

export default NavigationGroupHolder;
