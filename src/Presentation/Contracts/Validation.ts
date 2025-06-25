export interface Validation {
  validate<TData>(data: TData): TData
}
