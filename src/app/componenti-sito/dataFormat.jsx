export function DataFormat(value) {
    if (!value) return '—'
    const d = new Date(value)
    if (isNaN(d)) return '—'
    return d.toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }