"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type Props = {
  children?: ReactNode;
};

type IUseSearch = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const SearchContext = createContext<IUseSearch>({
  open: false,
  setOpen: () => {},
});

export function SearchProvider({ children }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader className="sr-only">
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Hier kann man suchen</DialogDescription>
        </DialogHeader>
        <DialogContent hideClose></DialogContent>
      </Dialog>
    </SearchContext.Provider>
  );
}
