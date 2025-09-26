export default function ProjectCard({ project }) {
  const tags = (project.tags || "").split(",").map(t => t.trim()).filter(Boolean);
  const base = process.env.REACT_APP_API_BASE_URL || "";
  const imageSrc = project.image?.startsWith("http")
    ? project.image
    : (project.image ? `${base}${project.image}` : null);

  return (
    <article className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      {imageSrc ? (
        <img src={imageSrc} alt={project.title} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">Aperçu</div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <p className="mt-2 text-sm text-gray-600">{project.description}</p>
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 bg-gray-100 rounded-full">#{tag}</span>
            ))}
          </div>
        )}
        <div className="mt-4">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-sm px-3 py-2 rounded-lg border hover:bg-gray-50"
            >
              Voir le projet ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
