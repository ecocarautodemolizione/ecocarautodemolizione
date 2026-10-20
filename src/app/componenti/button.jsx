'use client'

import { FaHome, FaPowerOff, FaPlus, FaMinus } from "react-icons/fa";
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import {  } from "react-icons/fa";
import { useTheme } from 'next-themes'
import { FaToggleOff, FaToggleOn  } from "react-icons/fa6";

export function HomeButton() {
  return (
    <a href='/' target='_blank'>
        <button className="px-3 py-1 rounded-md bg-neutral-100 hover:bg-neutral-900 hover:text-neutral-100 text-neutral-700 text-xs">
            <FaHome/>
        </button>
    </a>
  )
}

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-neutral-50 text-xs"
    >
      <FaPowerOff />

    </button>
  )
}

export function ThemeToggle(){

    const {theme, setTheme} = useTheme();

    return (
        <button className='flex items-center justify-center' onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ?
            <FaToggleOn className='text-xl text-neutral-100'/> :
            <FaToggleOff className='text-xl'/>
            }
        </button>
    )
}

export function PlusButton({open, stato}){
  return (
    <button onClick={open} className="px-3 py-1 rounded-md bg-neutral-100 hover:bg-neutral-900 hover:text-neutral-100 text-neutral-700 text-xs h-full">
        {!stato ? <FaPlus/> : <FaMinus/>}
    </button>
  )
}