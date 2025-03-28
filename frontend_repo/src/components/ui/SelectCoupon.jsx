import React from "react";
import { useNavigate } from "react-router-dom";

function SelectCoupon({ coupon, isSelected, onSelect }) {
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용

  // 쿠폰 정보가 없다면 기본적인 메시지 표시
  if (!coupon) {
    return <div>쿠폰 정보가 없습니다.</div>;
  }

  // 쿠폰 데이터 구조에 맞게 값들을 받아옵니다.
  const {
    couponName,
    minPrice,
    expirationDate,
    benefits,
    couponType,
    couponId,
  } = coupon;

  return (
    <div className="coupon-card p-4 border rounded-lg shadow-md mx-full bg-white m-2">
      <div className="flex items-center justify-between">
        {/* 동그라미 선택 버튼 크기 조정 */}
        <input
          type="radio"
          id={`coupon-${couponId}`}
          name="coupon"
          value={couponId}
          checked={isSelected}
          onChange={() => onSelect(coupon)} // 쿠폰 선택 시 부모에게 알려줌
          className="form-radio text-blue-500 w-5 h-5" // 크기 조절
        />

        {/* 쿠폰 정보 */}
        <h3 className="text-lg font-semibold text-center mb-2">{couponName}</h3>
      </div>
      <hr />

      <div className="coupon-details">
        {/* 최소 주문 금액 */}
        <div className="flex justify-end">
          <span className="text-gray-600 mt-2">
            {minPrice} 원 이상 구매 시 사용 가능
          </span>
        </div>

        {/* 만료일 */}
        <div className="flex justify-end">
          <span className="text-gray-600">{expirationDate} 만료</span>
        </div>

        {/* 혜택 */}
        <div className="flex justify-end">
          <span className="text-gray-600">{benefits}</span>
        </div>
      </div>
    </div>
  );
}

export default SelectCoupon;
