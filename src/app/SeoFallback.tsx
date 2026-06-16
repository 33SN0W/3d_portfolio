import { SITE_NAME, SITE_URL, CONTACT, VALUE_PROPOSITION } from "@/config/site";
import { PROJECTS_DATA } from "@/content/portfolio";

export default function SeoFallback() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Prateek",
    jobTitle: "Software Engineer",
    description: VALUE_PROPOSITION,
    email: CONTACT.email,
    url: SITE_URL,
    sameAs: [CONTACT.github, CONTACT.linkedin],
    knowsAbout: [
      "PySpark",
      "Azure Synapse",
      "Microsoft Fabric",
      "C++",
      "Python",
      "TensorFlow",
      "Data Engineering",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="sr-only">
        <h1>{SITE_NAME}</h1>
        <p>{VALUE_PROPOSITION}</p>
        <p>
          Software Engineer and Systems &amp; Data Architect. MBA Core at IIM Mumbai.
          B.Tech CSE at IIIT Guwahati. Experience at MAQ Software building PySpark
          pipelines processing 200M+ rows per day.
        </p>
        <h2>Projects</h2>
        <ul>
          {PROJECTS_DATA.map((p) => (
            <li key={p.id}>
              {p.name}: {p.desc}
            </li>
          ))}
        </ul>
        <p>
          Contact: {CONTACT.email} · GitHub: {CONTACT.github} · LinkedIn:{" "}
          {CONTACT.linkedin}
        </p>
      </div>
    </>
  );
}
