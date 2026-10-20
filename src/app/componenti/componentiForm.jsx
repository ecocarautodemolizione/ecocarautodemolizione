import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"


export function FormSelect({ nome, label, value, onchange, options = [] }) {
  const handleValueChange = (val) => {
    onchange?.({ target: { name: nome, value: val } })
  }
  return (
    <div className={`min-w-0`}>
      <label className="block text-sm font-semibold mb-1" htmlFor={nome}>{label}</label>
      <Select value={value ?? ""} onValueChange={handleValueChange}>
        <SelectTrigger id={nome} className="w-full rounded-lg">
          <SelectValue placeholder={`-- Seleziona ${label} --`} />
        </SelectTrigger>
        <SelectContent position="popper" className="z-[70]">
          <SelectGroup>
            {options.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="data-[state=checked]:bg-brand data-[state=checked]:text-foreground focus:bg-brand"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <input type="hidden" name={nome} value={value ?? ""} />
    </div>
  )
}

export function FormTextarea ({colspan, mdcolspan, nome, label, value, onchange, type, status}) {
  return (
    <div className={`${colspan} ${mdcolspan} min-w-0 ${status || ""}`}>
      <Label htmlFor={nome}>{label}</Label>
      <Textarea
        type={type}
        id={nome}
        placeholder={label}
        name={nome}
        value={value}
        onChange={onchange}
        className="w-full min-w-0 appearance-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:border-brand"
      />
    </div>
  )
}

