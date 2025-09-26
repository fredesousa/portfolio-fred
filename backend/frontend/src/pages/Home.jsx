import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => { document.title = "Frederico — Tech, produits & contenu"; }, []);
  return (
    <div className="space-y-20">
      <Hero />
      <LogosStrip />
      <WaysToWork />
      <AboutPreview />
      <FeaturedContent />
      <NewsletterCTA />
      <ContactBanner />
    </div>
  );
}

/* ----------------------------------- Hero ---------------------------------- */
function Hero() {
  return (
    <section className="container mx-auto grid lg:grid-cols-2 gap-10 items-center p-4">
      <div className="space-y-6">
        <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
          Rendre l’innovation <span className="underline decoration-gray-300">accessible</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Je conçois des produits web (Django & React) et crée du contenu pour expliquer l’IA, la tech et le business—sans jargon.
          Conférences, conseil, et médias : travaillons sur votre prochaine étape.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/projects" className="px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:opacity-90">Voir réalisations</Link>
          <a href="#contact" className="px-5 py-2.5 rounded-xl border hover:bg-gray-50">Collaborer</a>
          <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-xl border hover:bg-gray-50">Talk Tech ▶︎</a>
        </div>
        <ul className="flex flex-wrap gap-4 text-sm text-gray-500">
          <li>• AI/ML appliquée</li>
          <li>• Django · DRF</li>
          <li>• React · Tailwind</li>
          <li>• Stratégie produit</li>
        </ul>
      </div>
      <div className="relative">
        {/* Placeholder visuel: remplacez par une image ou une vidéo */}
        <div className="aspect-video rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner flex items-center justify-center text-gray-400">
          Media / Portrait / Vidéo
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Logos strip ------------------------------- */
function LogosStrip() {
  const items = ["Client X", "Startup Y", "Microsoft", "Meta", "Fintech Z"];
  return (
    <section className="container mx-auto p-4">
      <div className="rounded-2xl border bg-white p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-center gap-6 opacity-70">
          {items.map((n) => (
            <span key={n} className="text-sm md:text-base text-gray-500">{n}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Ways to collaborate -------------------------- */
function WaysToWork() {
  const items = [
    {
      title: "Speaking",
      desc: "Conférences et keynotes sur l’IA, les carrières tech, l’innovation produit.",
      cta: "Réserver une date",
      link: "#contact",
    },
    {
      title: "Consulting",
      desc: "Audit produit, stratégie, roadmap et MVP en 2–4 semaines (Django/React).",
      cta: "Planifier un appel",
      link: "#contact",
    },
    {
      title: "Media & Partenariats",
      desc: "Contenus pédagogiques, interviews et intégrations produit.",
      cta: "Proposer une collab",
      link: "#contact",
    },
    {
      title: "Talk Tech",
      desc: "Podcast & vidéos: vulgariser l’IA, la robotique et le code.",
      cta: "Voir les épisodes",
      link: "https://www.youtube.com/",
    },
  ];
  return (
    <section className="container mx-auto p-4 space-y-6">
      <header>
        <h2 className="text-2xl md:text-3xl font-semibold">Façons de collaborer</h2>
        <p className="text-gray-600">Choisissez le format adapté à vos objectifs.</p>
      </header>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((s) => (
          <div key={s.title} className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{s.desc}</p>
            <a href={s.link} className="mt-4 inline-block text-sm px-3 py-2 rounded-lg border hover:bg-gray-50">{s.cta}</a>
          </div>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------- About ---------------------------------- */
function AboutPreview() {
  return (
    <section className="container mx-auto p-4 grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-semibold">À propos</h2>
        <p className="text-gray-600 max-w-2xl">
          Développeur full‑stack & créateur. J’aide les équipes à lancer des produits clairs et rapides—et j’explique la tech au plus grand nombre.
          8+ ans d’expérience, focus IA appliquée, performance et UX.
        </p>
        <ul className="text-sm text-gray-600 grid sm:grid-cols-2 gap-2">
          <li>• Django · DRF (API robustes)</li>
          <li>• React · Tailwind (UI modernes)</li>
          <li>• CI/CD, Docker, Cloud</li>
          <li>• Storytelling & pédagogie</li>
        </ul>
        <div className="flex gap-3">
          <Link to="/about" className="px-4 py-2 rounded-xl border hover:bg-gray-50">En savoir plus</Link>
          <a href="#contact" className="px-4 py-2 rounded-xl bg-gray-900 text-white hover:opacity-90">Contact</a>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="w-44 h-44 md:w-56 md:h-56 rounded-full bg-gray-200 border shadow-inner" />
      </div>
    </section>
  );
}

/* ----------------------------- Featured content ---------------------------- */
function FeaturedContent() {
  const items = [
    {
      title: "Comprendre l’IA générative sans le jargon",
      tag: "Vidéo",
      desc: "Les bases + cas d’usage concrets pour votre produit.",
      href: "https://www.youtube.com/",
    },
    {
      title: "Lancer un MVP en 3 sprints (Django/React)",
      tag: "Article",
      desc: "Architecture, priorités et pièges fréquents.",
      href: "#",
    },
    {
      title: "Design ops : pipeline CI/CD simple & efficace",
      tag: "Guide",
      desc: "De GitHub à la prod avec tests et preview.",
      href: "#",
    },
  ];
  return (
    <section className="container mx-auto p-4 space-y-6">
      <header>
        <h2 className="text-2xl md:text-3xl font-semibold">En vedette</h2>
        <p className="text-gray-600">Contenus utiles pour passer à l’action.</p>
      </header>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((c) => (
          <article key={c.title} className="rounded-2xl border bg-white shadow-sm overflow-hidden hover:shadow-md transition">
            <div className="h-40 bg-gray-100" />
            <div className="p-5 space-y-2">
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{c.tag}</span>
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="text-sm text-gray-600">{c.desc}</p>
              <a href={c.href} className="inline-block text-sm px-3 py-2 rounded-lg border hover:bg-gray-50">Voir ↗</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Newsletter CTA ----------------------------- */
function NewsletterCTA() {
  return (
    <section className="container mx-auto p-4">
      <div className="rounded-3xl border bg-gradient-to-br from-gray-900 to-black text-white p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-semibold">La newsletter qui simplifie la tech</h2>
          <p className="text-gray-300">1 email / semaine · IA, produit & outils. Zéro spam.</p>
        </div>
        <form className="flex w-full gap-3">
          <input type="email" required placeholder="Votre email"
                 className="flex-1 px-4 py-3 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none" />
          <button className="px-5 py-3 rounded-xl bg-white text-gray-900 hover:opacity-90">S’inscrire</button>
        </form>
      </div>
    </section>
  );
}

/* ------------------------------- Contact banner ---------------------------- */
function ContactBanner() {
  return (
    <section id="contact" className="container mx-auto p-4">
      <div className="rounded-3xl border bg-white p-8 md:p-12 text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-semibold">Prêt à lancer quelque chose ?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Décrivez votre besoin en 3 points (objectif, deadline, budget indicatif). Je reviens avec un plan clair.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="mailto:fredesousa@icloud.com" className="px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:opacity-90">Email</a>
          <Link to="/about" className="px-5 py-2.5 rounded-xl border hover:bg-gray-50">À propos</Link>
        </div>
      </div>
    </section>
  );
}
