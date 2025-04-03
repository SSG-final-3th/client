import axios from "axios";

const API_BASE_URL = "http://localhost:8090";

/**
 * 1️⃣ 네이버 로그인 URL 요청
 */
export const getNaverLoginUrl = async () => {
  console.log("🔍 `getNaverLoginUrl` 호출됨!"); // ✅ 함수가 실행되는지 확인

  try {
    const response = await fetch(
      "http://localhost:8090/emart/login/naver/login"
    );
    console.log("✅ fetch 응답 수신 완료:", response); // ✅ 응답 자체가 오는지 확인

    const data = await response.json();
    console.log("✅ 백엔드 응답 데이터:", data); // ✅ JSON 변환이 잘 되는지 확인

    return data.loginUrl;
  } catch (error) {
    console.error("❌ 네이버 로그인 URL 요청 중 오류 발생:", error);
    return null;
  }
};

/**
 * 2️⃣ 네이버 인가 코드로 JWT 요청
 */
export const getNaverJwtToken = async (code, state) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/emart/login/naver`, {
      params: { code, state },
    });

    return response.data; // JWT 응답 (token, userId, role 포함)
  } catch (error) {
    console.error("❌ 네이버 로그인 처리 실패:", error);
    throw error;
  }
};
