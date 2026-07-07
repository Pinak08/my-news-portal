"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteAdButton({ id, label }: { id: number; label: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${label}"? This cannot be undone.`)) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/ads/${id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) router.refresh();
    else alert("Failed to delete. Please try again.");
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      {deleting ? "..." : "Delete"}
    </button>
  );
}
