interface ImpactProps {
  impact: string;
}

export default function Impact({ impact }: ImpactProps) {
  return (
    <div className="rounded-lg bg-yellow-50 p-6">
      <h3 className="mb-2 text-lg font-semibold">프로젝트 목표</h3>
      <p className="text-gray-700">{impact}</p>
    </div>
  );
}
