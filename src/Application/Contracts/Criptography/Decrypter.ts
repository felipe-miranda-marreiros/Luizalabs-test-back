export interface Decrypter {
  decrypt<TData>(value: string): Promise<TData>
}
