import React, { useEffect, useState } from "react";
import SelectList from "./SelectList";

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
    <div>
      <span onClick={handleRoot}>Categoría{" > "}</span>
      {categoryPath &&
        React.Children.toArray(
          categoryPath.map((category, index) =>
            notRender && index === categoryPath.length - 1 ? (
              <span>{category.name} </span>
            ) : (
              <span onClick={(e) => handleChange(e, index)}>
                {category.name}
                {" > "}
              </span>
            )
          )
        )}
      {!notRender && (
        <SelectList
          categoryPath={categoryPath}
          handleChange={handleChange}
          setNotRender={setNotRender}
          setCategory={setCategory}
        />
      )}
    </div>
  );
};

export default SelectsNested;

// https://api.mercadolibre.com/sites/MLA/categories
// https://api.mercadolibre.com/categories/MLA5725
