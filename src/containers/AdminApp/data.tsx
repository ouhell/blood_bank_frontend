import {
  Building2,
  Calendar,
  Droplets,
  HeartHandshake,
  LucideIcon,
  User,
} from "lucide-react";
import { ReactNode } from "react";
import AddAccount from "./pages/AddAccount";
import ListAccounts from "./pages/ListAccounts";
import ListDemands from "./pages/ListDemands";
import ListDonations from "./pages/ListDonations";
import ListAppointments from "./pages/ListAppointments";
import ListHospitals from "./pages/ListHospitals";
import AddHospital from "./pages/AddHospital";

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
        path: "/accounts/add",
        element: <AddAccount />,
      },
      {
        name: "List Accounts",
        path: "/accounts",
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
        name: "List Demands",
        path: "/demands",
        element: <ListDemands />,
      },
    ],
    icon: HeartHandshake,
  },
  {
    parentPath: "",
    name: "Donations",
    routes: [
      {
        name: "List Donations",
        path: "/donations",
        element: <ListDonations />,
      },
    ],
    icon: Droplets,
  },
  {
    parentPath: "",
    name: "Appointments",
    routes: [
      {
        name: "List Appointments",
        path: "/appointments",
        element: <ListAppointments />,
      },
    ],
    icon: Calendar,
  },
  {
    parentPath: "",
    name: "Hospitals",
    routes: [
      {
        name: "Add Hospital",
        path: "/hospitals/add",
        element: <AddHospital />,
      },
      {
        name: "List Hospitals",
        path: "/hospitals",
        element: <ListHospitals />,
      },
    ],
    icon: Building2,
  },
];

export const routeDomains: RouteDomain[] = [
  {
    domainPath: "",
    domainName: "",
    routeConfigs: managementRoutes,
  },
];
