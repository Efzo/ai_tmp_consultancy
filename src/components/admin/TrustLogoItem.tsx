"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { uploadMediaAsset } from "@/app/actions/media";

interface TrustLogoItemProps {
  logo: { name: string; logoUrl: string };
  index: number;
  assets: any[];
  updateLogo: (index: number, updates: Partial<{ name: string; logoUrl: string }>) => void;
  removeLogo: (index: number) => void;
}

export default function TrustLogoItem({ logo, index, assets, updateLogo, removeLogo }: TrustLogoItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const result = await uploadMediaAsset(formData);
      if (result.success && result.asset) {
        updateLogo(index, { logoUrl: result.asset.url });
      } else {
        alert(result.message || "Upload failed");
      }
    } catch (e: any) {
      alert(e.message || "An error occurred during upload");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`relative flex items-center gap-4 p-4 glass-panel border border-glass group ${isOpen ? "z-50" : "z-0"}`}>
      <div className="relative h-12 w-20 rounded border border-glass bg-white/5 overflow-hidden flex-shrink-0">
        <Image 
          src={logo.logoUrl} 
          alt={logo.name} 
          fill 
          className="object-contain p-1" 
        />
      </div>
      
      <div className="flex-1 grid gap-2 md:grid-cols-2">
        <label className="text-xs text-slate-muted">Company Name
          <input 
            value={logo.name} 
            onChange={(e) => updateLogo(index, { name: e.target.value })} 
            className="mt-1 w-full rounded-lg border border-glass bg-white/5 px-3 py-1 text-white outline-none focus:border-electric" 
          />
        </label>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-muted flex-1">Logo URL
            <input 
              value={logo.logoUrl} 
              onChange={(e) => updateLogo(index, { logoUrl: e.target.value })} 
              className="mt-1 w-full rounded-lg border border-glass bg-white/5 px-3 py-1 text-white outline-none focus:border-electric" 
            />
          </label>
          <div className="flex items-center gap-2">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden" 
              accept="image/*"
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()} 
              disabled={isUploading}
              className="btn-secondary px-3 py-1 text-xs h-fit mt-5 disabled:opacity-50"
            >
              {isUploading ? "..." : "Upload"}
            </button>
            <button 
              type="button" 
              onClick={() => setIsOpen(!isOpen)} 
              className="btn-secondary px-3 py-1 text-xs h-fit mt-5"
            >
              Select
            </button>
          </div>
        </div>
      </div>

      <button 
        type="button" 
        onClick={() => removeLogo(index)} 
        className="text-red-300 hover:text-red-200 p-2 transition-colors"
        title="Remove company"
      >
        Remove
      </button>

      {isOpen && (
        <div className="absolute z-[60] top-full right-0 mt-2 w-64 glass-panel p-4 rounded-xl border border-electric/30 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
          <h4 className="text-xs font-bold mb-3 text-electric uppercase tracking-wider">Select Asset</h4>
          <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1">
            {assets.map((asset) => (
              <button 
                key={asset.id} 
                onClick={() => {
                  updateLogo(index, { logoUrl: asset.url });
                  setIsOpen(false);
                }}
                className="aspect-square rounded-md border border-glass bg-white/5 hover:border-electric transition-colors overflow-hidden group/asset"
              >
                <Image src={asset.url} alt={asset.filename} fill className="object-cover group-hover/asset:scale-110 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
