import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductDetail } from "../../../api/httpMemberService"; // API 호출

const ProductDetail = () => {
  const { productCode } = useParams(); // URL에서 productCode 가져오기
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ 상품 정보 가져오기
  useEffect(() => {
    const loadProductDetail = async () => {
      try {
        setLoading(true);
        const data = await fetchProductDetail(productCode);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProductDetail();
  }, [productCode]);

  if (loading)
    return (
      <p className="text-center mt-10 text-lg">상품 정보를 불러오는 중...</p>
    );
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!product) return null;

  return (
    <div className="flex flex-col items-center bg-[#f8f5e6] min-h-screen p-6">
      {/*  이미지 컨테이너*/}
      <div className="w-full max-w-md border rounded-lg bg-yellow-400 flex items-center justify-center max-h-[400px]">
        <img
          src={product.image}
          alt={product.productName}
          className="w-full h-auto object-contain p-4"
        />
      </div>

      {/* 상품 정보 */}
      <div className="w-full max-w-md mt-6">
        <h2 className="text-xl font-bold">{product.productName}</h2>
        <p className="text-gray-600">수량 n개 ,추후에 quantity 컬럼 활용</p>
        <p className="text-red-500 font-bold text-lg">
          {product.price.toLocaleString()} 원
        </p>
      </div>

      {/*  상품 설명란란 */}
      <div className="w-full max-w-md bg-yellow-300 p-6 rounded-md mt-4 text-center">
        <p>{product.description}</p>
      </div>
    </div>
  );
};

export default ProductDetail;
