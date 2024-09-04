interface DynamicModel<T> {
  create(data: any): Promise<T>;
  findUnique(data: any): Promise<T>;
  findMany(data: any): Promise<T>;
  update(data: any): Promise<T>;
  count(data: any): Promise<T>;
  findFirst(data: any): Promise<T>;
}
