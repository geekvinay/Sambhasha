/**Agrigate options for Schema defnition*/
export interface SearchOptions<T> {
  page?: number;
  skip?: number;
  limit?: number;
  isLean?: boolean;
  project?: any; //todo requires T
  populate?: any;
  sort?: any;
}
