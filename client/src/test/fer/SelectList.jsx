import { useEffect, useState } from "react";
import axios from "axios";

const SelectList = ({
  categoryPath,
  handleChange,
  setNotRender,
  setCategory,
}) => {
  const [data, setData] = useState([]);

  let url = "";
  categoryPath.length
    ? (url = `https://api.mercadolibre.com/categories/${
        categoryPath[categoryPath.length - 1].id
      }`)
    : (url = "https://api.mercadolibre.com/sites/MLA/categories");

  useEffect(() => {
    axios(url)
      .then(({ data }) => {
        if (data.children_categories && !data.children_categories.length) {
          setNotRender(true);
          setCategory({ id: data.id, name: data.name });
        }
        categoryPath.length ? setData(data.children_categories) : setData(data);
      })
      .catch((err) => console.log(err)); //! VOLVER A VER manejo de errores
    // eslint-disable-next-line
  }, [categoryPath]);

  return (
    <>
      <select name="category" onChange={handleChange}>
        <option value="">Elige una opción</option>
        {data &&
          data.map((c) => (
            <option
              value={JSON.stringify({ id: c.id, name: c.name })}
              key={c.id}
            >
              {c.name}
            </option>
          ))}
      </select>
    </>
  );
};

export default SelectList;
