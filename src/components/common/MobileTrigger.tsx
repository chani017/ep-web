'use client'

import React from 'react'
import Image from 'next/image'
import {useAppContext} from '@/context/AppContext'
import {useRouter, usePathname} from 'next/navigation'
import {cn} from '@/lib/utils'

export default function MobileTrigger() {
  const {isMobileSidebarOpen, setIsMobileSidebarOpen} = useAppContext()
  const router = useRouter()
  const pathname = usePathname()
  const isPostPage = pathname !== '/'

  const handleClick = () => {
    if (isPostPage) {
      router.push('/')
    } else if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false)
    } else {
      setIsMobileSidebarOpen(true)
    }
  }

  const isRotated = isPostPage || isMobileSidebarOpen

  return (
    <button
      onClick={handleClick}
      className="fixed right-0 w-9 h-9 flex flex-col justify-center items-center cursor-pointer z-1000"
    >
      <Image
        src="/plus.svg"
        alt="Menu"
        width={20}
        height={20}
        className={cn('w-5 h-5 transition-transform duration-300', isRotated && 'rotate-135')}
        style={{display: 'block'}}
      />
    </button>
  )
}
