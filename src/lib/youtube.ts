// Pulls the 11-character video ID out of any common YouTube link:
//   youtube.com/watch?v=ID   (also with other parameters before v=)
//   youtu.be/ID
//   youtube.com/live/ID      (live streams: CM/PM broadcasts are shared like this)
//   youtube.com/shorts/ID
//   youtube.com/embed/ID
// A live stream embeds exactly like a normal video, and when the broadcast
// ends YouTube turns the same player into the recording automatically.
export function extractYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/watch\?(?:[^#]*&)?v=|youtu\.be\/|youtube\.com\/(?:live|shorts|embed)\/)([\w-]{11})/
  );
  return m ? m[1] : null;
}
