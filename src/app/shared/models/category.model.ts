/** Tipo retornado pelas queries GraphQL de Category */
export interface CategoryDTO {
  id: string;
  name: string;
  userId: string;
}

/** Input para mutations createCategory/updateCategory */
export interface CategoryInput {
  name: string;
  userId: string;
}
