interface TechStackProps {
  technologies: string[];
  selectedTech?: string | null;
  onTechSelect?: (tech: string | null) => void;
}

export default function TechStack({ technologies, selectedTech, onTechSelect }: TechStackProps) {
  return (
    <div className="mb-8">
      <h3 className="mb-4 text-xl font-semibold">기술 스택</h3>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <span
            key={tech}
            className={`cursor-pointer rounded-full px-3 py-1 text-sm transition-all ${
              selectedTech === tech
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
            onClick={() => onTechSelect?.(selectedTech === tech ? null : tech)}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
