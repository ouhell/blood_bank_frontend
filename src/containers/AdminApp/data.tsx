import { Droplets, HeartHandshake, LucideIcon, User } from "lucide-react";
import { ReactNode } from "react";
import AddAccount from "./pages/AddAccount";
import ListAccounts from "./pages/ListAccounts";

export type RouteData = {
  path: string;
  element: ReactNode;
  name: string;
};

export type RouteConfig = {
  parentPath: string;
  name: string;
  icon: LucideIcon;
  routes: RouteData[];
};

export type RouteDomain = {
  domainPath: string;
  domainName: string;
  routeConfigs: RouteConfig[];
};

const managementRoutes: RouteConfig[] = [
  {
    parentPath: "",
    name: "Account Management",
    routes: [
      {
        name: "Add Doctor",
        path: "/management/accounts/add",
        element: <AddAccount />,
      },
      {
        name: "List Accounts",
        path: "/management/accounts",
        element: <ListAccounts />,
      },
    ],
    icon: User,
  },
  {
    parentPath: "",
    name: "Demand Management",
    routes: [
      {
        name: "Arrange Appointments",
        path: "/management/demands/add",
        element: null,
      },
      {
        name: "List Demands",
        path: "/management/demands",
        element: null,
      },
    ],
    icon: HeartHandshake,
  },
  {
    parentPath: "",
    name: "Donation Management",
    routes: [
      {
        name: "Arrange Appointments",
        path: "/management/donations/add",
        element: null,
      },
      {
        name: "List Donations",
        path: "/management/donations",
        element: null,
      },
    ],
    icon: Droplets,
  },
];

export const routeDomains: RouteDomain[] = [
  {
    domainPath: "/management",
    domainName: "Management",
    routeConfigs: managementRoutes,
  },
];
