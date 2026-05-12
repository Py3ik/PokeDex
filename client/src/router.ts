import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./views/Home";
import CreateList from "./views/CreateList";
import Collection from "./views/Collection";

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
        path: "/collection/:id",
        Component: Collection,
      },
    ],
  },
]);
