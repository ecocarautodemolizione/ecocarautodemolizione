'use client'

import { useAdmin } from "@/app/admin/components/AdminContext"
import { supabase } from "@/lib/supabaseClient"

export default function BTNapprovazionePratica ({uuidPratica, sUpdateComponent, setSUpdateComponent}) {

    const utente = useAdmin()
    const role = utente?.utente?.user_metadata?.ruolo
    const isAdmin = role == "superadmin" || role == "admin"

		async function StatusUpdate(uuidVeicolo, uuidStatoAvanzamento) {
	
			const payloadStatus = {
				uuid_veicolo_ritirato: uuidVeicolo,
				uuid_stato_avanzamento: uuidStatoAvanzamento,
			};
	
			const { data, error } = await supabase
				.from("log_avanzamento_demolizione")
				.insert(payloadStatus)
				.select()
				.single();
	
			if (error) {
				console.log("Errore statusUpdate:", error);
			} else {
				console.log("Stato aggiornato:", data);
			}
	
		}
    function handleChangeTrue(e) {
        e.preventDefault()
        handleSubmit(true)
        setSUpdateComponent(prev=>!prev)

    }
    function handleChangeFalse(e) {
        e.preventDefault()
        handleSubmit(false)
        setSUpdateComponent(prev=>!prev)
    }
    function handleChangeNull(e) {
        e.preventDefault()
        handleSubmit(null)
        setSUpdateComponent(prev=>!prev)
    }
    async function handleSubmit(value) {
    
			if (!isAdmin) return

			const payload = {
					demolizione_approvata: value,
			}

			const { data, error } = await supabase
			.from("dati_veicolo_ritirato")
			.update(payload)
			.eq("uuid_veicolo_ritirato", uuidPratica)
			.select()
			.single()

			if (error) {
					console.error(error)
					alert(`Errore salvataggio: ${error.message}`)
					return
			}

			const statoAvenzamentoPratica = payload?.demolizione_approvata == true ? "55c72922-df24-4931-9191-aa0662f5d717" : "03e2958c-0a67-4e2b-920d-09a13a2e26f5"

			await StatusUpdate(uuidPratica, statoAvenzamentoPratica)
			setSUpdateComponent(prev => !prev)
			alert("Pratica accettata con successo!")

    }

    return (
        <>
        {isAdmin ? 
        <div className="flex flex-row gap-4 ">
            <button onClick={handleChangeTrue} className="bg-brand hover:bg-neutral-50 hover:text-neutral-900 transition-colors py-1 px-3 rounded-lg text-xs font-semibold">APPROVA</button>
            <button onClick={handleChangeFalse} className="bg-red-800 hover:bg-neutral-50 hover:text-neutral-900 transition-colors py-1 px-3 rounded-lg text-xs font-semibold">RIFIUTA</button>
            <button onClick={handleChangeNull} className="border border-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-colors py-1 px-3 rounded-lg text-xs font-semibold">IN ATTESA</button>
        </div>
        : null }
        </>
    )
}