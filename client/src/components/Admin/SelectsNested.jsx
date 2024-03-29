import React, { useEffect, useState } from "react";
import SelectList from "./SelectList";
import { ChevronRightIcon } from "@chakra-ui/icons";
import "../../App.css";
import "./SelectsNested.css";

const SelectsNested = ({
  setCategory,
  category,
  setCategoryPath,
  categoryPath,
}) => {
  const [notRender, setNotRender] = useState(false);

  const handleChange = (e, index = false) => {
    if (index !== false) {
      let newCategoryPath = [];
      categoryPath.every((c, i) => {
        if (index === i - 1) return false;
        newCategoryPath.push(c);
        return true;
      });
      setCategoryPath(newCategoryPath);
    } else {
      let categoryObj = JSON.parse(e.target.value);
      setCategoryPath([...categoryPath, categoryObj]);
    }
    setCategory(null);
  };

  const handleRoot = () => {
    setCategory(null);
    setCategoryPath([]);
  };

  useEffect(() => {
    category === null && setNotRender(false);
  }, [category]);

  useEffect(() => {
    categoryPath.length && setNotRender(false);
  }, [categoryPath]);

  return (
    <div className="select-nested-container">
      <span>
        <span onClick={handleRoot} className="category-selected-button">
          Categoría
        </span>
      </span>
      {categoryPath &&
        React.Children.toArray(
          categoryPath.map((category, index) =>
            notRender && index === categoryPath.length - 1 ? (
              <span>
                <span className="category-arrow-icon">
                  <ChevronRightIcon />
                </span>
                <div className="category-selected-last">{category.name} </div>
              </span>
            ) : (
              <span>
                <span className="category-arrow-icon">
                  <ChevronRightIcon />
                </span>
                <div
                  onClick={(e) => handleChange(e, index)}
                  className="category-selected-button"
                >
                  {category.name}
                </div>
              </span>
            )
          )
        )}
      {!notRender && (
        <>
          <span className="category-arrow-icon">
            <ChevronRightIcon />
          </span>
          <SelectList
            categoryPath={categoryPath}
            handleChange={handleChange}
            setNotRender={setNotRender}
            setCategory={setCategory}
          />
        </>
      )}
    </div>
  );
};

export default SelectsNested;
