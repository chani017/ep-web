'use client'

import React from 'react'
import {type SanityDocument} from 'next-sanity'
import {useAppContext} from '@/context/AppContext'
import {usePage} from '@/hooks/usePage'
import {usePostGridLayout} from '@/hooks/usePostGridLayout'
import PostCard from '../post/PostCard'
import Pagination from '../common/Pagination'
import {cn} from '@/lib/utils'

interface MobileMainContentProps {
  posts: SanityDocument[]
  filterState?: {
    searchTerm: string
    setSearchTerm: (term: string) => void
    selectedYear: string
    setSelectedYear: (year: string) => void
    selectedCategory: string
    setSelectedCategory: (category: string) => void
    uniqueYears: string[]
    filteredPosts: SanityDocument[]
    availableCategories: Set<string>
  }
  viewMode?: 'mobileImg' | 'list'
  scrollToTop?: () => void
}

export default function MobileMainContent({
  posts,
  filterState,
  viewMode = 'mobileImg',
  scrollToTop,
}: MobileMainContentProps) {
  const {language} = useAppContext()

  const {filteredPosts} = filterState || {}

  const {currentPage, setCurrentPage, paginatedPosts, totalPages} = usePage(filteredPosts || posts)

  const renderedPosts = usePostGridLayout({
    posts: paginatedPosts,
    cols: 2,
    viewMode,
    isMobile: true,
  })

  return (
    <main className="px-2 wrapper-content ">
      <div className="pt-2 flex items-center justify-end text-[0.75rem] text-system-gray font-ep-sans">
        <span>{filteredPosts?.length || 0} results</span>
      </div>

      <div
        className={cn(
          'mt-3',
          viewMode === 'mobileImg'
            ? 'flex flex-wrap gap-x-2 gap-y-6'
            : 'flex flex-col border-t border-system-gray',
        )}
      >
        {renderedPosts.map(({post, widthPct}) => (
          <PostCard
            key={post._id}
            post={post}
            language={language}
            widthPct={widthPct}
            viewMode={viewMode}
            isMobile={true}
            searchTerm={filterState?.searchTerm}
          />
        ))}
      </div>
      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page)
          scrollToTop?.()
        }}
        className="mt-2 mb-20"
      />
    </main>
  )
}
