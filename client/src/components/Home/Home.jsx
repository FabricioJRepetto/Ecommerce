import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadApplied, loadFilters, loadProductsFound, loadProductsOwn, loadQuerys } from "../../Redux/reducer/productsSlice";
import Carousel from "./Carousel/Carousel";
import { IMAGES } from "../../constants";
import Footer from "../common/Footer";
import FlashSales from "../common/FlashSales";

import { ReactComponent as Two } from "../../assets/svg/build-svgrepo-com.svg";
import { ReactComponent as Three } from "../../assets/svg/code-svgrepo-com.svg";
import { ReactComponent as Four } from "../../assets/svg/crop-svgrepo-com.svg";
import { ReactComponent as Five } from "../../assets/svg/explode-svgrepo-com.svg";
import { ReactComponent as Six } from "../../assets/svg/perform-svgrepo-com.svg";

import "./Home.css";
import Suggestions from "../common/Suggestions";
import PremiumPreview from "../Provider/PremiumPreview";

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

  const categorySearch = (category) => { 
        dispatch(loadProductsOwn("loading"));
        dispatch(loadProductsFound("loading"));
        dispatch(loadFilters("loading"));
        dispatch(loadApplied('loading'));

        navigate("/results");
        dispatch(loadQuerys({category}))
   }

  return (
    <div className="home-container">
      <div>
        <Carousel 
            images={IMAGES} 
            controls 
            indicators 
            pointer 
            pausable
            id='mainCarousel'
            width="100vw" />
      </div>
      <div className="categories">        
        <div onClick={() => categorySearch("MLA1648")}>
          <Two className={"svg"} />
          <p>Computación</p>
        </div>
        <div onClick={() => categorySearch("MLA1039")}>
          <Three className={"svg"} />
          <p>Cámaras</p>
        </div>
        <div onClick={() => categorySearch("MLA1000")}>
          <Four className={"svg"} />
          <p>Audio & Video</p>
        </div>
        <div onClick={() => categorySearch("MLA1144")}>
          <Five className={"svg"} />
          <p>Videojuegos</p>
        </div>
        <div onClick={()=> navigate('/sales')}>
          <Six className={"svg"} />
          <p>Ofertas</p>
        </div>
      </div>

        <FlashSales/>

        <Suggestions/>

        <PremiumPreview />
        
      <Footer />
    </div>
  );
};

export default Home;
