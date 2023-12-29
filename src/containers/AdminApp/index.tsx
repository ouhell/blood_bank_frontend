import { ThemeProvider } from "@/components/ThemeProvider";

import SideNavigation from "./components/SideNavigation";
import Header from "./components/Header";

import { RouteData, routeDomains } from "./data";
import { Route, Routes } from "react-router-dom";
import "./admin.css";
const allRoutes = routeDomains.reduce<RouteData[]>((prev, curr) => {
  const routes: RouteData[] = curr.routeConfigs.reduce<RouteData[]>(
    (previous, current) => {
      return previous.concat(current.routes);
    },
    []
  );
  return prev.concat(routes);
}, []);
const AdminApp = () => {
  return (
    <div className="h-screen flex flex-col  overflow-hidden">
      <ThemeProvider defaultTheme="dark">
        <Header domains={routeDomains} />

        <div className="flex h-full overflow-hidden ">
          <SideNavigation domains={routeDomains} />
          <main className="w-full flex-1  overflow-auto pt-14">
            <Routes>
              {allRoutes.map((route) => {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                );
              })}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </div>
  );
};

export default AdminApp;
