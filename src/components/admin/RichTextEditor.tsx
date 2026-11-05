"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import { sanitizeRichText } from "@/lib/rich-text";

export type RichTextEditorHandle = { insertImage: (image: { url: string; alt: string; caption: string }) => void };
const publicImages = (html: string) => html.replace(/src="\/api\/admin\/media\/([a-z0-9-]+)"/g, 'src="/api/media/$1"');
const previewImages = (html: string) => html.replace(/src="\/api\/media\/([a-z0-9-]+)"/g, 'src="/api/admin/media/$1"');

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

const RichTextEditor = forwardRef<RichTextEditorHandle, { value: string; onChange: (value: string) => void }>(function RichTextEditor({ value, onChange }, ref) {
  const editorRef = useRef<HTMLDivElement>(null);

  const selectionRef = useRef<Range | null>(null);
  const emit = () => onChange(publicImages(editorRef.current?.innerHTML ?? ""));
  const rememberSelection = () => {
    const selection = window.getSelection();
    if (selection?.rangeCount && editorRef.current?.contains(selection.anchorNode)) selectionRef.current = selection.getRangeAt(0).cloneRange();
  };
  useEffect(() => {
    if (editorRef.current && publicImages(editorRef.current.innerHTML) !== value) editorRef.current.innerHTML = previewImages(sanitizeRichText(value));
  }, [value]);
  useImperativeHandle(ref, () => ({ insertImage(image) {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const range = selectionRef.current && editor.contains(selectionRef.current.commonAncestorContainer) ? selectionRef.current : document.createRange();
    if (!selectionRef.current || !editor.contains(range.commonAncestorContainer)) { range.selectNodeContents(editor); range.collapse(false); }
    const figure = document.createElement("figure");
    const img = document.createElement("img"); img.src = image.url.replace("/api/media/", "/api/admin/media/"); img.alt = image.alt; figure.append(img);
    if (image.caption) { const caption = document.createElement("figcaption"); caption.textContent = image.caption; figure.append(caption); }
    range.deleteContents(); range.insertNode(figure); range.setStartAfter(figure); range.collapse(true);
    const selection = window.getSelection(); selection?.removeAllRanges(); selection?.addRange(range); selectionRef.current = range.cloneRange();
    emit();
  } }));

  function runCommand(command: string, commandValue?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    emit();
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
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { const href = window.prompt("Source or related page URL (https://…)"); if (href && /^https:\/\//i.test(href)) runCommand("createLink", href); }} className="rounded-md border border-glass px-2 py-1.5 text-xs text-slate-muted hover:text-white">Add link</button>
        <button type="button" title="Remove formatting" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("removeFormat")} className="rounded-md border border-glass px-2 py-1.5 text-xs text-slate-muted transition hover:bg-white/10 hover:text-white">Clear</button>
      </div>
      <div ref={editorRef} contentEditable suppressContentEditableWarning onInput={emit} onBlur={rememberSelection} onKeyUp={rememberSelection} onMouseUp={rememberSelection} onPaste={(event) => { event.preventDefault(); const html = event.clipboardData.getData("text/html"); const text = event.clipboardData.getData("text/plain"); if (html) runCommand("insertHTML", previewImages(sanitizeRichText(publicImages(html)))); else runCommand("insertText", text); }} data-placeholder="Write the article content here…" role="textbox" aria-label="Article content" aria-multiline="true" className="[&_img]:my-4 [&_img]:max-w-full [&_img]:h-auto [&_figcaption]:text-sm [&_figcaption]:text-slate-muted min-h-72 px-4 py-4 text-white outline-none [&:empty]:before:text-slate-muted [&:empty]:before:content-[attr(data-placeholder)]" />
      <p className="border-t border-glass px-4 py-2 text-xs text-slate-muted">Use the toolbar for headings, fonts, emphasis, lists, paragraphs, and alignment.</p>
    </div>
  );
});

export default RichTextEditor;
