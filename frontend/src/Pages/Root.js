import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import useScrollToTop from "../Components/ScrollToTop";


export default function Root() {
  useScrollToTop();

  return (
    <div>
      <Header />
      <div className="content">
        <Outlet />
      </div>
      <Footer /> 
    </div>
  );
}