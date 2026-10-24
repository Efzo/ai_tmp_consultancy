"use client";

import { useEffect, useRef } from "react";

type CommandButtonProps = { label: string; command: string; value?: string };

const commandButtons: CommandButtonProps[] = [
  { label: "B", command: "bold" },
  { label: "I", command: "italic" },
  { label: "U", command: "underline" },
  { label: "• List", command: "insertUnorderedList" },
  { label: "1. List", command: "insertOrderedList" },
  { label: "Left", command: "justifyLeft" },
  { label: "Center", command: "justifyCenter" },
  { label: "Right", command: "justifyRight" },
  { label: "Justify", command: "justifyFull" },
];

export default function RichTextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) editorRef.current.innerHTML = value;
  }, [value]);

  function runCommand(command: string, commandValue?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current?.innerHTML ?? "");
  }

  return (
    <div className="overflow-hidden rounded-xl border border-glass bg-white/5 focus-within:border-electric">
      <div className="flex flex-wrap items-center gap-1 border-b border-glass bg-white/5 p-2">
        <select aria-label="Text style" defaultValue="p" onChange={(event) => runCommand("formatBlock", event.target.value)} className="rounded-md border border-glass bg-midnight px-2 py-1.5 text-xs text-white outline-none">
          <option value="p">Paragraph</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="blockquote">Quote</option>
        </select>
        <select aria-label="Font family" defaultValue="Arial" onChange={(event) => runCommand("fontName", event.target.value)} className="rounded-md border border-glass bg-midnight px-2 py-1.5 text-xs text-white outline-none">
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Verdana">Verdana</option>
        </select>
        {commandButtons.map((button) => <button key={button.command} type="button" title={button.command} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand(button.command, button.value)} className="rounded-md border border-glass px-2 py-1.5 text-xs text-slate-muted transition hover:bg-white/10 hover:text-white">{button.label}</button>)}
        <button type="button" title="Remove formatting" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("removeFormat")} className="rounded-md border border-glass px-2 py-1.5 text-xs text-slate-muted transition hover:bg-white/10 hover:text-white">Clear</button>
      </div>
      <div ref={editorRef} contentEditable suppressContentEditableWarning onInput={() => onChange(editorRef.current?.innerHTML ?? "")} data-placeholder="Write the article content here…" className="min-h-72 px-4 py-4 text-white outline-none [&:empty]:before:text-slate-muted [&:empty]:before:content-[attr(data-placeholder)]" />
      <p className="border-t border-glass px-4 py-2 text-xs text-slate-muted">Use the toolbar for headings, fonts, emphasis, lists, paragraphs, and alignment.</p>
    </div>
  );
}
