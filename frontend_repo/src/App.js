import "./App.css";
import FooterNav from "./components/ui/layout/FooterNav";
import Navbar from "./components/ui/layout/Navbar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow h-[506px]">
        <Outlet />
      </main>
      <FooterNav /> {/* 하단에 FooterNav 컴포넌트를 추가 */}
    </div>
  );
}

export default App;

//Provider 전역 설정 <B basename={process.env.PUBLIC_URL}>
// <QueryClientProvider client={queryClient}>
//   <AuthContextProvider>
//     <Navbar />
//     <Outlet />
//   </AuthContextProvider>
// </QueryClientProvider>
