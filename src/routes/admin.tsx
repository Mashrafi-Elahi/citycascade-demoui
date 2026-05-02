import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { listCityConfigsFn, loginAdminFn, upsertCityConfigFn } from "@/server/server-fns";

export const Route = createFileRoute('/admin')({ component: AdminPage });

type CityConfig = { cityId: string; name: string; country: string; status: 'active' | 'upcoming'; details?: string };

function AdminPage() {
  const [token, setToken] = useState<string>('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<CityConfig[]>([]);
  const [draft, setDraft] = useState<CityConfig>({ cityId: '', name: '', country: '', status: 'upcoming', details: '' });

  useEffect(() => {
    const t = localStorage.getItem('cc_admin_token') ?? '';
    setToken(t);
    if (t) void load(t);
  }, []);

  async function load(t: string) {
    const res = await listCityConfigsFn({ data: { token: t } });
    if (!res.ok) return setError(res.error);
    setRows(res.rows as CityConfig[]);
  }

  async function login(e: FormEvent) {
    e.preventDefault();
    const res = await loginAdminFn({ data: { password } });
    if (!res.ok) return setError(res.error);
    localStorage.setItem('cc_admin_token', res.token);
    setToken(res.token);
    setError(null);
    await load(res.token);
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    const res = await upsertCityConfigFn({ data: { token, ...draft } });
    if (!res.ok) return setError(res.error);
    setDraft({ cityId: '', name: '', country: '', status: 'upcoming', details: '' });
    await load(token);
  }

  if (!token) return <main className="p-6"><h1 className="text-xl mb-4">Admin Login</h1><form onSubmit={login} className="space-y-3 max-w-sm"><input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full border p-2 rounded" placeholder="Admin password"/><button className="px-4 py-2 rounded bg-cyan-500 text-black">Login</button>{error && <p className="text-red-400">{error}</p>}</form></main>;

  return <main className="p-6 space-y-6"><h1 className="text-2xl">CityCascade Admin</h1><p className="text-sm opacity-80">Add or update city cards. Active cities are selectable; upcoming cities show hover/coming-soon state.</p><form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl"><input required value={draft.cityId} onChange={(e)=>setDraft({...draft, cityId:e.target.value})} placeholder="city id" className="border p-2 rounded"/><input required value={draft.name} onChange={(e)=>setDraft({...draft, name:e.target.value})} placeholder="name" className="border p-2 rounded"/><input required value={draft.country} onChange={(e)=>setDraft({...draft, country:e.target.value})} placeholder="country" className="border p-2 rounded"/><select value={draft.status} onChange={(e)=>setDraft({...draft, status:e.target.value as 'active'|'upcoming'})} className="border p-2 rounded"><option value="active">active</option><option value="upcoming">upcoming</option></select><textarea value={draft.details} onChange={(e)=>setDraft({...draft, details:e.target.value})} placeholder="hover details / notes" className="border p-2 rounded md:col-span-2"/><button className="px-4 py-2 rounded bg-cyan-500 text-black md:col-span-2">Save city config</button></form><div className="space-y-2">{rows.map((r)=> <div key={r.cityId} className="border rounded p-3"><div className="font-bold">{r.name} ({r.cityId})</div><div>{r.country} · {r.status.toUpperCase()}</div><div className="text-sm opacity-70">{r.details || 'No hover details set'}</div></div>)}</div>{error && <p className="text-red-400">{error}</p>}</main>;
}
