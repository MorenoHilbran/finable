interface UserCardProps {
  icon: string;
  title: string;
  features: string[];
}

export default function UserCard({ icon, title, features }: UserCardProps) {
  return (
    <article className="card text-center h-full">
      {/* Icon */}
      <div className="text-4xl mb-4">{icon}</div>

      {/* Title */}
      <h3
        className="text-lg font-bold mb-4"
        style={{ color: "var(--brand-dark-blue)" }}
      >
        {title}
      </h3>

      {/* Features */}
      <div className="flex flex-wrap justify-center gap-2">
        {features.map((feature, index) => (
          <span
            key={index}
            className="px-3 py-1 text-xs font-medium rounded-full"
            style={{
              background: "var(--brand-cyan)",
              color: "white",
            }}
          >
            {feature}
          </span>
        ))}
      </div>
    </article>
  );
}
