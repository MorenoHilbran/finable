interface UserCardProps {
  icon: string;
  title: string;
  features: string[];
}

export default function UserCard({ icon, title, features }: UserCardProps) {
  return (
    <article className="card text-center h-full">
      {/* Icon */}
      <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
        <img src={icon} alt="" className="w-12 h-12" />
      </div>

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
              background: "var(--brand-green)",
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
