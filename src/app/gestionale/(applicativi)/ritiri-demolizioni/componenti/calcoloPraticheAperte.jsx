import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CalcoloPraticheAperte({ uuidAzienda, onChange }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!uuidAzienda) return;
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from("v_pratiche_aperte_per_azienda")
        .select("pratiche_aperte")
        .eq("uuid_azienda_ritiro_veicoli", uuidAzienda)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error(error);
        setCount(0);
        onChange?.(uuidAzienda, 0);
        return;
      }

      const c = data?.pratiche_aperte ?? 0;
      setCount(c);
      onChange?.(uuidAzienda, c);
    })();

    return () => { cancelled = true; };
  }, [uuidAzienda, onChange]);

}