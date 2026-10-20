'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { moduliGestionale } from '@/app/cosetting';
import { useAdmin } from '@/app/admin/components/AdminContext';

export default function MENUhomepage () {

    const utente = useAdmin().utente
    const ruolo = utente?.user_metadata?.ruolo

    const pathname = usePathname();
    const isActive = (path) => pathname?.startsWith(path);

    if  (!utente) return

    return (
    <div className="flex flex-wrap lg:justify-start justify-center flex-row gap-4 w-full">
    {ruolo !== 'superadmin' ?
    <> 
    {moduliGestionale
        .filter(moduli => moduli.attivo === true)
        .filter(r => r.level.includes(ruolo))
        .map((modulo, index) => (
        <Link key={index} href={`${modulo.link}`} >
            <div className={`flex flex-col items-center justify-center rounded-2xl p-4 lg:w-[140px] w-[100px] aspect-square transition duration-700 ${
                isActive(`/gestionale/${modulo.linkActive}`)
                    ? 'bg-brand'
                    : 'bg-brand dark:bg-neutral-800 text-neutral-100 dark:text-brand hover:bg-neutral-400 dark:hover:bg-brand hover:text-neutral-100 dark:hover:text-neutral-900'
                }`}>
                <span className='lg:text-[40px] text-4xl'>{modulo.icon}</span>
                <span className='mt-3 lg:text-[0.5rem] text-[0.6rem] w-full uppercase text-center break-words truncate'>{modulo.label}</span>
            </div>
        </Link>
    ))}
    </>
    :
    <>
    {moduliGestionale
        .filter(r => r.level.includes(ruolo))
        .map((modulo, index) => (
        <Link key={index} href={`${modulo.link}`} >
            <div className={`flex flex-col items-center justify-center rounded-2xl p-4 lg:w-[140px] w-[100px] aspect-square transition duration-700 ${
                isActive(`/gestionale/${modulo.linkActive}`)
                    ? 'bg-brand'
                    : 'bg-brand dark:bg-neutral-800 text-neutral-100 dark:text-brand hover:bg-neutral-400 dark:hover:bg-brand hover:text-neutral-100 dark:hover:text-neutral-900'
                }`}>
                <span className='lg:text-[40px] text-4xl'>{modulo.icon}</span>
                <span className='mt-3 lg:text-[0.5rem] text-[0.6rem] w-full uppercase text-center break-words truncate'>{modulo.label}</span>
            </div>
        </Link>
    ))} 
    </> }
    </div>
    );
} 