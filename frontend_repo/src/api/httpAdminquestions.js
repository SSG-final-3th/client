import axios from "axios";

// 기본 API 설정
const httpAdminquestion = axios.create({
  baseURL: "http://k9testspringboot-env.eba-kduvbera.us-east-2.elasticbeanstalk.com/emart", // 공통 베이스 URL 설정
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 (JWT 토큰 자동 추가)
httpAdminquestion.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtAuthToken"); // 저장된 토큰 가져오기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default httpAdminquestion;
