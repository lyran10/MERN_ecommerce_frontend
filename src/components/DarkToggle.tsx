import React, { useEffect, useState } from 'react'
export default function DarkToggle(){
  const [theme, setTheme] = useState<string>(()=> localStorage.getItem('theme') || 'light')
  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme==='dark' ? 'dark' : 'light')
    localStorage.setItem('theme', theme)
  }, [theme])
  return (
    <button onClick={()=>setTheme(t=> t==='dark' ? 'light' : 'dark')} className="ml-3 p-2 rounded bg-gray-100 dark:bg-gray-800">
      {theme==='dark' ? '🌙' : '🌞'}
    </button>
  )
}
