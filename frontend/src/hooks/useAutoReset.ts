import { useState, useEffect } from "react";

export function useAutoReset<T>(initialValue: T, delay: number, resetValue: T) {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    if (state !== resetValue) {
      const timer = setTimeout(() => setState(resetValue), delay);
      return () => clearTimeout(timer);
    }
  }, [state, delay, resetValue]);

  return [state, setState] as const;
}
