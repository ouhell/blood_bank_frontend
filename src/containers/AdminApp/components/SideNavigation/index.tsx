import { motion as m } from "framer-motion";

import NavigationGroupHolder from "./components/NavigationGroupHolder";

import { RouteDomain } from "../../data";
import { Route, Routes } from "react-router-dom";

type Props = {
  domains: RouteDomain[];
};
const SideNavigation = ({ domains }: Props) => {
  return (
    <m.nav
      className="w-64 min-w-64  h-full max-h-full px-4 py-8 overflow-auto"
      initial={{
        opacity: 0,
        x: -10,
      }}
      animate={{
        scale: 1,
        opacity: 1,
        x: 0,
        transition: {
          duration: 0.8,
          ease: "easeInOut",
          //   delay: 0.1,
        },
      }}
    >
      <Routes>
        {domains.map((domain) => {
          return (
            <Route
              path={domain.domainPath + "/*"}
              element={<NavigationGroupHolder data={domain.routeConfigs} />}
              key={domain.domainPath}
            />
          );
        })}
      </Routes>
    </m.nav>
  );
};

export default SideNavigation;
