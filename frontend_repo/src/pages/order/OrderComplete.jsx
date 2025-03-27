import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

const OrderComplete = () => {
  const { imp_uid: paramImpUid } = useParams(); // PC 환경에서 경로 기반으로 전달받은 imp_uid
  const [searchParams] = useSearchParams(); // 모바일 환경에서 ?imp_uid=... 로 전달된 값
  const [orders, setOrders] = useState([]); // 여러 개의 주문을 저장하는 상태
  const [error, setError] = useState("");

  const impUid = paramImpUid || searchParams.get("imp_uid"); // 둘 중 하나 사용

  useEffect(() => {
    if (!impUid) {
      setError("결제 정보가 없습니다.");
      return;
    }

    axios
      .get(`http://localhost:8090/emart/order/complete/${impUid}`)
      .then((res) => setOrders(res.data)) // 여러 개의 주문을 받기
      .catch(() => setError("결제 정보 조회에 실패했습니다."));
  }, [impUid]);

  if (error) {
    return <div className="text-center mt-10 text-red-500 font-semibold">{error}</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center mt-10 text-gray-600 font-semibold">결제 정보를 불러오는 중입니다...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-center text-green-600 mb-6">🎉 결제가 완료되었습니다!</h2>
      <div className="space-y-4">
        {orders.map((item) => (
          <div key={item.orderId} className="flex items-center justify-between p-4 border-b border-gray-200">
            {/* 상품 사진 */}
            <img src={item.image} alt={item.productName} className="w-20 h-20 object-cover rounded-md mr-4" />
            <div className="flex-1">
              <p>
                <strong>상품명:</strong> {item.productName}
              </p>
              <p>
                <strong>수량:</strong> {item.quantity}
              </p>
              <p>
                <strong>가격:</strong> {item.orderPrice.toLocaleString()}원
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <p className="text-lg font-semibold">주문이 성공적으로 완료되었습니다.</p>
        <p>주문 번호: {orders[0].orderId}</p>
        <p>결제번호 (imp_uid): {orders[0].impUid}</p>
      </div>
    </div>
  );
};

export default OrderComplete;
