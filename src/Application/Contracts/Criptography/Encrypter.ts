export interface Encrypter {
  encrypt<TData extends Object>(value: TData): Promise<string>
}
