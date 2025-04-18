import "./App.css";
import FooterNav from "./components/ui/layout/FooterNav";
import Navbar from "./components/ui/layout/Navbar";
import { Outlet, useLocation, matchPath, useNavigate } from "react-router-dom";
import SearchBar from "./components/ui/layout/SearchBar";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState, useRef } from "react";
import startLogoLound from "./assets/images/logo/startLogoLound.png";

/// 스플래시 화면 컴포넌트
const SplashScreen = ({ imageSrc, onFinish }) => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // 페이드인 효과
    setTimeout(() => setFadeIn(true), 300);

    // 이미지 표시 후 일정 시간 뒤에 메인 화면으로 전환
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3000); // 3초 후 전환

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* 이미지 표시 - 아이폰 14 Pro 사이즈에 맞게 조정 */}
      <div className="w-full h-full max-w-[390px] mx-auto flex items-center justify-center">
        <img src={imageSrc} alt="Mall&Mall Logo" className="max-w-full max-h-full object-contain" />
      </div>
    </div>
  );
};

function App() {
  const token = localStorage.getItem("jwtAuthToken");
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  // 스플래시 화면 비디오 경로
  const splashImageSrc = "/startLogoLound.png";

  // 토큰 처리 useEffect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      console.log("🎯 토큰 감지됨, 저장 중:", tokenFromUrl);
      localStorage.setItem("jwtAuthToken", tokenFromUrl);

      // URL에서 token 제거
      urlParams.delete("token");
      const newUrl = window.location.pathname + (urlParams.toString() ? "?" + urlParams.toString() : "");
      window.history.replaceState({}, "", newUrl);
    }
  }, []);

  // 앱 첫 실행 시 스플래시 화면 표시 여부를 로컬 스토리지에서 확인
  useEffect(() => {
    // 페이지 로드마다 항상 스플래시 화면을 표시하도록 설정
    setShowSplash(true);
    // 또는 로컬 스토리지 값을 리셋
    localStorage.removeItem("hasSeenSplash");
  }, []);

  // 스플래시 화면 종료 처리
  const handleSplashFinish = () => {
    setShowSplash(false);
    // 로컬 스토리지 저장 코드 제거
    // localStorage.setItem("hasSeenSplash", "true");
  };

  const location = useLocation();

  // SearchBar를 보여줄 경로 설정
  const isHomeRoute = location.pathname === "/";
  const isProductCategoryRoute = matchPath("/products/:categoryName", location.pathname);
  const isProductCodeRoute = matchPath("/product/:productCode", location.pathname);
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

  // 구글 OAuth 프로바이더 설정
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {showSplash ? (
        <SplashScreen imageSrc={splashImageSrc} onFinish={handleSplashFinish} />
      ) : (
        <div className="flex flex-col App">
          <Navbar />
          {showSearchBar && <SearchBar />}
          <main className="flex-grow overflow-auto">
            <Outlet />
          </main>
          <FooterNav />
        </div>
      )}
    </GoogleOAuthProvider>
  );
}

export default App;
