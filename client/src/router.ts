import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./views/Home";
import CreateList from "./views/CreateList";
import ViewList from "./views/PokemonList";

export const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/create",
        Component: CreateList,
      },
      {
        path: "/lists/:id",
        Component: ViewList,
      },
    ],
  },
]);
