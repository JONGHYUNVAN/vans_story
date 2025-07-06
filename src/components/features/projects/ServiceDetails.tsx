import { ProjectService } from '@/interfaces/project';

interface ServiceDetailsProps {
  services: ProjectService[];
  selectedService: string | null;
  selectedTech?: string | null;
}

export default function ServiceDetails({ services, selectedService, selectedTech }: ServiceDetailsProps) {
  if (!selectedService) return null;

  const service = services.find(s => s.name === selectedService);
  if (!service) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-8">
      <h4 className="text-lg font-semibold mb-3">{service.name}</h4>
      <p className="text-gray-600 mb-4">{service.description}</p>
      
      <div className="mb-4">
        <h5 className="font-medium mb-2">기술 스택</h5>
        <div className="flex flex-wrap gap-2">
          {service.tech.map((tech) => (
            <span
              key={tech}
              className={`px-2 py-1 rounded text-sm ${
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
        <h5 className="font-medium mb-2">주요 기능</h5>
        <ul className="space-y-1">
          {service.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 