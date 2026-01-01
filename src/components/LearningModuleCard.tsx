interface LearningModuleCardProps {
  category: string;
  title: string;
  image: string;
  accentColor?: string;
}

export default function LearningModuleCard({
  category,
  title,
  image,
  accentColor = "var(--brand-cyan)",
}: LearningModuleCardProps) {
  return (
    <article className="group h-full cursor-pointer rounded-3xl overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:transform hover:scale-105 bg-white shadow-sm hover:shadow-lg flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        {/* Category Badge */}
        <span
          className="inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-4 self-start"
          style={{ background: accentColor, color: "white" }}
        >
          {category}
        </span>
        
        {/* Image */}
        <div className="relative h-48 rounded-2xl overflow-hidden mb-4" style={{ background: accentColor }}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Title */}
        <h3
          className="text-lg font-bold mb-4 flex-1"
          style={{ color: "var(--brand-dark-blue)" }}
        >
          {title}
        </h3>
        
        {/* Button */}
        <button
          className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:opacity-90 mt-auto"
          style={{ backgroundColor: "#FF6B4A" }}
        >
          More details
        </button>
      </div>
    </article>
  );
}
