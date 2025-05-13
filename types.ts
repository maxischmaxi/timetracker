import { LucideIcon } from "lucide-react";

export type Plain<T> = T extends (infer U)[]
  ? Plain<U>[]
  : T extends bigint
    ? number
    : T extends object
      ? {
          [K in keyof T as K extends "$typeName" | "$unknown"
            ? never
            : K]: Plain<T[K]>;
        }
      : T;

export type NavigationItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};
