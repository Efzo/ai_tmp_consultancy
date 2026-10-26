"use client";
import type { MediaAsset } from "@prisma/client";

import { useState, useEffect } from "react";
import { updateSiteSetting } from "@/app/actions/cms";
import { getMediaAssets } from "@/app/actions/media";
import TrustLogoItem from "./TrustLogoItem";

export default function TrustLogosEditor({ logos }: { logos: { name: string; logoUrl: string }[] }) {
  const [rows, setRows] = useState(logos);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadAssets() {
      const data = await getMediaAssets();
      setAssets(data);
    }
    loadAssets();
  }, []);

  const update = (index: number, updates: Partial<{ name: string; logoUrl: string }>) =>
    setRows((current) => current.map((logo, logoIndex) => logoIndex === index ? { ...logo, ...updates } : logo));

  const add = () => setRows((current) => [...current, { name: "New Company", logoUrl: "/logo_pack/logo.png" }]);
  const remove = (index: number) => setRows((current) => current.filter((_, idx) => idx !== index));

  const save = async () => {
    setSaving(true);
    const result = await updateSiteSetting("trust.logos", JSON.stringify(rows));
    setMessage(result.message);
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Trust Bar Logos</h2>
          <p className="mt-1 text-sm text-slate-muted">Manage the enterprise partners and organizations shown in the Trust section.</p>
        </div>
        <button type="button" onClick={add} className="btn-secondary">Add Company</button>
      </div>

      <div className="grid gap-4">
        {rows.map((logo, index) => (
          <TrustLogoItem
            key={index}
            index={index}
            logo={logo}
            assets={assets}
            updateLogo={update}
            removeLogo={remove}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-cyan-ai">{message}</p>
        <button type="button" onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Saving…" : "Save Trust Logos"}
        </button>
      </div>
    </div>
  );
}
