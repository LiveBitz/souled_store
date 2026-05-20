"use client";

import React, { useState, useTransition } from "react";
import { createBrandTag, updateBrandTag, deleteBrandTag } from "@/app/admin/actions/brand-tags";
import { Plus, Pencil, Trash2, Check, X, Loader2, Bookmark } from "lucide-react";

type BrandTag = { id: string; name: string };

interface BrandTagsManagerProps {
  initialTags: BrandTag[];
}

function BrandRow({
  tag,
  onUpdated,
  onDeleted,
}: {
  tag: BrandTag;
  onUpdated: (t: BrandTag) => void;
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
      const res = await updateBrandTag(tag.id, name);
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
      const res = await deleteBrandTag(tag.id);
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
          placeholder="Brand name"
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
    <div className="flex items-center gap-3 px-5 py-4 rounded-xl border border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-sm transition-all group">
      <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
        <Bookmark className="w-4 h-4 text-violet-500" />
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

export function BrandTagsManager({ initialTags }: BrandTagsManagerProps) {
  const [tags, setTags] = useState<BrandTag[]>(initialTags);
  const [newName, setNewName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleCreate = () => {
    setError("");
    if (!newName.trim()) {
      setError("Enter a brand name.");
      return;
    }
    startTransition(async () => {
      const res = await createBrandTag(newName);
      if (res.success && res.tag) {
        setTags((prev) => [...prev, { id: res.tag!.id, name: res.tag!.name }]);
        setNewName("");
      } else {
        setError(res.error || "Failed.");
      }
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950">Brand Tags</h1>
        <p className="text-sm sm:text-base text-zinc-400 font-medium">
          Create reusable brand name tags for your offline sales. One click fills the brand on any item.
        </p>
      </div>

      {/* Create new tag */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 sm:p-8 space-y-5">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">New Brand</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="Brand name (e.g. Nike, Adidas)"
            className="flex-1 h-12 px-4 rounded-xl border border-zinc-200 text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 transition-all placeholder:text-zinc-400"
          />
          <button
            onClick={handleCreate}
            disabled={isPending}
            className="h-12 px-6 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add Brand
          </button>
        </div>
        {error && (
          <p className="text-xs text-rose-500 font-medium">{error}</p>
        )}
      </div>

      {/* Tag list */}
      <div className="space-y-2.5">
        {tags.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-zinc-200 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center mx-auto">
              <Bookmark className="w-6 h-6 text-zinc-300" />
            </div>
            <p className="text-sm font-semibold text-zinc-400">No brands yet — add your first one above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {tags.map((tag) => (
              <BrandRow
                key={tag.id}
                tag={tag}
                onUpdated={(updated) =>
                  setTags((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
                }
                onDeleted={(id) =>
                  setTags((prev) => prev.filter((t) => t.id !== id))
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
