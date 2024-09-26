export type JwtPayloadType = {
  id: string;
  email: string;
  // roles: Array<Role>;
};

export type PaginationType = {
  take?: number;
  skip?: number;
};

export type FlexiblePagination<T> = {
  [P in keyof T]?: T[P] | string;
};

export type PaginationFlexibleType = FlexiblePagination<PaginationType>;
