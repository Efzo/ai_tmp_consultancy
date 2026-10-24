"use client";

import { useRef, useState } from "react";

type UploadState = "idle" | "uploading" | "success" | "error";

export default function MediaUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [description, setDescription] = useState("");
  const [state, setState] = useState<UploadState>("idle");
  const [message, setMessage] = useState("");

  const chooseFiles = (incoming: FileList | File[]) => {
    const files = Array.from(incoming);
    if (!files.length) return;
    setSelectedFiles((current) => {
      const merged = [...current, ...files];
      const unique = merged.filter((file, index) => merged.findIndex((item) => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified) === index);
      return unique.slice(0, 10);
    });
    setState("idle");
    setMessage(files.length > 10 ? "Only the first 10 files were added." : "");
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeFile = (index: number) => setSelectedFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFiles.length) {
      setState("error");
      setMessage("Choose at least one file before uploading.");
      return;
    }

    setState("uploading");
    setMessage(`Uploading ${selectedFiles.length} file${selectedFiles.length === 1 ? "" : "s"} securely…`);
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file, file.name));
    formData.set("altText", description);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 90_000);

    try {
      const response = await fetch("/api/admin/media", { method: "POST", body: formData, signal: controller.signal });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setState("error");
        setMessage(result.message ?? "Upload failed. Check your storage configuration and try again.");
        return;
      }
      setState("success");
      setMessage(result.message ?? "Upload completed successfully. Refreshing your media library…");
      window.setTimeout(() => window.location.reload(), 1200);
    } catch (error) {
      setState("error");
      setMessage(error instanceof DOMException && error.name === "AbortError" ? "The upload timed out. Check storage and database configuration." : "The upload could not reach the server. Check your connection and try again.");
    } finally {
      window.clearTimeout(timeout);
    }
  };

  return <form onSubmit={submit} className="glass-panel space-y-5 p-6">
    <div>
      <p className="text-sm font-semibold text-white">Choose files to upload</p>
      <p className="mt-1 text-xs text-slate-muted">Add up to 10 documents, images, audio, or video files. Each file can be up to 10MB.</p>
      <input ref={inputRef} id="media-file" name="files" type="file" multiple className="sr-only" accept=".jpg,.jpeg,.png,.webp,.gif,.avif,.bmp,.tif,.tiff,.svg,.ico,.heic,.heif,.pdf,.txt,.md,.markdown,.csv,.tsv,.rtf,.json,.xml,.yaml,.yml,.log,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.odp,.pages,.numbers,.key,.mp3,.wav,.ogg,.m4a,.mp4,.webm,.ogv" onChange={(event) => { if (event.target.files) chooseFiles(event.target.files); }} />
      <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); chooseFiles(event.dataTransfer.files); }} className={`mt-3 flex min-h-32 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-6 text-center transition ${dragging ? "border-electric bg-electric/10" : "border-glass bg-white/5 hover:border-electric/60 hover:bg-white/10"}`}>
        <span className="text-base font-medium text-white">Click to choose files</span>
        <span className="mt-2 text-xs text-slate-muted">or drag and drop multiple files here</span>
        {selectedFiles.length > 0 && <span className="mt-4 rounded-full border border-cyan-ai/30 bg-cyan-ai/10 px-3 py-1 text-xs text-cyan-ai">{selectedFiles.length} file{selectedFiles.length === 1 ? "" : "s"} selected</span>}
      </button>
      {selectedFiles.length > 0 && <ul className="mt-3 space-y-2">{selectedFiles.map((file, index) => <li key={`${file.name}-${file.lastModified}`} className="flex items-center justify-between gap-3 rounded-lg border border-glass bg-white/5 px-3 py-2 text-xs"><span className="min-w-0 truncate text-slate-muted">{file.name} <span className="text-slate-muted/70">· {(file.size / 1024 / 1024).toFixed(2)} MB</span></span><button type="button" onClick={() => removeFile(index)} disabled={state === "uploading"} className="shrink-0 text-red-300 hover:text-red-200">Remove</button></li>)}</ul>}
    </div>

    <label className="block text-sm text-slate-muted" htmlFor="media-description">Description / alt text <span className="text-xs">(applies to all selected files)</span><input id="media-description" value={description} onChange={(event) => setDescription(event.target.value)} required minLength={2} placeholder="What are these files used for?" className="mt-2 w-full rounded-lg border border-glass bg-white/5 px-3 py-3 text-white outline-none transition focus:border-electric" /></label>

    <button type="submit" disabled={state === "uploading" || state === "success" || !selectedFiles.length} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50">{state === "uploading" ? `Uploading ${selectedFiles.length} file${selectedFiles.length === 1 ? "" : "s"}…` : state === "success" ? "Upload complete" : `Upload ${selectedFiles.length || "files"}`}</button>
    {message && <p role="status" className={`rounded-lg border px-3 py-3 text-sm ${state === "success" ? "border-green-300/30 bg-green-300/10 text-green-200" : state === "error" ? "border-red-300/30 bg-red-300/10 text-red-200" : "border-electric/30 bg-electric/10 text-cyan-ai"}`}>{message}</p>}
  </form>;
}
