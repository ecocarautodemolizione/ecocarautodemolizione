'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { moduliGestionale } from '@/app/cosetting';
import { FaHome } from "react-icons/fa";
import { useAdmin } from '@/app/admin/components/AdminContext';

export default function MenuSidebar () {

    const utente = useAdmin().utente
    const ruolo = utente?.user_metadata?.ruolo

    const pathname = usePathname();

    const isActive = (path) => pathname?.startsWith(path);
    const isActiveHome = (path) => pathname == path;

    return (
        <div className="flex flex-row lg:flex-col gap-2">
        <div>
            <Link
            href={`/gestionale`}
            title={`GESTIONALE`}
            className={`flex items-center justify-center rounded-full p-2 md:h-[40px] md:w-[40px] h-[30px] w-[30px] transition duration-700 ${
                isActiveHome(`/gestionale`) ? 'bg-brand text-neutral-100' : 'bg-neutral-100 dark:bg-neutral-950 text-brand hover:bg-brand hover:text-neutral-200'
            }`}
            >
            <FaHome/>
            </Link>
        </div>
        {moduliGestionale
            .filter(moduli => (moduli.attivo === "true") || ruolo === "superadmin")
            .map(modulo => (
            <div key={modulo.name}>
                <Link
                href={`${modulo.link}`}
                title={modulo.linkActive}
                className={`flex items-center justify-center rounded-full p-2 md:h-[40px] md:w-[40px] h-[30px] w-[30px] transition duration-700 ${
                    isActive(`/gestionale/${modulo.linkActive}`) ? 'bg-brand text-neutral-100' : 'bg-neutral-100 dark:bg-neutral-950 text-brand hover:bg-brand dark:hover:bg-brand hover:text-neutral-200'
                }`}
                >
                {modulo.icon}
                </Link>
            </div>
            ))
        }
        </div>
    );
}
