const routesTree = [
  {
    path: "/",
    component: "Home",
    type: "exact",
  },
  { path: "*", component: "Error" },
];

export const componentDefaults = {
  routesTree,
};
