import { useEffect, useState } from "react";
import { storage, storageKeys } from "../services/storage";

export function useLocalStorageState(key, fallback) {
  const [value, setValue] = useState(() => storage.get(storageKeys[key], fallback));

  useEffect(() => {
    storage.set(storageKeys[key], value);
  }, [key, value]);

  return [value, setValue];
}
