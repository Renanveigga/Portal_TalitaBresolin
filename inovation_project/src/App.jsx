import { useState } from "react";
import "./styles/global.css";

import Sidebar  from "./components/Sidebar/Sidebar";
import Home     from "./pages/Home/Home";
import Library  from "./pages/Library/Library";
import Lost     from "./pages/Lost/Lost";
import Courses  from "./pages/Courses/Courses";
import History  from "./pages/History/History";

const PAGES = {
  home:    <Home />,
  library: <Library />,
  lost:    <Lost />,
  courses: <Courses />,
  history: <History />,
};

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div className="app-layout">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      <main className="app-main">
        {PAGES[currentPage]}
      </main>
    </div>
  );
}