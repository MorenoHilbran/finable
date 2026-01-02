interface LearningModuleCardProps {
  category: string;
  title: string;
  image: string;
  accentColor?: string;
  level?: string;
  duration?: string;
}

export default function LearningModuleCard({
  category,
  title,
  image,
  accentColor = "var(--brand-sage)",
  level,
  duration,
}: LearningModuleCardProps) {
  return (
    <article className="group h-full cursor-pointer rounded-3xl overflow-hidden border-2 border-gray-200 hover:border-gray-300 bg-white flex flex-col transition-all duration-200 ease-out hover:-translate-y-1 shadow-md hover:shadow-xl">
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
            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
        </div>
        
        {/* Title */}
        <h3
          className="text-lg font-bold mb-4 flex-1 line-clamp-2 leading-snug"
          style={{ color: "var(--brand-black)" }}
        >
          {title}
        </h3>
        
        {/* Level and Duration Info */}
        {(level || duration) && (
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
            {level && (
              <span className="flex items-center gap-1.5">
                <span>📊</span>
                <span className="font-medium">{level}</span>
              </span>
            )}
            {duration && (
              <span className="flex items-center gap-1.5">
                <span>⏱️</span>
                <span className="font-medium">{duration}</span>
              </span>
            )}
          </div>
        )}
        
        {/* Button */}
        <button
          className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 ease-out hover:opacity-90 hover:shadow-md mt-auto"
          style={{ backgroundColor: "var(--brand-sage)" }}
        >
          More details
        </button>
      </div>
    </article>
  );
}
