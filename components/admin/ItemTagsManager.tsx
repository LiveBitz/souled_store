"use client";

import React, { useState, useTransition } from "react";
import { createItemTag, updateItemTag, deleteItemTag } from "@/app/admin/actions/item-tags";
import { Plus, Pencil, Trash2, Check, X, Loader2, Tag } from "lucide-react";

type ItemTag = { id: string; name: string };

interface ItemTagsManagerProps {
  initialTags: ItemTag[];
}

function TagRow({
  tag,
  onUpdated,
  onDeleted,
}: {
  tag: ItemTag;
  onUpdated: (t: ItemTag) => void;
  onDeleted: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(tag.name);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const save = () => {
    setError("");
    if (!name.trim()) {
      setError("Enter a valid name.");
      return;
    }
    startTransition(async () => {
      const res = await updateItemTag(tag.id, name);
      if (res.success) {
        onUpdated({ ...tag, name: name.trim() });
        setEditing(false);
      } else {
        setError(res.error || "Failed.");
      }
    });
  };

  const remove = () => {
    startTransition(async () => {
      const res = await deleteItemTag(tag.id);
      if (res.success) onDeleted(tag.id);
    });
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 border border-brand/20">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          placeholder="Tag name"
          className="flex-1 h-9 px-3 rounded-lg border border-zinc-200 text-sm outline-none focus:border-brand/50 bg-white"
        />
        {error && <span className="text-xs text-rose-500 shrink-0">{error}</span>}
        <button
          onClick={save}
          disabled={isPending}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-brand text-white hover:bg-brand/90 transition-colors disabled:opacity-50 shrink-0"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => { setEditing(false); setName(tag.name); setError(""); }}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-100 bg-white hover:border-zinc-200 transition-colors group">
      <div className="w-8 h-8 rounded-lg bg-brand/8 flex items-center justify-center shrink-0">
        <Tag className="w-3.5 h-3.5 text-brand" />
      </div>
      <span className="flex-1 text-sm font-semibold text-zinc-800 truncate">{tag.name}</span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setEditing(true)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={remove}
          disabled={isPending}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-300 hover:text-rose-500 hover:bg-rose-50 transition-all disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

export function ItemTagsManager({ initialTags }: ItemTagsManagerProps) {
  const [tags, setTags] = useState<ItemTag[]>(initialTags);
  const [newName, setNewName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleCreate = () => {
    setError("");
    if (!newName.trim()) {
      setError("Enter a tag name.");
      return;
    }
    startTransition(async () => {
      const res = await createItemTag(newName);
      if (res.success) {
        setTags((prev) => [
          ...prev,
          { id: Date.now().toString(), name: newName.trim() },
        ]);
        setNewName("");
      } else {
        setError(res.error || "Failed.");
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-zinc-950">Item Tags</h1>
        <p className="text-sm text-zinc-400 font-medium">
          Create reusable quick-add tags for your offline sales. One click fills the item name.
        </p>
      </div>

      {/* Create new tag */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-5 space-y-4">
        <h2 className="text-sm font-bold text-zinc-700 uppercase tracking-wider">New Tag</h2>
        <div className="flex gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="Tag name (e.g. Casual T-Shirt)"
            className="flex-1 h-11 px-3 rounded-xl border border-zinc-200 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 transition-all placeholder:text-zinc-400"
          />
          <button
            onClick={handleCreate}
            disabled={isPending}
            className="h-11 px-5 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2 shrink-0"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add
          </button>
        </div>
        {error && (
          <p className="text-xs text-rose-500 font-medium">{error}</p>
        )}
      </div>

      {/* Tag list */}
      <div className="space-y-2">
        {tags.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-zinc-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center mx-auto">
              <Tag className="w-5 h-5 text-zinc-300" />
            </div>
            <p className="text-sm font-semibold text-zinc-400">No tags yet — add your first one above.</p>
          </div>
        ) : (
          tags.map((tag) => (
            <TagRow
              key={tag.id}
              tag={tag}
              onUpdated={(updated) =>
                setTags((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
              }
              onDeleted={(id) =>
                setTags((prev) => prev.filter((t) => t.id !== id))
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
