import { useEffect, useState } from "react";
import { ReactComponent as Arrow } from "../../assets/svg/arrow-right.svg";
import "./BackToTop.css";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const scrollHandler = () => {
      window.scrollY > 200 && setVisible(true);
      window.scrollY < 200 && setVisible(false);
    };
    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const backToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`backtotop-button ${visible ? "visible-btt" : ""}`}
      onClick={backToTop}
    >
      <Arrow className="icon-up" />
    </div>
  );
};

export default BackToTop;
