import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loadApplied,
  loadFilters,
  loadProductsFound,
  loadProductsOwn,
  loadQuerys,
} from "../../Redux/reducer/productsSlice";
import Carousel from "./Carousel/Carousel";
import { IMAGES } from "../../constants";
import FlashSales from "../common/FlashSales";
import PremiumPreview from "../Provider/PremiumPreview";
import Suggestions from "../common/Suggestions";
import CategoryCard from "../Provider/CategoryCard";

import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categorySearch = (category) => {
    dispatch(loadProductsOwn("loading"));
    dispatch(loadProductsFound("loading"));
    dispatch(loadFilters("loading"));
    dispatch(loadApplied("loading"));

    navigate("/results");
    dispatch(loadQuerys({ category }));
  };

  return (
    <div className="home-container component-fadeIn">
      <div className="home-carousel">
        <Carousel
          images={IMAGES}
          controls
          indicators
          pointer
          id="mainCarousel"
          width="100%"
        />
      </div>

      <div className="storecards-container">
        <div className="storecards-inner">
          <CategoryCard
            text="COMPUTACIÓN"
            image="https://res.cloudinary.com/dsyjj0sch/image/upload/v1663598262/computacion_iczryv.png"
            route="MLA1648"
            onClick={() => categorySearch("MLA1648")}
          />
          <CategoryCard
            text="VIDEOJUEGOS"
            image="https://res.cloudinary.com/dsyjj0sch/image/upload/v1663598262/videojuegos2_hvufj4.png"
            route="MLA1144"
            onClick={() => categorySearch("MLA1144")}
          />
          <CategoryCard
            text="AUDIO Y VIDEO"
            image="https://res.cloudinary.com/dsyjj0sch/image/upload/v1663598262/audio_bbrp2m.png"
            route="MLA409810"
            onClick={() => categorySearch("MLA1000")}
          />
          <CategoryCard
            text="CÁMARAS"
            image="https://res.cloudinary.com/dsyjj0sch/image/upload/v1663598262/camara_epkefy.png"
            route="MLA1039"
            onClick={() => categorySearch("MLA1039")}
          />
        </div>
      </div>

      <FlashSales />

      <PremiumPreview />

      <Suggestions />
    </div>
  );
};

export default Home;
