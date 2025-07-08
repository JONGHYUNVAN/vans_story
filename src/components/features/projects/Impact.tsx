interface ImpactProps {
  impact: string;
}

export default function Impact({ impact }: ImpactProps) {
  return (
    <div className="bg-yellow-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-2">프로젝트 목표</h3>
      <p className="text-gray-700">{impact}</p>
    </div>
  );
} 