'use client';

import { useTranslation } from '@/utils/i18n';

const certifications = [
  {
    name: 'PCCP 1급',
    fullName: 'Programmers Certified Coding Professional',
    issuer: '프로그래머스',
    date: '2023',
    description: '프로그래밍 역량과 알고리즘 문제 해결 능력을 검증하는 자격증',
    relevance: '백엔드 개발에 필요한 논리적 사고와 효율적인 코드 작성 능력을 증명',
    icon: '💻',
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
  },
  {
    name: 'SQLD',
    fullName: 'SQL Developer',
    issuer: '한국데이터산업진흥원',
    date: '2025',
    description: 'SQL 개발자 자격증으로 데이터베이스 설계 및 SQL 작성 능력을 검증',
    relevance: '백엔드 개발의 핵심인 데이터베이스 설계, 쿼리 최적화, 데이터 모델링 역량을 증명',
    icon: '🗄️',
    color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
  },
  {
    name: 'TOEIC 890점',
    fullName: 'Test of English for International Communication',
    issuer: 'ETS',
    date: '2024',
    description: '국제적인 영어 의사소통 능력을 측정하는 시험',
    relevance: '영문 기술 문서, API 문서, 오픈소스 프로젝트 이해 능력',
    icon: '🌍',
    color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
  }
];

export function CertificationsSection() {
  const { t } = useTranslation('about');

  return (
    <section className="py-20">
      <div className="space-y-12">
        {/* Section Header */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Certifications
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            백엔드 개발 역량을 뒷받침하는 자격증과 성과입니다. 지속적인 학습과 성장을 통해 전문성을 키워가고 있습니다.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert, index) => (
            <div 
              key={cert.name}
              className={`p-6 border-2 rounded-lg transition-all duration-300 hover:shadow-lg ${cert.color} hover:scale-105`}
            >
              {/* Certificate Icon */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{cert.icon}</span>
              </div>

              {/* Certificate Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {cert.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {cert.fullName}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{cert.issuer}</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{cert.date}</span>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {cert.description}
                </p>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
} 