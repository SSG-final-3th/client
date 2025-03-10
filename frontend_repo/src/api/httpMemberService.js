// httpMemberService.js

import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8090/emart", // Boot 서버에 반드시 CORS 설정 필수
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

// 회원가입
export async function fetchSignup(user) {
  console.log("fetchSignup 요청");

  const response = await instance.post(`/signup`, user);

  return response;
}

// 로그인 처리
export async function fetchAuthenticate(authData) {
  const response = await instance.post(`/authenticate`, authData);

  console.log("authenticate.response:", response);

  return response;
}

// 마이페이지 홈
export async function fetchMypageHome(token) {
  const response = await instance.get(`/mypage/home`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

// 회원정보 수정
export async function fetchUpdateProfile(userData, token) {
  console.log("📢 fetchUpdateProfile 요청 URL:", "/mypage/memedit");
  console.log("📢 요청 데이터:", userData);
  console.log("📢 요청 토큰:", token);
  const response = await instance.post(`/mypage/memedit`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("✅ fetchUpdateProfile 응답:", response.data);
  return response;
}

// 회원탈퇴
export async function fetchDeleteAccount(token) {
  console.log("📢 회원탈퇴 요청 URL:", "/mypage/delete");
  console.log("📢 요청 토큰:", token);

  const response = await instance.delete(`/mypage/delete`, {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ JWT 토큰만 포함
    },
  });

  console.log("✅ fetchDeleteAccount 응답:", response);
  return response;
}
