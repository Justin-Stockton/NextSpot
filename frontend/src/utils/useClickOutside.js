import { useEffect, useRef } from "react";

export default function useClickOutside(handler) {
  const element = useRef();
  const latest = useRef(handler);
  latest.current = handler;

  useEffect(() => {
    const check = event => {
      if (!element.current?.contains(event.target)) latest.current();
    };
    document.addEventListener("mousedown", check);
    return () => document.removeEventListener("mousedown", check);
  }, []);

  return element;
}
