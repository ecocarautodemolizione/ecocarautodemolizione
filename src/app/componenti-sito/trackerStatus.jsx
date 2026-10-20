function cx(...args) {
  return args.filter(Boolean).join(" ")
}

export function Timeline({ items = [], className = "" }) {
  return (
    <ol className={cx("relative border-l border-neutral-200 dark:border-neutral-800", className)}>
      {items.map(it => (
        <li key={it.id} className="mb-6 ml-8 border px-5 py-1 rounded-xl">
          <span
            className={cx(
              "absolute -left-2 mt-1  h-3 w-3 rounded-full bg-companyPrimary",
              it.dotClassName
            )}
            aria-hidden="true"
          />
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-companyPrimary dark:text-neutral-100 capitalize">
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

export function PickDotColor(alias) {
  if (/complet|chius/i.test(alias)) return "bg-emerald-500"
  if (/attesa|pendente|verifica|in corso/i.test(alias)) return "bg-yellow-500"
  if (/errore|rifiut/i.test(alias)) return "bg-red-500"
  return "bg-brand"
}
