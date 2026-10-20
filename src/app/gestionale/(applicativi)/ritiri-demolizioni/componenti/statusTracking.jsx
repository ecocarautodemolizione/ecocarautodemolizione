'use client'

import { FaPlusSquare } from "react-icons/fa";
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup} from "@/components/ui/select"
import { RiEyeCloseLine } from "react-icons/ri";
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerPortal, DrawerOverlay } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

export default function StatusTracking ({uuidRitiroVeicolo, setUpdateTracking}) {

    const [statiAvanzamento, setstatiAvanzamento] = useState([])

    const [formData, setFormData] = useState({
      statusDemolizione:'',
      logNote:'',
    })

    useEffect(() => {
        if (!uuidRitiroVeicolo){
        return
        }
        ;(async () => {
        const { data: statiAvanzamento, error } = await supabase
            .from("stati_avanzamento")
            .select(`*`)
            .order("alias_stato_avanzamento", {ascending: true})

        if (error) {
            console.error(error)
            toast.error("Errore nel caricamento Modelli Marchio Auto")
            return
        }
        setstatiAvanzamento(statiAvanzamento ?? [])
        })()
    }, [uuidRitiroVeicolo])  

    const optionsStatiAvanzamento = statiAvanzamento.map(sa => ({
        value: `${sa.uuid_stato_avanzamento}`,
        label: `${sa.alias_stato_avanzamento}`,
    }))

    function handleChange(e) {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
    
        const payload = {
          uuid_veicolo_ritirato: uuidRitiroVeicolo || null,
          uuid_stato_avanzamento: formData.statusDemolizione || null,
          note_log_stato_avanzamento: formData.logNote || null,
        }
    
        if (uuidRitiroVeicolo == ""){
          alert("campo vuoto")
        } else if (formData.statusDemolizione == ""){
          alert("stato non selezionato")
        } else {
          const { data, error } = await supabase.from("log_avanzamento_demolizione").insert(payload).select().single()
          if (error) {
            console.error(error)
            alert(`Errore salvataggio: ${error.message}`)
            return
          } else {
            setFormData({
                statusDemolizione:'',
                logNote:'',
            })
            setUpdateTracking(prev=>!prev)
          }
          console.log("Inserito:", data)
          alert("Status Aggiunto con successo")
        }

    }

    return (
        <>
        <Drawer>
          <DrawerTrigger className="text-[0.6rem] font-bold text-dark dark:text-neutral-900 border bg-brand px-3 py-2 w-fit rounded-xl">UPDATE</DrawerTrigger>
          <DrawerPortal>
            <DrawerOverlay className="fixed inset-0 bg-neutral-500/30" />
            <DrawerContent className=" bg-neutral-950 text-neutral-100 border-neutral-800 shadow-2xl min-h-0 h-full">
                <DrawerHeader className="p-6 mt-10">
                    <div className="flex flex-row justify-between">
                        <div className="flex items-start flex-col">
                            <DrawerTitle>Inserisci uno stato d'avanzamento</DrawerTitle>
                            <DrawerDescription>Seleziona uno stato d'avanzamento e clicca su aggiungi</DrawerDescription>
                        </div>
                        <div>
                            <DrawerClose>
                                <Button variant="outline"><RiEyeCloseLine /></Button>
                            </DrawerClose>
                        </div>
                    </div>
                </DrawerHeader>
                <div class="h-[1px] w-full bg-gradient-to-r from-brand to-brandDark"/>
                <div className='p-6 min-w-0 min-h-0'>
                    <form id="statusForm" onSubmit={handleSubmit} className="grid min-h-0 grid-cols-2 gap-4 w-full">
                    <FormSelectRuoli nome="statusDemolizione" label='Stato Demolizione' value={formData.statusDemolizione} colspan="col-span-12" mdcolspan="lg:col-span-12" onchange={handleChange} options={optionsStatiAvanzamento}/>
                    <FormTextarea nome="logNote" label='Note' value={formData.logNote} colspan="col-span-12" mdcolspan="lg:col-span-12" onchange={handleChange} type="textarea" as="textarea"/>              
                    <div className="col-span-12 flex justify-end min-h-0">
                    <Button type="submit" form="statusForm" className="bg-brand hover:bg-white text-neutral-900">
                        <FaPlusSquare className='font-bold'/>
                    </Button>
                    </div>
                    </form>
                </div>    
                <DrawerFooter>
                </DrawerFooter>
            </DrawerContent>
          </DrawerPortal>
        </Drawer>
        
        </>
    )
}



export function FormSelectRuoli({ colspan, mdcolspan, nome, label, value, onchange, options = [] }) {
  const handleValueChange = (val) => {
    onchange?.({ target: { name: nome, value: val } })
  }
  return (
    <div className={`${colspan ?? ""} ${mdcolspan ?? ""} min-w-0`}>
      <label className="block text-sm font-semibold mb-1" htmlFor={nome}>{label}</label>
      <Select value={value ?? ""} onValueChange={handleValueChange}>
        <SelectTrigger id={nome} className="w-full rounded-lg">
          <SelectValue placeholder={`-- Seleziona ${label} --`} />
        </SelectTrigger>
        <SelectContent position="popper" className="z-[70]">
          <SelectGroup>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="data-[state=checked]:bg-brand data-[state=checked]:text-foreground focus:bg-brand">
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

export function FormTextarea ({colspan, mdcolspan, nome,label, value, onchange, type, status}) {
  return (
    <div className={`${colspan} ${mdcolspan} min-w-0 ${status} `}>
      <Label htmlFor={nome}>{label}</Label>
      <Textarea
        type={type}
        id={nome}
        placeholder={label}
        name={nome}
        value={value}
        onChange={onchange}
        
        className={`w-full min-w-0 appearance-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:border-brand`}
      />
    </div>
  )
}