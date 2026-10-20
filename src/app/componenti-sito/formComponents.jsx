'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function FormField ({ nome,label, value, onchange, type, colorLabel}) {
  return (
    <div className={`w-full`}>
      <Label htmlFor={nome} className={`${colorLabel}`}>{label}</Label>
      <Input
        type={type}
        id={nome}
        placeholder={label}
        name={nome}
        value={value}
        onChange={onchange}
        className={`text-neutral-700 w-full min-w-0 appearance-none focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:border-neutral-200`}
      />
    </div>
  )
}
