"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import MENUhomepage from "@/app/componenti/menuHome"

export default function Dashboard() {

  return (
    <div className="flex items-start justify-center overflow-x-auto">
      <MENUhomepage/>
    </div>
  )
}
