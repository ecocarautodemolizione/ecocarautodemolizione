'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"

function cx(...args) {
  return args.filter(Boolean).join(" ")
}

export default function ReadTracking({ uuidRitiroVeicolo, updateTracking }) {
  const [logAvanzamento, setLogAvanzamento] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uuidRitiroVeicolo) return
    ;(async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from("log_avanzamento_demolizione")
        .select(`
          uuid_log_avanzamento_demolizione,
          uuid_veicolo_ritirato,
          uuid_stato_avanzamento,
          note_log_stato_avanzamento,
          created_at_stato_avanzamento,
          stato:stati_avanzamento(uuid_stato_avanzamento, alias_stato_avanzamento)
        `)
        .eq("uuid_veicolo_ritirato", uuidRitiroVeicolo)
        .order("created_at_stato_avanzamento", { ascending: false })

      if (error) {
        console.error(error)
        toast.error("Errore nel caricamento timeline")
        setLoading(false)
        return
      }

      setLogAvanzamento(data ?? [])
      setLoading(false)
    })()
  }, [uuidRitiroVeicolo, updateTracking])

  if (!uuidRitiroVeicolo) return <p className="text-sm text-neutral-500">Nessun veicolo selezionato.</p>
  if (loading) return <p className="text-sm text-neutral-500">Caricamento timeline…</p>
  if (!logAvanzamento.length) return <p className="text-sm text-neutral-500">Nessun evento registrato.</p>

  return (
    <div className="p-4">
      <Timeline
        items={(logAvanzamento ?? []).map(t => ({
          id: t.uuid_log_avanzamento_demolizione,
          title: t?.stato?.alias_stato_avanzamento || "Stato",
          datetime: t.created_at_stato_avanzamento,
          description: t.note_log_stato_avanzamento,
          dotClassName: pickDotColor(t?.stato?.alias_stato_avanzamento || "")
        }))}
        className="ml-2"
      />
    </div>
  )
}

function Timeline({ items = [], className = "" }) {
  return (
    <ol className={cx("relative border-l border-neutral-200 dark:border-neutral-800", className)}>
      {items.map(it => (
        <li key={it.id} className="mb-7 ml-4">
          <span
            className={cx(
              "absolute -left-2 mt-1 h-3 w-3 rounded-full bg-brand",
              it.dotClassName
            )}
            aria-hidden="true"
          />
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 capitalize">
              {it.title}
            </h3>
            {it.rightExtra}
          </div>
          {it.datetime ? (
            <time className="mt-1 block text-xs text-neutral-500">
              {formatDate(it.datetime)}
            </time>
          ) : null}
          {it.description ? (
            <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              {it.description}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  )
}

function formatDate(d) {
  const date = typeof d === "string" ? new Date(d) : d
  if (!(date instanceof Date) || isNaN(+date)) return ""
  try {
    return new Intl.DateTimeFormat("it-IT", { dateStyle: "medium", timeStyle: "short" }).format(date)
  } catch {
    return ""
  }
}

function pickDotColor(alias) {
  if (/complet|chius/i.test(alias)) return "bg-emerald-500"
  if (/attesa|pendente|verifica|in corso/i.test(alias)) return "bg-yellow-500"
  if (/errore|rifiut/i.test(alias)) return "bg-red-500"
  return "bg-brand"
}
