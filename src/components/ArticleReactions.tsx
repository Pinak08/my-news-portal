"use client";
import { useEffect, useState } from "react";

type ReactionType = "like" | "dislike";

interface Props {
  articleId: number;
  initialLikes: number;
  initialDislikes: number;
}

const VISITOR_ID_KEY = "tv10_visitor_id";

function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `v-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

export default function ArticleReactions({ articleId, initialLikes, initialDislikes }: Props) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [loading, setLoading] = useState<ReactionType | null>(null);

  // On mount, fetch the real state for this visitor (their own like/dislike
  // status, plus fresh counts in case the server-rendered page is a bit
  // stale from ISR caching).
  useEffect(() => {
    const visitorId = getVisitorId();
    fetch(`/api/articles/${articleId}/reactions?visitorId=${encodeURIComponent(visitorId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.likes === "number") setLikes(data.likes);
        if (typeof data.dislikes === "number") setDislikes(data.dislikes);
        if (data.userReaction === "like" || data.userReaction === "dislike") {
          setUserReaction(data.userReaction);
        }
      })
      .catch(() => {
        // If this fails, the server-rendered initial counts just stay as-is.
      });
  }, [articleId]);

  async function handleClick(reaction: ReactionType) {
    if (loading) return;
    setLoading(reaction);

    // Optimistic update
    const prevLikes = likes;
    const prevDislikes = dislikes;
    const prevReaction = userReaction;

    if (userReaction === reaction) {
      // Toggling off
      if (reaction === "like") setLikes((n) => Math.max(0, n - 1));
      else setDislikes((n) => Math.max(0, n - 1));
      setUserReaction(null);
    } else {
      if (reaction === "like") {
        setLikes((n) => n + 1);
        if (userReaction === "dislike") setDislikes((n) => Math.max(0, n - 1));
      } else {
        setDislikes((n) => n + 1);
        if (userReaction === "like") setLikes((n) => Math.max(0, n - 1));
      }
      setUserReaction(reaction);
    }

    try {
      const visitorId = getVisitorId();
      const res = await fetch(`/api/articles/${articleId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId, reaction }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      if (typeof data.likes === "number") setLikes(data.likes);
      if (typeof data.dislikes === "number") setDislikes(data.dislikes);
      setUserReaction(data.userReaction ?? null);
    } catch {
      // Roll back on failure
      setLikes(prevLikes);
      setDislikes(prevDislikes);
      setUserReaction(prevReaction);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => handleClick("like")}
        disabled={loading !== null}
        aria-pressed={userReaction === "like"}
        className={`flex items-center gap-2 px-4 py-2 rounded border text-sm font-semibold transition-colors disabled:opacity-60 ${
          userReaction === "like"
            ? "bg-brand-blue text-white border-brand-blue"
            : "bg-white text-gray-700 border-gray-300 hover:border-brand-blue"
        }`}
      >
        <span>👍</span>
        <span>{likes}</span>
      </button>

      <button
        type="button"
        onClick={() => handleClick("dislike")}
        disabled={loading !== null}
        aria-pressed={userReaction === "dislike"}
        className={`flex items-center gap-2 px-4 py-2 rounded border text-sm font-semibold transition-colors disabled:opacity-60 ${
          userReaction === "dislike"
            ? "bg-gray-700 text-white border-gray-700"
            : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
        }`}
      >
        <span>👎</span>
        <span>{dislikes}</span>
      </button>
    </div>
  );
}
