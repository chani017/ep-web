'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {type SanityDocument} from 'next-sanity'
import MuxPlayer from '@mux/mux-player-react'
import {useInView} from '@/hooks/useInView'
import {cva} from 'class-variance-authority'
import {cn} from '@/lib/utils'
import CategoryTag from './CategoryTag'

// 썸네일 크기 배율 정의
export const SIZE_MULTIPLIERS: Record<string, number> = {
  small: 0.65,
  medium: 0.8,
  large: 1.0,
}

// 모바일용 썸네일 크기 배율
export const MOBILE_SIZE_MULTIPLIERS: Record<string, number> = {
  small: 0.5,
  medium: 0.65,
  large: 0.8,
}

const postCardVariants = cva('group', {
  variants: {
    mode: {
      list: 'max-md:flex max-md:flex-col max-md:border-b max-md:border-system-gray max-md:px-2 max-md:py-2 max-md:transition-colors max-md:active:bg-system-dark-gray/20 md:grid md:grid-cols-4 md:col-span-4 md:items-start md:gap-x-3 md:border-b md:border-system-gray md:px-1 md:py-2 md:min-h-10 md:transition-colors md:hover:bg-system-dark-gray',
      grid: 'max-md:flex max-md:flex-col max-md:group-active:brightness-75 md:flex md:flex-col',
    },
  },
  defaultVariants: {
    mode: 'grid',
  },
})

interface PostCardProps {
  post: SanityDocument
  language: string
  viewMode: 'desktopImg' | 'list' | 'mobileImg'
  cols?: number
  rowItemsCount?: number
  widthPct?: number
  isMobile?: boolean
  searchTerm?: string
}

const loadedVideos = new Set<string>()

const PostCard = React.memo(
  ({
    post,
    language,
    viewMode,
    rowItemsCount,
    cols,
    widthPct,
    isMobile = false,
    searchTerm,
  }: PostCardProps) => {
    const [cardRef, inView] = useInView()

    const alreadyLoaded = post.playbackId ? loadedVideos.has(post.playbackId) : false
    const shouldRenderVideo = alreadyLoaded || inView

    React.useEffect(() => {
      if (inView && post.playbackId) {
        loadedVideos.add(post.playbackId)
      }
    }, [inView, post.playbackId])

    // Mux 비디오 썸네일 생성
    const muxThumbnail = post.playbackId
      ? `https://image.mux.com/${post.playbackId}/thumbnail.webp?width=480&time=0`
      : null

    // viewMode: 데스크탑은 "desktopImg", 모바일은 "mobileImg"
    const isList = viewMode === 'list'
    const isGrid = !isList

    const gridViewClasses = cn(
      'w-full overflow-hidden relative',
      isList
        ? 'hidden'
        : 'max-md:w-full max-md:relative md:flex md:flex-col md:w-full md:transition-all md:duration-150 md:group-hover:brightness-60',
    )

    // 화면 너비에 따른 썸네일 폭 조정
    const finalStyle =
      !isGrid || !widthPct
        ? undefined
        : {
            flex: isMobile
              ? `0 0 calc(${widthPct}% - 0.375rem)`
              : `0 0 calc(${widthPct}% - ${
                  rowItemsCount ? (widthPct * (rowItemsCount - 1) * 0.5) / 100 : 0
                }rem)`,
            maxWidth: isMobile ? `calc(${widthPct}% - 0.375rem)` : undefined,
          }

    return (
      <Link
        href={`/${post.slug?.current || ''}`}
        className={cn(postCardVariants({mode: isList ? 'list' : 'grid'}))}
        style={finalStyle}
      >
        <div className={gridViewClasses}>
          <div ref={cardRef} className="w-full overflow-hidden relative">
            {post.playbackId ? (
              <div className="w-full relative overflow-hidden">
                {shouldRenderVideo ? (
                  <MuxPlayer
                    playbackId={post.playbackId}
                    metadataVideoTitle={language === 'kr' ? post.title_kr : post.title_en}
                    streamType="on-demand"
                    autoPlay="muted"
                    loop
                    muted
                    placeholder={muxThumbnail || post.imageUrl || undefined}
                    className="w-full h-auto block"
                    style={
                      {
                        '--controls': 'none',
                        display: 'block',
                      } as React.CSSProperties & Record<`--${string}`, string>
                    }
                    {...({videoQuality: 'basic'} as {
                      videoQuality?: string
                    })}
                  />
                ) : (
                  <Image
                    src={muxThumbnail || post.imageUrl}
                    className="w-full h-auto object-contain"
                    alt={
                      language === 'kr'
                        ? ((post.title_kr as string) ?? '')
                        : ((post.title_en as string) ?? '')
                    }
                    width={0}
                    height={0}
                    sizes="100vw"
                    loading="lazy"
                  />
                )}
              </div>
            ) : post.imageUrl ? (
              <Image
                src={post.imageUrl}
                alt={
                  language === 'kr'
                    ? ((post.title_kr as string) ?? '')
                    : ((post.title_en as string) ?? '')
                }
                className="w-full h-auto object-contain"
                width={0}
                height={0}
                sizes="100vw"
              />
            ) : (
              <div
                className={`flex w-full aspect-square items-center justify-center bg-system-dark-gray/20 font-ep-sans text-system-gray ${
                  isMobile ? 'text-size-md' : 'text-size-sm'
                }`}
              >
                No Media
              </div>
            )}
          </div>

          {/* 미디어 하단 콘텐츠 (그리드 뷰) */}
          <div
            className={`
              flex flex-col w-full
              max-md:py-2
              md:gap-2 md:pt-2 md:min-h-18
              ${isList ? 'hidden' : ''}
            `}
          >
            {/* 카테고리 */}
            <>
              <p className="text-system-white text-size-sm font-medium font-ep-sans leading-tight line-clamp-2">
                {language === 'kr' ? post.title_kr : post.title_en}
              </p>
              <CategoryTag categories={post.category} className="mt-2 md:mt-0" />
            </>
          </div>
        </div>

        {/* 데스크탑 리스트 뷰 */}
        {isList && (
          <div className="contents max-md:hidden">
            <div className="col-span-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-size-md text-system-white font-ep-sans">
              <span>{language === 'kr' ? post.title_kr : post.title_en}</span>
              <CategoryTag categories={post.category} className="shrink-0" />
            </div>
            <div className="col-span-1 text-size-md text-system-white font-ep-sans uppercase">
              {post.publishedAt}
            </div>
            <div
              className={`col-span-1 text-size-md font-ep-sans uppercase text-left ${
                searchTerm && post.client === searchTerm ? 'text-system-gray' : 'text-system-white'
              }`}
            >
              {post.client || ''}
            </div>
          </div>
        )}

        {/* 모바일 리스트 뷰 */}
        {isList && (
          <div className="flex justify-between items-start gap-4 md:hidden">
            <div className="flex-1 flex flex-wrap items-center gap-2">
              <p className="font-ep-sans leading-tight text-system-white font-medium text-size-md">
                {language === 'kr' ? post.title_kr : post.title_en}
              </p>
              <CategoryTag categories={post.category} />
            </div>
            <div className="text-right text-[11px] text-system-gray font-ep-sans whitespace-nowrap pt-0.5">
              {post.publishedAt}
            </div>
          </div>
        )}
      </Link>
    )
  },
)

PostCard.displayName = 'PostCard'

export default PostCard
