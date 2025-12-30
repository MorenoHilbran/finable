interface AccessibilityCardProps {
  pilar: string;
  title: string;
  implementations: string[];
  color: string;
}

export default function AccessibilityCard({
  pilar,
  title,
  implementations,
  color,
}: AccessibilityCardProps) {
  return (
    <article
      className="card h-full border-t-4"
      style={{ borderTopColor: color }}
    >
      {/* Pilar Badge */}
      <span
        className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3"
        style={{ background: `${color}20`, color }}
      >
        {pilar}
      </span>

      {/* Title */}
      <h3
        className="text-lg font-bold mb-4"
        style={{ color: "var(--brand-dark-blue)" }}
      >
        {title}
      </h3>

      {/* Implementations */}
      <ul className="space-y-2">
        {implementations.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
            <span style={{ color }}>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
