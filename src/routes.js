import React from "react";

import { Icon } from "@chakra-ui/react";
import { MdBarChart, MdPerson, MdHome } from "react-icons/md";
import { RiRefund2Line } from "react-icons/ri";

// Admin Imports
import MainDashboard from "views/default";
import ManageFunds from "views/managefunds";
import Profile from "views/profile";

const routes = [
  {
    name: "Dashboard",
    layout: "/",
    path: "default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
  {
    name: "Manage funds",
    layout: "/",
    path: "manage-funds",
    icon: (
      <Icon as={RiRefund2Line} width='20px' height='20px' color='inherit' />
    ),
    component: ManageFunds,
  },
  {
    name: "Profile",
    layout: "/",
    path: "profile",
    icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
    component: Profile,
  },
];

export default routes;
