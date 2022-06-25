import * as yup from "yup";

export const validatePrice = (value) => {
  if (value === undefined) return false;
  return /^\d+(.\d{1,2})?$/.test(value);
};

export const validateNumbers = (value) => {
  if (value === undefined) return false;
  return /^[0-9]*$/.test(value);
};

export const validateImgs = (imagesList) => {
  const fileTypesAllowed = ["image/jpeg", "image/png"];

  for (let i = 0; i < imagesList.length; i++) {
    console.log(`${i}`, imagesList[i].name);
    if (!fileTypesAllowed.includes(imagesList[i].type)) {
      console.log("archivo no soportado"); //!VOLVER A VER renderizar mensaje warn
      imagesList.splice(i, 1);
      i--;
    }
  }
};

export const validationSchema = yup.object().shape({
  name: yup.string().required("Nombre es requerido"),
  price: yup
    .string()
    .required("Precio es requerido")
    .test(
      "price",
      "Precio debe ser un número válido (ej: '1234.56')",
      (value) => validatePrice(value)
    ),
  brand: yup.string().required("Marca es requerida"),
  available_quantity: yup
    .string()
    .required("Stock es requerido")
    .test("stock", "Stock debe ser un número", (value) =>
      validateNumbers(value)
    ),
  description: yup.string().required("Descripción es requerida"),
  main_features: yup
    .array()
    .of(yup.string().required("Principales características requeridas")),
  attributes: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Nombre de atributo es requerido"),
      value_name: yup.string().required("Valor de atributo es requerido"),
    })
  ),
});