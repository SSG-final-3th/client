import React, { useEffect, useState } from "react";
import { fetchAllEvents, createEvent } from "../../api/httpAdminEvent";
import { fetchAllBranches } from "../../api/httpAdminBranch";
import ListComponents from "../../components/ui/admin/ListComponents";
import GenericForm from "../../components/ui/admin/AddComponents"; // 재사용 가능한 양식 컴포넌트 import

export default function AdminAddEvent() {
  const [error, setError] = useState(null);
  const [eventData, setEventData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // 이벤트 추가 양식을 위한 상태 및 필드 정의
  const [eventValues, setEventValues] = useState({
    category: "",
    eventTitle: "",
    startDate: "",
    endDate: "",
    image: "",
    description: "",
  });

  // 이벤트 양식 필드 정의
  const eventFields = [
    { id: "category", label: "카테고리", type: "text" },
    { id: "eventTitle", label: "이벤트명", type: "text" },
    { id: "startDate", label: "시작일자", type: "datetime-local" },
    { id: "endDate", label: "마감일자", type: "datetime-local" },
    { id: "image", label: "이미지", type: "text" },
    { id: "description", label: "내용", type: "textarea" },
  ];

  // 이벤트 데이터를 가져오는 함수
  const fetchEventData = async () => {
    setIsLoading(true);
    try {
      const eventList = await fetchAllEvents("default");
      console.log("받아온 이벤트 목록:", eventList);

      if (Array.isArray(eventList)) {
        setEventData(eventList);
      } else {
        throw new Error("이벤트 데이터가 배열이 아닙니다.");
      }
    } catch (error1) {
      console.log("Error.name:", error1.name);
      console.log("Error.message:", error1.message);
      setError({ mesg: error1.message });
    } finally {
      setIsLoading(false);
    }
  };

  // 이벤트 추가 처리 함수
  const handleEventSubmit = async (values) => {
    try {
      await createEvent(values); // 이벤트 추가 API 호출

      alert("이벤트가 정상적으로 추가되었습니다.");
      setError(null);

      // 폼 초기화
      setEventValues({
        category: "",
        eventTitle: "",
        startDate: "",
        endDate: "",
        image: "",
        descripton: "",
      });

      await fetchEventData(); // 이벤트 목록을 새로 불러옵니다.
    } catch (error) {
      console.log("이벤트 추가 실패:", error);
      setError({ mesg: "이벤트 추가에 실패했습니다." });
    }
  };

  useEffect(() => {
    fetchEventData(); // 컴포넌트가 마운트되었을 때 이벤트 데이터 가져오기
  }, []);

  // 오류 메시지 컴포넌트
  const errorMessage =
    error && error.mesg ? (
      <div className="p-4 text-red-500 bg-red-100 rounded mb-4">
        <div>{`${error.mesg}`}</div>
      </div>
    ) : null;

  // 행 렌더링 함수 정의
  const renderRow = (event, index) => {
    return (
      <tr
        key={index}
        className="border-b border-gray-200 hover:bg-gray-50 text-sm"
      >
        <td className="px-3 py-3  text">{event.category}</td>
        <td className="px-3 py-3  text w-40">{event.eventTitle}</td>
        <td className={"px-3 py-2 text-xs w-20"}>
          {formatDate(event.endDate)} {/* 날짜 형식 변환 */}
        </td>
        <td className={"px-3 py-2 text-xs w-20"}>
          {formatDate(event.endDate)} {/* 날짜 형식 변환 */}
        </td>
      </tr>
    );
  };

  return (
    <div className="w-full p-4">
      {/* 이벤트 추가 실패 시 오류 메시지 표시 */}
      {errorMessage}

      {/* 재사용 가능한 이벤트 추가 양식 */}
      <div className="mb-6">
        <GenericForm
          title="이벤트 추가"
          fields={eventFields}
          values={eventValues}
          setValues={setEventValues}
          onSubmit={handleEventSubmit}
          submitButtonText="이벤트 추가"
          submitButtonClass="bg-[#ebe2d5] hover:bg-[#ddd3c6]"
        />
      </div>

      <hr className="mb-4" />

      {/* 이벤트 목록 표시 */}
      {isLoading ? (
        <div className="p-4 text-center bg-gray-100 rounded">
          <p>이벤트 데이터를 불러오는 중...</p>
        </div>
      ) : eventData.length > 0 ? (
        <ListComponents
          data={eventData}
          dataType="event"
          renderRow={renderRow}
          showDeleteCheckbox={false}
          text1="카테고리"
          text2="이벤트명"
          text3="시작일자"
          text4="마감일자"
          text6=""
        />
      ) : (
        <div className="p-4 text-center bg-gray-100 rounded">
          <p>등록된 이벤트가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
