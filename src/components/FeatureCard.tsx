interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  highlights?: string[];
  accentColor?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  highlights,
  accentColor = "var(--brand-cyan)",
}: FeatureCardProps) {
  return (
    <article className="card group h-full">
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110"
        style={{ background: `${accentColor}20` }}
      >
        {icon}
      </div>

      {/* Content */}
      <h3
        className="text-lg font-bold mb-2"
        style={{ color: "var(--brand-dark-blue)" }}
      >
        {title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-4">{description}</p>

      {/* Highlights */}
      {highlights && highlights.length > 0 && (
        <ul className="space-y-2 mt-auto">
          {highlights.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-gray-600"
            >
              <span style={{ color: accentColor }}>✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
