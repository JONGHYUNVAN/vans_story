import { ProjectService } from '@/types/project';

interface ServiceDetailsProps {
  services: ProjectService[];
  selectedService: string | null;
  selectedTech?: string | null;
}

export default function ServiceDetails({
  services,
  selectedService,
  selectedTech,
}: ServiceDetailsProps) {
  if (!selectedService) return null;

  const service = services.find((s) => s.name === selectedService);
  if (!service) return null;

  return (
    <div className="mb-8 rounded-lg bg-gray-50 p-6">
      <h4 className="mb-3 text-lg font-semibold">{service.name}</h4>
      <p className="mb-4 whitespace-pre-line text-gray-600">{service.description}</p>

      <div className="mb-4">
        <h5 className="mb-2 font-medium">기술 스택</h5>
        <div className="flex flex-wrap gap-2">
          {service.tech.map((tech) => (
            <span
              key={tech}
              className={`rounded px-2 py-1 text-sm ${
                selectedTech === tech
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h5 className="mb-2 font-medium">주요 기능</h5>
        <ul className="space-y-1">
          {service.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-start gap-2">
              <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
