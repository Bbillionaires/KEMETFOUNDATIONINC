/**
 * Static video library. This site has no database or admin panel, so
 * videos are managed directly in code: to add, edit, or remove a video,
 * edit this file and redeploy the site.
 *
 * `youtubeId` is the video ID from its YouTube URL (the part after
 * `youtu.be/` or `v=`). `channel` is the uploading channel's name, shown
 * as attribution since these are not the organization's own uploads
 * unless noted otherwise.
 */
export type VideoRecord = {
  slug: string;
  title: string;
  youtubeId: string;
  channel?: string;
};

export const VIDEOS: VideoRecord[] = [
  {
    slug: "jamaicans-say-traore-is-marcus-garvey-reborn",
    title: "Jamaicans Say Traoré Is Marcus Garvey Reborn — Then the Debate Exploded",
    youtubeId: "9Ex8eoBq7bM",
    channel: "The African Awakening",
  },
];

export function getFeaturedVideos(limit?: number): VideoRecord[] {
  return limit ? VIDEOS.slice(0, limit) : VIDEOS;
}

export function getVideoBySlug(slug: string): VideoRecord | undefined {
  return VIDEOS.find((v) => v.slug === slug);
}
