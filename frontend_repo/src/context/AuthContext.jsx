import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios"; //API 요청을 위한 라이브러리

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null); //JWT 토큰 상태 추가

  //로그인 처리
  const login = async (userId, password) => {
    try {
      const response = await axios.post("/authentication/login", {
        userId,
        password,
      });
      setToken(response.data.token); //로그인 성공시 토큰 저장
      setUser(response.data.user); // 사용자 정보 저장
    } catch (error) {
      console.log("로그인 실패:", error);
    }
  };

  //로그아웃 처리
  const logout = () => {
    setToken(null); // JWT 토큰 삭제
    setUser(null); // 사용자 정보 삭제
  };

  //useState는 새로고침하면 항상 새로운 정보를 가져오기 때문에 useEffect 사용
  //로그인 상태 확인

  useEffect(() => {
    if (token) {
      //토큰이 있으면 해당 토큰으로 사용자 정보를 불러오는 API 호출
      axios
        .get("/authentication/login", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false); // 사용자 정보 불러오기 실패 시
        });
    } else {
      setIsLoading(false); // 토큰이 없으면 로딩 종료
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  return useContext(AuthContext);
};
