"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

import { insertBlogImage, moveBlogImage } from "@/lib/blog-editor-images";
import { sanitizeRichText } from "@/lib/rich-text";

export type RichTextEditorHandle = { insertImage: (image: { url: string; alt: string; caption: string }) => void; focus: () => void };
const publicImages = (html: string) => html.replace(/\scontenteditable="false"/gi, "").replace(/src="\/api\/admin\/media\/([a-z0-9-]+)"/g, 'src="/api/media/$1"');
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

const RichTextEditor = forwardRef<RichTextEditorHandle, { value: string; onChange: (value: string) => void; onAddImage?: () => void; disabled?: boolean }>(function RichTextEditor({ value, onChange, onAddImage, disabled = false }, ref) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedFigure, setSelectedFigure] = useState<HTMLElement | null>(null);

  const selectionRef = useRef<Range | null>(null);
  const emit = () => onChange(publicImages(editorRef.current?.innerHTML ?? ""));
  const rememberSelection = () => {
    const selection = window.getSelection();
    if (selection?.rangeCount && editorRef.current?.contains(selection.anchorNode)) selectionRef.current = selection.getRangeAt(0).cloneRange();
  };
  useEffect(() => {
    if (editorRef.current && publicImages(editorRef.current.innerHTML) !== value) {
      editorRef.current.innerHTML = previewImages(sanitizeRichText(value));
      editorRef.current.querySelectorAll("figure").forEach((figure) => { figure.contentEditable = "false"; });
    }
  }, [value]);
  useImperativeHandle(ref, () => ({
    focus() { editorRef.current?.focus(); },
    insertImage(image) {
      const editor = editorRef.current;
      if (!editor) return;
      editor.focus();
      const range = insertBlogImage(editor, selectionRef.current, image);
      const selection = window.getSelection(); selection?.removeAllRanges(); selection?.addRange(range); selectionRef.current = range.cloneRange();
      setSelectedFigure(null);
      emit();
    },
  }));

  function runCommand(command: string, commandValue?: string) {
    const editor = editorRef.current;
    editor?.focus();
    const range = selectionRef.current;
    if (editor && range && editor.contains(range.startContainer) && editor.contains(range.endContainer)) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    // Native font-size commands support seven sizes; retain portable font markup
    // which the shared sanitizer converts to explicit pixel sizes on save/render.
    if (command === "fontSize") document.execCommand("styleWithCSS", false, "false");
    document.execCommand(command, false, commandValue);
    if (command === "fontSize") editor?.querySelectorAll<HTMLElement>("font[size]").forEach((font) => {
      const pixels = [12, 14, 16, 18, 24, 32, 48][Number(font.getAttribute("size")) - 1];
      if (pixels) font.style.fontSize = `${pixels}px`;
    });
    rememberSelection();
    emit();
  }

  return (
    <div className="rounded-xl border border-glass bg-white/5 focus-within:border-electric">
      <fieldset disabled={disabled} className="sticky top-20 z-20 flex flex-wrap items-center gap-1 rounded-t-xl border-b border-glass bg-midnight p-2">
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
        <select aria-label="Text size" defaultValue="" onMouseDown={rememberSelection} onFocus={rememberSelection} onChange={(event) => { runCommand("fontSize", event.target.value); event.target.value = ""; }} className="rounded-md border border-glass bg-midnight px-2 py-1.5 text-xs text-white outline-none">
          <option value="" disabled>Text size</option>
          {[12, 14, 16, 18, 24, 32, 48].map((size, index) => <option key={size} value={String(index + 1)}>{size} px</option>)}
        </select>
        {commandButtons.map((button) => <button key={button.command} type="button" title={button.command} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand(button.command, button.value)} className="rounded-md border border-glass px-2 py-1.5 text-xs text-slate-muted transition hover:bg-white/10 hover:text-white">{button.label}</button>)}
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { const href = window.prompt("Source or related page URL (https://…)"); if (href && /^https:\/\//i.test(href)) runCommand("createLink", href); }} className="rounded-md border border-glass px-2 py-1.5 text-xs text-slate-muted hover:text-white">Add link</button>
        <button type="button" title="Remove formatting" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("removeFormat")} className="rounded-md border border-glass px-2 py-1.5 text-xs text-slate-muted transition hover:bg-white/10 hover:text-white">Clear</button>
        {onAddImage && <button type="button" onMouseDown={(event) => { rememberSelection(); event.preventDefault(); }} onClick={onAddImage} className="rounded-md border border-electric/50 bg-electric/10 px-3 py-1.5 text-xs font-semibold text-white">Add image</button>}
        {selectedFigure && editorRef.current?.contains(selectedFigure) && <div role="toolbar" aria-label="Selected image position" className="flex w-full flex-wrap items-center gap-2 border-t border-glass pt-2 text-xs"><span className="mr-auto text-slate-muted">Selected image: {selectedFigure.querySelector("img")?.alt}</span>{(["up", "down"] as const).map((direction) => <button type="button" key={direction} onMouseDown={(event) => event.preventDefault()} onClick={() => { moveBlogImage(selectedFigure, direction); emit(); }} className="btn-secondary text-xs">Move image {direction}</button>)}<button type="button" onClick={() => { selectedFigure.remove(); setSelectedFigure(null); emit(); }} className="btn-secondary text-xs">Remove from story</button></div>}
      </fieldset>
      <div ref={editorRef} tabIndex={disabled ? -1 : 0} contentEditable={!disabled} suppressContentEditableWarning onInput={emit} onClick={(event) => { const figure = (event.target as HTMLElement).closest("figure"); setSelectedFigure(figure && editorRef.current?.contains(figure) ? figure : null); }} onBlur={rememberSelection} onKeyUp={rememberSelection} onMouseUp={rememberSelection} onPaste={(event) => { event.preventDefault(); const html = event.clipboardData.getData("text/html"); const text = event.clipboardData.getData("text/plain"); if (html) runCommand("insertHTML", previewImages(sanitizeRichText(publicImages(html)))); else runCommand("insertText", text); }} data-placeholder="Write the article content here…" role="textbox" aria-label="Article content" aria-multiline="true" className="[&_img]:my-4 [&_img]:max-w-full [&_img]:h-auto [&_figcaption]:text-sm [&_figcaption]:text-slate-muted min-h-72 px-4 py-4 text-white outline-none [&:empty]:before:text-slate-muted [&:empty]:before:content-[attr(data-placeholder)]" />
      <p className="border-t border-glass px-4 py-2 text-xs text-slate-muted">Select text and choose Text size to make it smaller or larger. Click where an image should go, then choose Add image. Click an image to move it up or down, or remove it from the story.</p>
    </div>
  );
});

export default RichTextEditor;
