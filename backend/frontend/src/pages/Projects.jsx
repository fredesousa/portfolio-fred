import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api";

/**
 * Projects.jsx — Corporate Pro
 * - Liste des projets avec: recherche, filtres (Web/Back/Featured), tri, pagination, taille de page
 * - Compatible avec API DRF (paginated {results,count,next,previous}) ou liste simple []
 * - CRA + Tailwind
 */

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [raw, setRaw] = useState([]); // si API non paginée
  const [pageData, setPageData] = useState({ results: [], count: 0, next: null, previous: null }); // si API paginée
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state depuis l'URL (pour partage)
  const tab = searchParams.get("tab") || "all"; // all|web|back
  const q = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "new"; // new|old|az|za
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("size") || "9", 10); // client-side
  const featuredOnly = searchParams.get("featured") === "1";

  // Fetch
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    // Essaye DRF pagination: /projects/?page=X&page_size=Y&search=... (si SearchFilter config côté DRF)
    api
      .get("/projects/", { params: { page, page_size: pageSize, search: q } })
      .then((res) => {
        if (!mounted) return;
        if (Array.isArray(res.data)) {
          // non paginé
          setRaw(res.data);
          setPageData({ results: [], count: res.data.length, next: null, previous: null });
        } else {
          // paginé DRF
          setPageData({
            results: res.data.results || [],
            count: typeof res.data.count === "number" ? res.data.count : (res.data.results || []).length,
            next: res.data.next || null,
            previous: res.data.previous || null,
          });
          setRaw([]);
        }
      })
      .catch((err) => setError(err.message || "Erreur réseau"))
      .finally(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, [page, pageSize, q]);

  // Normalisation des items à afficher (client-side si non paginé)
  const items = useMemo(() => {
    const source = raw.length ? raw : pageData.results;

    // Filtrage par onglet
    const byTab = source.filter((p) => {
      if (tab === "web") return hasTag(p, ["react", "frontend", "tailwind", "web"]);
      if (tab === "back") return hasTag(p, ["django", "api", "drf", "backend"]);
      return true;
    });

    // Featured seulement
    const byFeatured = featuredOnly ? byTab.filter((p) => !!p.featured) : byTab;

    // Recherche côté client (titre, tags, description)
    const qq = q.trim().toLowerCase();
    const bySearch = qq
      ? byFeatured.filter(
          (p) =>
            (p.title || "").toLowerCase().includes(qq) ||
            (p.tags || "").toLowerCase().includes(qq) ||
            (p.description || "").toLowerCase().includes(qq)
        )
      : byFeatured;

    // Tri
    const sorted = [...bySearch].sort((a, b) => {
      if (sort === "az") return (a.title || "").localeCompare(b.title || "");
      if (sort === "za") return (b.title || "").localeCompare(a.title || "");
      // new/old via created_at si dispo, sinon ordre naturel
      const da = a.created_at ? new Date(a.created_at).getTime() : 0;
      const db = b.created_at ? new Date(b.created_at).getTime() : 0;
      return sort === "old" ? da - db : db - da;
    });

    // Si API non paginée, on fait la pagination côté client
    if (raw.length) {
      const start = (page - 1) * pageSize;
      return sorted.slice(start, start + pageSize);
    }

    return sorted; // si API paginée, on ne coupe pas ici
  }, [raw, pageData.results, tab, featuredOnly, q, sort, page, pageSize]);

  // Total pour pagination UI
  const totalCount = raw.length ? itemsTotalCount(raw, tab, featuredOnly, q) : pageData.count;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-6 py-10 space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Projets</h1>
          <p className="text-slate-600">Explorez les réalisations: filtres, recherche et tri pour trouver rapidement ce qui vous intéresse.</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-6">
        <Toolbar
          tab={tab}
          q={q}
          sort={sort}
          featuredOnly={featuredOnly}
          pageSize={pageSize}
          onChange={(patch) => setSearchParams({
            tab,
            q,
            sort,
            page: String(page),
            size: String(pageSize),
            featured: featuredOnly ? "1" : "0",
            ...patch,
          })}
        />

        {loading ? (
          <GridSkeleton />
        ) : error ? (
          <p className="text-rose-600">Erreur: {error}</p>
        ) : items.length === 0 ? (
          <EmptyState reset={() => setSearchParams({ tab: "all", q: "", sort: "new", page: "1", size: String(pageSize), featured: "0" })} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => (
              <ProjectCard key={p.id || p.slug} project={p} />
            ))}
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          onPage={(p) => setSearchParams({ tab, q, sort, page: String(p), size: String(pageSize), featured: featuredOnly ? "1" : "0" })}
        />
      </main>
    </div>
  );
}

