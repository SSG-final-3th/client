import axios from "axios";

// Axios 인스턴스 설정
const instance = axios.create({
  baseURL: "http://k9testspringboot-env.eba-kduvbera.us-east-2.elasticbeanstalk.com/emart",

  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// 찾기
export async function fetchSearchProducts(productName) {
  console.log("fetchSearchProducts 요청");

  const response = await instance.get(`/product/search/${productName}`);

  console.log("fetchSearchProducts.response:", response);
  return response;
}
