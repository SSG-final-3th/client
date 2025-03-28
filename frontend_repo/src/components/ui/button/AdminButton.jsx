import React from "react";
import { CiSearch } from "react-icons/ci"; // 조회 아이콘
import { CiCircleCheck } from "react-icons/ci"; // 등록 아이콘
import { MdOutlineUpdate } from "react-icons/md"; // 수정 아이콘
import { TiDeleteOutline } from "react-icons/ti"; // 삭제 아이콘

export default function AdminButton({
  text,
  onSearch,
  onRegister,
  onUpdate,
  onDelete,
  onClick,
  disabled = false,
}) {
  return (
    <div
      className="inline-flex rounded-sm shadow-xs mt-4 mr-3 border-2 "
      role="group"
    >
      {/* 첫 번째 버튼: 텍스트를 받는 칸 */}
      <button
        type="button"
        onClick={onClick}
        className="flex-1 text-white justify-center rounded-none bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium text-sm px-2 py-2 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 border-r border-gray-200"
      >
        {text}
      </button>
      {/* 조회 버튼 */}
      <button
        type="button"
        onClick={onSearch || onClick}
        className="flex-1 rounded-none inline-flex items-center px-2 py-2 text-sm font-medium text-gray-900 bg-white border-0 border-r border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
      >
        <CiSearch /> 조회
      </button>
      {/* 등록 버튼 */}
      <button
        type="button"
        onClick={onRegister || onClick}
        className="flex-1 rounded-none inline-flex items-center px-2 py-2 text-sm font-medium text-gray-900 bg-white border-0 border-r border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
      >
        <CiCircleCheck className="mr-1" /> 등록
      </button>
      {/* 수정 버튼 */}
      <button
        type="button"
        onClick={text === "개별" ? null : onUpdate || onClick} // text가 "개별"일 때 onUpdate가 실행되지 않음
        disabled={text === "개별"} // text가 "개별"일 때 버튼 비활성화
        className={`flex-1 rounded-none inline-flex items-center px-2 py-2 text-sm font-medium text-gray-900 bg-white border-0 border-r border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white ${
          text === "개별" ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        <MdOutlineUpdate className="mr-1" /> 수정
      </button>
      {/* 삭제 버튼 */}
      <button
        type="button"
        onClick={onDelete || onClick}
        className="flex-1 inline-flex items-center px-2 py-2 text-sm rounded-none font-medium text-gray-900 bg-white border-0 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
      >
        <TiDeleteOutline className="mr-1" /> 삭제
      </button>
    </div>
  );
}
