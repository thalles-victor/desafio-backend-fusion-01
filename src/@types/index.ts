export type JwtPayloadType = {
  session_id: string;
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
