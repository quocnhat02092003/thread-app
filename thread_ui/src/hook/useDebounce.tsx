import { useState, useEffect } from "react";

interface UseDebounceProps {
  value: string | number | boolean;
  delay: number;
}

const useDebounce = (props: UseDebounceProps) => {
  const [debouncedValue, setDebouncedValue] = useState(props.value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(props.value);
    }, props.delay);
    return () => {
      clearTimeout(handler);
    };
  }, [props.value, props.delay]);

  return debouncedValue;
};

export default useDebounce;
