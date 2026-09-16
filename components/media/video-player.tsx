'use client'

interface VideoPlayerProps {
  src: string
  poster?: string
  /** Used for the accessible label. */
  title: string
}

/** Native HTML5 video player. Swap the source for a real walkthrough clip. */
export function VideoPlayer({ src, poster, title }: VideoPlayerProps) {
  return (
    <video
      className="aspect-video w-full rounded-lg bg-black"
      controls
      preload="metadata"
      poster={poster}
      playsInline
      aria-label={`Walkthrough video: ${title}`}
    >
      <source src={src} />
      Your browser does not support the video tag.
    </video>
  )
}
