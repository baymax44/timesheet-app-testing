import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Time from "./pages/time";
import Project from "./pages/project";
import LoginPage from "./pages/login";
import Admin from "./pages/admin";
import Navbar from "../src/components/Navbar";
import { useSelector } from "react-redux";
import { selectLogined, selectUserData } from "./redux/appReducer";
const App = () => {
  const logined = useSelector(selectLogined);
  const userData = useSelector(selectUserData);
  return (
    <section>
      {logined && <Navbar />}
      {!logined ? (
        <Routes>
          <Route path="/" element={<LoginPage />}></Route>
          <Route path="/*" element={<Navigate to="/" />}></Route>
        </Routes>
      ) : userData.role === "ADMIN" ? (
        <Routes>
          <Route path="/" element={<Admin />}></Route>
          <Route path="/*" element={<Navigate to="/" />}></Route>
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/time" />}></Route>
          <Route path="/time" element={<Time />}></Route>
          <Route path="/project" element={<Project />}></Route>
          <Route path="/*" element={<Navigate to="/" />}></Route>
        </Routes>
      )}
    </section>
  );
};

export default App;
