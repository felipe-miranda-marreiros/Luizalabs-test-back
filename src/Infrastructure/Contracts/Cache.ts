export interface Cache<TClient = unknown> {
  set<TData>(key: string, data: TData): Promise<void>
  get<TData>(key: string): Promise<TData | null>
  invalidate(key: string): Promise<void>
  build: () => Promise<void>
  client: TClient
}
