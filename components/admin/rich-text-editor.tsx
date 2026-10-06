"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Bold, Heading2, Image as ImageIcon, Italic, Link as LinkIcon, List, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

export function RichTextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false }), Image.configure({ inline: false })],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
  });
  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);
  if (!editor) return <div className="h-64 animate-pulse rounded-2xl bg-white/30" />;
  const button = (active: boolean, label: string, onClick: () => void, icon: React.ReactNode) => <button type="button" aria-label={label} title={label} onClick={onClick} className={cn("focus-ring flex h-10 w-10 items-center justify-center rounded-xl", active ? "bg-[var(--primary)] text-white" : "hover:bg-white/50")} >{icon}</button>;
  return <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/50 dark:bg-slate-950/30"><div className="flex flex-wrap gap-1 border-b border-white/60 p-2">{button(editor.isActive("bold"), "Tebal", () => editor.chain().focus().toggleBold().run(), <Bold size={17} />)}{button(editor.isActive("italic"), "Miring", () => editor.chain().focus().toggleItalic().run(), <Italic size={17} />)}{button(editor.isActive("heading", { level: 2 }), "Judul", () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 size={17} />)}{button(editor.isActive("bulletList"), "Daftar", () => editor.chain().focus().toggleBulletList().run(), <List size={17} />)}{button(editor.isActive("orderedList"), "Daftar bernomor", () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered size={17} />)}{button(false, "Tautan", () => { const url = window.prompt("URL tautan"); if (url) editor.chain().focus().setLink({ href: url }).run(); }, <LinkIcon size={17} />)}{button(false, "Gambar dari URL", () => { const url = window.prompt("URL gambar"); if (url) editor.chain().focus().setImage({ src: url }).run(); }, <ImageIcon size={17} />)}</div><EditorContent editor={editor} className="prose prose-sm max-w-none min-h-64 p-4 dark:prose-invert" /></div>;
}
