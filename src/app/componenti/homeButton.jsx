'use client'

import { FaHome } from "react-icons/fa";

export default function HomeButton() {

  return (
    <a href='/' target='_blank'>
        <button className="px-3 py-1 rounded-md bg-neutral-100 hover:bg-neutral-900 hover:text-neutral-100 text-neutral-700 text-xs">
            <FaHome/>
        </button>
    </a>
  )
}
