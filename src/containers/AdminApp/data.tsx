import {
  Building2,
  Droplets,
  HeartHandshake,
  LucideIcon,
  User,
} from "lucide-react";
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
    name: "Accounts",
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
    name: "Demands",
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
    name: "Donations",
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
  {
    parentPath: "",
    name: "Hospitals",
    routes: [
      {
        name: "Add Hospital",
        path: "/management/donations/add",
        element: null,
      },
      {
        name: "List Hospitals",
        path: "/management/donations",
        element: null,
      },
    ],
    icon: Building2,
  },
];

export const routeDomains: RouteDomain[] = [
  {
    domainPath: "/management",
    domainName: "Management",
    routeConfigs: managementRoutes,
  },
];
