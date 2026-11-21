import { useEffect, useState } from "react";
import { getConfigPublica } from "@/lib/server-fns";
import { CONFIG_DEFECTO } from "@/lib/horario";

export default function usePublicConfig() {
  const [config, setConfig] = useState(CONFIG_DEFECTO);

  useEffect(() => {
    let activo = true;
    getConfigPublica()
      .then((data) => {
        if (activo && data) setConfig({ ...CONFIG_DEFECTO, ...data });
      })
      .catch(() => {});
    return () => {
      activo = false;
    };
  }, []);

  return config;
}