export type EditorImage = { url: string; alt: string; caption: string };

export function insertBlogImage(editor: HTMLElement, savedRange: Range | null, image: EditorImage): Range {
  const doc = editor.ownerDocument;
  const range = savedRange && editor.contains(savedRange.commonAncestorContainer) ? savedRange.cloneRange() : doc.createRange();
  if (!savedRange || !editor.contains(range.commonAncestorContainer)) { range.selectNodeContents(editor); range.collapse(false); }
  range.deleteContents();
  const figure = doc.createElement("figure"); figure.contentEditable = "false";
  const img = doc.createElement("img"); img.src = image.url.replace("/api/media/", "/api/admin/media/"); img.alt = image.alt; figure.append(img);
  if (image.caption) { const caption = doc.createElement("figcaption"); caption.textContent = image.caption; figure.append(caption); }
  let top: Node | null = range.startContainer === editor ? null : range.startContainer;
  while (top && top.parentNode !== editor) top = top.parentNode;
  if (top?.nodeType === 1 && (top as HTMLElement).tagName === "FIGURE") { range.setStartAfter(top); range.collapse(true); top = null; }
  let following: HTMLElement;
  if (top?.nodeType === 1) {
    const block = top as HTMLElement;
    const tail = range.cloneRange(); tail.setEnd(block, block.childNodes.length);
    const remainder = tail.extractContents();
    following = block.cloneNode(false) as HTMLElement;
    following.append(remainder);
    block.after(figure, following);
    if (!block.textContent?.trim() && !block.querySelector("img,br")) block.remove();
  } else {
    range.insertNode(figure);
    following = doc.createElement("p"); figure.after(following);
  }
  if (!following.textContent && !following.querySelector("img,br")) {
    const paragraph = doc.createElement("p"); paragraph.append(doc.createElement("br")); following.replaceWith(paragraph); following = paragraph;
  }
  const caret = ["UL", "OL"].includes(following.tagName) ? following.querySelector("li") || following : following;
  range.selectNodeContents(caret); range.collapse(true);
  return range;
}

export function moveBlogImage(figure: HTMLElement, direction: "up" | "down") {
  const neighbor = direction === "up" ? figure.previousElementSibling : figure.nextElementSibling;
  if (!neighbor) return false;
  if (direction === "up") neighbor.before(figure); else neighbor.after(figure);
  return true;
}
