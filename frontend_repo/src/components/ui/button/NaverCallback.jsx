import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NaverLoginCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1️⃣ URL에서 토큰 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      console.log("✅ 네이버 로그인 성공! JWT:", token);

      // 2️⃣ 로컬 스토리지에 저장
      localStorage.setItem("jwtAuthToken", token);

      // 3️⃣ 홈 화면 또는 원하는 페이지로 이동
      navigate("/");
    } else {
      console.error("❌ JWT 없음!");
      navigate("/login");
    }
  }, [navigate]);

  return <h2>네이버 로그인 중...</h2>; // ✅ 잠시 보이는 화면
}

export default NaverLoginCallback;
