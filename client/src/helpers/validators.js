import * as yup from "yup";

export const validatePrice = (value) => {
  if (value === undefined) return false;
  return /^\d+(.\d{1,2})?$/.test(value);
};

export const validateNumbers = (value) => {
  if (value === undefined) return false;
  return /^[0-9]*$/.test(value);
};

export const validateImgs = (imagesList, warnTimer, productImg) => {
  const fileTypesAllowed = ["image/jpeg", "image/png"];
  let warnFlagFormat = false;
  let warnFlagExcess = false;

  for (let i = 0; i < imagesList.length; i++) {
    if (!fileTypesAllowed.includes(imagesList[i].type)) {
      warnFlagFormat = true;
      imagesList.splice(i, 1);
      i--;
    }
  }
  if (productImg?.length + imagesList?.length > 8) {
    let excess = productImg?.length + imagesList?.length - 8;
    warnFlagExcess = true;
    imagesList.splice(-excess, excess);
  }
  if (warnFlagExcess || warnFlagFormat) {
    warnTimer(
      "image",
      `${
        warnFlagFormat &&
        "Formato no soportado. Seleccione imagenes .jpg .jpeg o .png"
      }${
        warnFlagFormat && warnFlagExcess && `\n`
      } //! VOLVER A VER meter salto de linea
      ${warnFlagExcess && "Se permiten 8 imágenes como máximo"}`
    );
  }
};

export const validationProductFormSchema = yup.object().shape({
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
  category: yup.string().required("Categoría es requerida"),
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
  free_shipping: yup
    .bool('Tipo de envío solo acepta "true" o "false" como valor')
    .required("Tipo de envío es requerido"),
});
