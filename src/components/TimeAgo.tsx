"use client";
import { useEffect, useState } from "react";

const IST = "Asia/Kolkata";

function shortDate(date: Date) {
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: IST });
}

function relative(date: Date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "હમણાં જ";
  if (diff < 3600) return `${Math.floor(diff / 60)} મિનિટ પહેલાં`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} કલાક પહેલાં`;
  return shortDate(date);
}

// Pages are cached for hours or days, so "5 minutes ago" worked out on the
// server would be frozen and wrong. The cached HTML carries the date; the
// visitor's browser turns it into "x minutes ago" against their own clock.
export default function TimeAgo({ date }: { date: string }) {
  const [text, setText] = useState(() => shortDate(new Date(date)));
  useEffect(() => setText(relative(new Date(date))), [date]);
  return <time dateTime={date}>{text}</time>;
}
