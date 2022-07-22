import React, { useState } from "react";
import SelectList from "./SelectList";

const SelectsNested = () => {
  const [categoryPath, setCategoryPath] = useState([]);
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
      setNotRender(false);
    } else {
      let categoryObj = JSON.parse(e.target.value);
      setCategoryPath([...categoryPath, categoryObj]);
    }
  };

  const handleRoot = () => {
    setCategoryPath([]);
    setNotRender(false);
  };

  return (
    <div>
      <h3>Seleccione categoría</h3>
      <span onClick={handleRoot}>Categoría{" > "}</span>
      {categoryPath &&
        React.Children.toArray(
          categoryPath.map((category, index) => (
            <span onClick={(e) => handleChange(e, index)}>
              {category.name}
              {notRender && index === categoryPath.length - 1 ? null : " > "}
            </span>
          ))
        )}
      {!notRender && (
        <SelectList
          categoryPath={categoryPath}
          handleChange={handleChange}
          setNotRender={setNotRender}
        />
      )}
    </div>
  );
};

export default SelectsNested;

// https://api.mercadolibre.com/sites/MLA/categories
// https://api.mercadolibre.com/categories/MLA5725
