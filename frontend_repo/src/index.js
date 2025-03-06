import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ BrowserRouter 추가
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./pages/error/NotFound";
import Home from "./pages/Home";
import AllProudcts from "./pages/product/AllProducts";

import Login from "./pages/login/Login";
import Mypage from "./pages/Mypage";
import FindId from "./pages/login/FindId";
import { action as authAction } from "./pages/login/Login";
import { tokenProviderLoader } from "./auth/tokenProviderService";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    id: "root",
    loader: tokenProviderLoader, // 로그인시 localStorage에 저장된 token과 userid값을 필요시 제공하는 역할 담당.
    children: [
      { index: true, path: "/", element: <Home /> },
      //{ path: "/products", element: <AllProudcts /> },
      { path: "/login", element: <Login />, action: authAction },
      { path: "/mypage", element: <Mypage /> },
      { path: "/findid", element: <FindId /> },
      // {
      //   path: "/products/new",
      //   element: (
      //     <ProtectedRoute requireAdmin>
      //       <NewProduct />
      //     </ProtectedRoute>
      //   ),
      // },
      // { path: "/products/:id", element: <ProductDetail /> },
      // {
      //   path: "/carts",
      //   element: (
      //     <ProtectedRoute>
      //       <MyCart />
      //     </ProtectedRoute>
      //   ),
      // },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
