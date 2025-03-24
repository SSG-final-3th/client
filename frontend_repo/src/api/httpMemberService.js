import axios from "axios";

// Axios 인스턴스 설정
const instance = axios.create({
  baseURL: "http://localhost:8090/emart",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// 회원가입
export async function fetchSignup(user) {
  console.log("fetchSignup 요청");
  return await instance.post(`/signup`, user);
}

// 로그인 처리
export async function fetchAuthenticate(authData) {
  const response = await instance.post(`/authenticate`, authData);
  console.log("authenticate.response:", response);
  return response;
}

// 마이페이지 홈
export async function fetchMypageHome(token) {
  return await instance.get(`/mypage/home`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// 회원정보 수정
export async function fetchUpdateProfile(userData, token) {
  return await instance.post(`/mypage/memedit`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// 회원탈퇴
export async function fetchDeleteAccount(token) {
  return await instance.delete(`/mypage/delete`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// 상품 관련 API
export async function fetchProductHome() {
  return (await instance.get(`/product/home`)).data;
}

export async function fetchProductDetail(productCode) {
  return (await instance.get(`/product/detail/${productCode}`)).data;
}


// 리뷰 목록 불러오기
// 리뷰 관련 API
export async function fetchProductReviews(productCode) {
  return (await instance.get(`/review/product/${productCode}`)).data;
}

export async function fetchAddReview(reviewData, token) {
  if (!token) throw new Error("🚨 인증 토큰이 없습니다.");

  console.log("전송할 리뷰 데이터:", JSON.stringify(reviewData));

  return (
    await instance.post(`/review/add`, reviewData, {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data;
}

export async function fetchDeleteReview(reviewId, token) {
  return await instance.delete(`/review/delete/${reviewId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchUpdateReview(reviewId, updatedData, token) {
  return await instance.put(`/review/update/${reviewId}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// 특정 사용자의 리뷰 목록
export async function fetchUserReviews(userId, token) {
  return (
    await instance.get(`/review/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data;
}

// 특정 사용자의 주문목록
export async function fetchUserOrderInfo(token) {
  return (
    await instance.get(`/order/myorder`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data;
}

// 🛒 장바구니 관련 API
export async function fetchCartItems(token) {
  if (!token) throw new Error("🚨 인증 토큰이 없습니다.");

  const response = await instance.get(`/cart/items`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!Array.isArray(response.data)) {
    console.error("🚨 서버 응답 형식 오류:", response);
    throw new Error("서버 응답이 배열이 아닙니다.");
  }

  return response.data;
}

export async function addToCart(cartData, token) {
  if (!token) throw new Error("🚨 인증 토큰이 없습니다.");
  if (!cartData.productCode) throw new Error("🚨 상품 코드는 필수입니다.");
  if (typeof cartData.quantity !== "number" || cartData.quantity < 1)
    throw new Error("🚨 수량은 1 이상이어야 합니다.");

  return (
    await instance.post(`/cart/add`, cartData, {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data;
}

export async function removeCartItem(productCode, token) {
  if (!token) throw new Error("🚨 인증 토큰이 없습니다.");
  if (!productCode) throw new Error("🚨 상품 코드는 필수입니다.");

  console.log(`🗑️ 상품(${productCode}) 삭제 요청`);

  return (
    await instance.delete(`/cart/${productCode}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data;
}

export const updateCartQuantity = async (productCode, quantity, token) => {
  if (isNaN(quantity) || quantity < 1) {
    console.error("🚨 잘못된 수량 값:", quantity);
    return;
  }

  return await instance.patch(
    `/cart/${productCode}?quantity=${quantity}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
