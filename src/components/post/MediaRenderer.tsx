'use client'

import React from 'react'
import Image from 'next/image'
import MuxPlayer from '@mux/mux-player-react'
import imageUrlBuilder from '@sanity/image-url'
import {SanityImageSource} from '@sanity/image-url'
import {client} from '@/sanity/client'
import {cn} from '@/lib/utils'

const {projectId, dataset} = client.config()
const urlFor = (source: SanityImageSource) =>
  projectId && dataset ? imageUrlBuilder({projectId, dataset}).image(source) : null

export interface MediaItem {
  _type: string
  _key?: string
  caption?: string
  asset?: {playbackId?: string}
  playbackId?: string
  aspectRatio?: string
  url?: string
  image?: {asset?: {_ref?: string}}
  [key: string]: unknown
}

interface MediaRendererProps {
  item: MediaItem
  index: number
  isMobile?: boolean
  showCaption?: boolean
  className?: string
}

export default function MediaRenderer({
  item,
  index,
  isMobile = false,
  showCaption = true,
  className = 'w-full',
}: MediaRendererProps) {
  if (item._type === 'image') {
    const imgUrl = urlFor(item)?.url()
    return (
      <figure key={item._key || index} className={className}>
        {imgUrl && (
          <Image
            src={imgUrl}
            alt={item.caption || ''}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto"
          />
        )}
        {showCaption && item.caption && (
          <figcaption
            className={cn(
              'text-left text-system-gray mt-2 font-ep-sans',
              isMobile ? 'text-size-sm' : 'text-size-md',
            )}
          >
            {item.caption}
          </figcaption>
        )}
      </figure>
    )
  }

  if (item._type === 'mux.video') {
    const playbackId = (item.playbackId as string) || item.asset?.playbackId
    if (!playbackId) return null

    const rawAspect = (item.aspectRatio as string) || '16:9'
    const formattedAspect = rawAspect.replace(':', '/')
    const finalAspectRatio = isMobile ? '1/1' : formattedAspect

    return (
      <div
        key={item._key || index}
        className={cn(className, 'bg-system-white overflow-hidden transition-opacity duration-300')}
        style={{aspectRatio: finalAspectRatio}}
      >
        <MuxPlayer
          playbackId={playbackId}
          streamType="on-demand"
          autoPlay="muted"
          loop
          muted
          placeholder=""
          poster=""
          style={
            {
              width: '100%',
              height: '100%',
              '--controls': 'none',
              '--media-background-color': '#FFFFFF',
              aspectRatio: finalAspectRatio,
              display: 'block',
            } as React.CSSProperties & Record<`--${string}`, string>
          }
          className="w-full h-full block object-cover"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...({videoQuality: 'basic'} as any)}
        >
          <div slot="poster" className="w-full h-full bg-white" />
        </MuxPlayer>
      </div>
    )
  }

  if (item._type === 'youtube') {
    const videoId = item.url?.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    )?.[1]
    if (!videoId) return null

    return (
      <div
        key={item._key || index}
        className={cn(className, 'overflow-hidden', isMobile && 'aspect-video rounded-sm')}
        style={{aspectRatio: isMobile ? undefined : '1/1'}}
      >
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    )
  }

  return null
}
