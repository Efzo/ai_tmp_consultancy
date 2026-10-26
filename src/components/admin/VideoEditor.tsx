"use client";

import React, { useState } from "react";
import { saveVideoInsight, deleteVideoInsight } from "@/app/actions/videos";
import { uploadMediaAsset } from "@/app/actions/media";

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  order: number;
  isPublished: boolean;
}

export default function VideoEditor({ videos }: { videos: Video[] }) {
  const [rows, setRows] = useState(videos);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const update = (index: number, key: keyof Video, value: Video[keyof Video]) => {
    setRows((current) => current.map((v, i) => i === index ? { ...v, [key]: value } : v));
  };

  const add = () => {
    setRows((current) => [...current, {
      id: `temp-${Date.now()}`,
      title: "New Video Insight",
      description: "Explain a specific value proposition or delivery method.",
      url: "https://youtube.com/watch?v=...",
      category: "Strategy",
      order: rows.length,
      isPublished: true,
    }]);
  };

  const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIdx(index);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadMediaAsset(formData);
      if (result.success && result.asset) {
        update(index, "url", result.asset.url);
      } else {
        alert(result.message || "Upload failed");
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "An error occurred during upload");
    } finally {
      setUploadingIdx(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    const result = await deleteVideoInsight(id);
    if (result.success) {
      setRows((current) => current.filter(v => v.id !== id));
      setMessage(result.message);
    }
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      for (const row of rows) {
        const result = await saveVideoInsight(row);
        if (!result.success) throw new Error(result.message);
      }
      setMessage("All videos updated successfully.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Video update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Video Insights</h2>
          <p className="mt-1 text-sm text-slate-muted">Curate the videos that demonstrate your expertise and build trust.</p>
        </div>
        <button type="button" onClick={add} className="btn-secondary">Add Video</button>
      </div>

      <div className="grid gap-6">
        {rows.map((video, index) => (
          <article key={video.id} className="glass-panel p-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <label className="text-sm text-slate-muted">Title
                <input value={video.title} onChange={(e) => update(index, "title", e.target.value)} className="mt-1 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />
              </label>
              <label className="text-sm text-slate-muted">Category
                <input value={video.category} onChange={(e) => update(index, "category", e.target.value)} className="mt-1 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />
              </label>
              <label className="text-sm text-slate-muted">Order
                <input type="number" value={video.order} onChange={(e) => update(index, "order", parseInt(e.target.value))} className="mt-1 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />
              </label>
            </div>
            <label className="block text-sm text-slate-muted">Description
              <textarea value={video.description} onChange={(e) => update(index, "description", e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />
            </label>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center gap-2">
                <label className="text-sm text-slate-muted whitespace-nowrap">Video URL (YouTube/Vimeo)</label>
                <input value={video.url} onChange={(e) => update(index, "url", e.target.value)} className="flex-1 rounded-lg border border-glass bg-white/5 px-3 py-2 text-white outline-none focus:border-electric" />

                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileUpload(index, e)}
                    className="hidden"
                    id={`video-upload-${index}`}
                  />
                  <label
                    htmlFor={`video-upload-${index}`}
                    className="btn-secondary px-3 py-2 text-xs h-fit cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    {uploadingIdx === index ? "..." : "Upload File"}
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-muted cursor-pointer">
                  <input type="checkbox" checked={video.isPublished} onChange={(e) => update(index, "isPublished", e.target.checked)} className="rounded border-glass bg-white/5 text-electric focus:ring-electric" />
                  Published
                </label>
                <button type="button" onClick={() => remove(video.id)} className="text-red-300 hover:text-red-200 transition-colors">Remove</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-cyan-ai">{message}</p>
        <button type="button" onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Saving..." : "Save All Videos"}
        </button>
      </div>
    </div>
  );
}