/* --------------------------------- Toolbar --------------------------------- */
function Toolbar({ tab, q, sort, featuredOnly, pageSize, onChange }) {
  return (
    <section className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Chip active={tab === "all"} onClick={() => onChange({ tab: "all", page: "1" })}>Tout</Chip>
          <Chip active={tab === "web"} onClick={() => onChange({ tab: "web", page: "1" })}>Web</Chip>
          <Chip active={tab === "back"} onClick={() => onChange({ tab: "back", page: "1" })}>Back</Chip>
          <label className="inline-flex items-center gap-2 text-sm ml-2">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => onChange({ featured: e.target.checked ? "1" : "0", page: "1" })}
            />
            À la une
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            value={q}
            onChange={(e) => onChange({ q: e.target.value, page: "1" })}
            placeholder="Rechercher titre/tags…"
            className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none w-52"
          />
          <select
            value={sort}
            onChange={(e) => onChange({ sort: e.target.value })}
            className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
            aria-label="Trier"
          >
            <option value="new">Plus récents</option>
            <option value="old">Plus anciens</option>
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
          </select>
          <select
            value={String(pageSize)}
            onChange={(e) => onChange({ size: e.target.value, page: "1" })}
            className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
            aria-label="Par page"
          >
            {[6, 9, 12, 18].map((n) => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm border ${active ? "bg-slate-900 text-white border-slate-900" : "border-slate-300 bg-white hover:bg-slate-100"}`}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

/* ---------------------------- Helpers & Pieces ----------------------------- */
function hasTag(project, list) { const s = (project.tags || "").toLowerCase(); return list.some((t) => s.includes(t)); }

function itemsTotalCount(source, tab, featuredOnly, q) {
  const base = source.filter((p) => {
    if (tab === "web") return hasTag(p, ["react", "frontend", "tailwind", "web"]);
    if (tab === "back") return hasTag(p, ["django", "api", "drf", "backend"]);
    return true;
  });
  const feat = featuredOnly ? base.filter((p) => !!p.featured) : base;
  const qq = q.trim().toLowerCase();
  if (!qq) return feat.length;
  return feat.filter((p) => (p.title || "").toLowerCase().includes(qq) || (p.tags || "").toLowerCase().includes(qq)).length;
}

function ProjectCard({ project }) {
  const base = process.env.REACT_APP_API_BASE_URL || "";
  const imageSrc = project.image?.startsWith("http") ? project.image : project.image ? `${base}${project.image}` : null;
  const tags = (project.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
  return (
    <article className="group rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">
      {imageSrc ? (
        <img src={imageSrc} alt={project.title} className="w-full h-44 object-cover" />
      ) : (
        <div className="w-full h-44 bg-slate-100 grid place-items-center text-slate-400">Aperçu</div>
      )}
      <div className="p-5 space-y-3">
        <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
        <p className="text-sm text-slate-600 line-clamp-3">{project.description}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className="text-[11px] px-2 py-1 rounded-full bg-slate-100">#{t}</span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between gap-3 pt-1">
          {project.url ? (
            <a href={project.url} target="_blank" rel="noreferrer" className="inline-block text-sm px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50">Voir ↗</a>
          ) : <span /> }
          {project.created_at && (
            <time className="text-xs text-slate-500">{new Date(project.created_at).toLocaleDateString()}</time>
          )}
        </div>
      </div>
    </article>
  );
}

function GridSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm">
          <div className="h-44 bg-slate-100 animate-pulse" />
          <div className="p-5 space-y-2">
            <div className="h-4 bg-slate-100 animate-pulse w-2/3" />
            <div className="h-3 bg-slate-100 animate-pulse w-full" />
            <div className="h-3 bg-slate-100 animate-pulse w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ reset }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-10 text-center text-slate-600">
      <p>Aucun projet ne correspond aux filtres actuels.</p>
      <button onClick={reset} className="mt-4 inline-block text-sm px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50">Réinitialiser</button>
    </div>
  );
}

function Pagination({ page, totalPages, onPage }) {
  if (!totalPages || totalPages <= 1) return null;
  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);
  const pages = paginationRange(page, totalPages);
  return (
    <nav className="flex items-center justify-center gap-1 pt-4" aria-label="Pagination">
      <button onClick={() => onPage(prev)} disabled={page === 1}
        className={`px-3 py-1.5 rounded-lg border text-sm ${page === 1 ? 'text-slate-400 border-slate-200' : 'border-slate-300 bg-white hover:bg-slate-50'}`}>Préc</button>
      {pages.map((p, i) => p === "…" ? (
        <span key={`e-${i}`} className="px-2">…</span>
      ) : (
        <button key={p} onClick={() => onPage(p)}
          className={`px-3 py-1.5 rounded-lg border text-sm ${p === page ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-300 bg-white hover:bg-slate-50'}`}>{p}</button>
      ))}
      <button onClick={() => onPage(next)} disabled={page === totalPages}
        className={`px-3 py-1.5 rounded-lg border text-sm ${page === totalPages ? 'text-slate-400 border-slate-200' : 'border-slate-300 bg-white hover:bg-slate-50'}`}>Suiv</button>
    </nav>
  );
}

function paginationRange(page, total, delta = 1) {
  const range = [];
  const left = Math.max(2, page - delta);
  const right = Math.min(total - 1, page + delta);
  range.push(1);
  if (left > 2) range.push("…");
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push("…");
  if (total > 1) range.push(total);
  return range;
}
