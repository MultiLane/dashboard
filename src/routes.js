import React from "react";

import { Icon } from "@chakra-ui/react";
import { MdBarChart, MdPerson, MdHome } from "react-icons/md";
import { RiRefund2Line } from "react-icons/ri";

// Admin Imports
import MainDashboard from "views/default";

const routes = [
  {
    name: "Dashboard",
    layout: "/",
    path: "default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
];

export default routes;
