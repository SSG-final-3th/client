import React, { useState, useEffect } from "react";
import { fetchMypageHome, fetchUpdateProfile } from "../../api/httpMemberService";
import { useNavigate, useLoaderData } from "react-router-dom";
import { getAuthToken } from "../../auth/tokenProviderService";
import "./EditProfile.css";

const EditProfile = () => {
  const user = useLoaderData();
  const navigate = useNavigate();

  // ✅ 상태 변수 초기화 (기본값: 빈 문자열)
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [post, setPost] = useState("");
  const [addr1, setAddr1] = useState("");
  const [addr2, setAddr2] = useState("");

  // ✅ 회원 정보 불러와서 초기값 설정
  useEffect(() => {
    if (user) {
      setUsername(user.username || ""); // ✅ username으로 변경
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
      setPost(user.post || "");
      setAddr1(user.addr1 || "");
      setAddr2(user.addr2 || "");
    }
  }, [user]);

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        console.log("📢 선택한 주소:", data);
        setPost(data.zonecode);
        setAddr1(data.roadAddress);
      },
    }).open();
  };

  const handleUpdate = async () => {
    try {
      const { token } = getAuthToken();

      // ✅ username으로 변경
      const updatedUsername = username.trim() === "" ? user.username : username;
      const updatedEmail = email.trim() === "" ? user.email : email;
      const updatedPhone = phoneNumber.trim() === "" ? user.phoneNumber : phoneNumber;
      const updatedPost = post.trim() === "" ? user.post : post;
      const updatedAddr1 = addr1.trim() === "" ? user.addr1 : addr1;
      const updatedAddr2 = addr2.trim() === "" ? user.addr2 : addr2;

      console.log("📢 회원정보 수정 API 호출 시도!", {
        username: updatedUsername,
        email: updatedEmail,
        phoneNumber: updatedPhone,
        post: updatedPost,
        addr1: updatedAddr1,
        addr2: updatedAddr2,
      });

      await fetchUpdateProfile(
        {
          username: updatedUsername,
          email: updatedEmail,
          phoneNumber: updatedPhone,
          post: updatedPost,
          addr1: updatedAddr1,
          addr2: updatedAddr2,
        },
        token
      );

      alert("회원정보가 수정되었습니다.");
      navigate("/mypage");
    } catch (error) {
      console.error("❌ 회원정보 수정 실패:", error);
    }
  };

  return (
    <div className="edit-profile">
      <h2>회원정보 수정</h2>

      <div className="input-group">
        <label>이름:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="이름" />
      </div>

      <div className="input-group">
        <label>이메일:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" />
      </div>

      <div className="input-group">
        <label>휴대폰 번호:</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="휴대폰 번호"
        />
      </div>

      <div className="input-group">
        <label>우편번호:</label>
        <div className="address-group">
          <input type="text" value={post} placeholder="우편번호" readOnly />
          <button type="button" onClick={handleAddressSearch}>
            주소 검색
          </button>
        </div>
      </div>

      <div className="input-group">
        <label>주소:</label>
        <input type="text" value={addr1} placeholder="주소" readOnly />
      </div>

      <div className="input-group">
        <label>상세 주소:</label>
        <input type="text" value={addr2} onChange={(e) => setAddr2(e.target.value)} placeholder="상세 주소" />
      </div>

      <div className="button-group">
        <button onClick={handleUpdate} className="save-btn">
          수정 완료
        </button>
        <button onClick={() => navigate("/mypage")} className="cancel-btn">
          취소
        </button>
      </div>
    </div>
  );
};

export async function loader() {
  const { token } = getAuthToken();
  const response = await fetchMypageHome(token);
  return response.data;
}

export default EditProfile;
