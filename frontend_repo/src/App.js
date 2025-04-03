import "./App.css";
import FooterNav from "./components/ui/layout/FooterNav";
import Navbar from "./components/ui/layout/Navbar";
import { Outlet, useLocation, matchPath } from "react-router-dom";
import SearchBar from "./components/ui/layout/SearchBar";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState } from "react";

function App() {
  const location = useLocation();

  // ✅ 현재 저장된 JWT 확인 (디버깅용)
  const token = localStorage.getItem("jwtAuthToken");
  console.log("📌 현재 저장된 JWT:", token);

  // ✅ SearchBar를 보여줄 경로 설정
  const isHomeRoute = location.pathname === "/";
  const isProductCategoryRoute = matchPath(
    "/products/:categoryName",
    location.pathname
  );
  const isProductCodeRoute = matchPath(
    "/product/:productCode",
    location.pathname
  );
  const isSearchRoute = matchPath("/search/:productName", location.pathname);
  const isProductHomeRoute = location.pathname === "/product/home";
  const isFavoriteProductHome = location.pathname === "/favorites";

  const showSearchBar =
    isHomeRoute ||
    isProductCategoryRoute ||
    isProductCodeRoute ||
    isProductHomeRoute ||
    isSearchRoute ||
    isFavoriteProductHome;

  // ✅ 구글 OAuth 프로바이더 설정
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="flex flex-col App">
        <Navbar />
        {showSearchBar && <SearchBar />}
        <main className="flex-grow overflow-auto">
          <Outlet />
        </main>
        <FooterNav />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
