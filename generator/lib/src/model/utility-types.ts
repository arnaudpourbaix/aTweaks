export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;
