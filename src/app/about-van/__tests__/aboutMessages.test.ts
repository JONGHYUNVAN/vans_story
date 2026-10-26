import { describe, it, expect } from 'vitest';
import enAbout from '@/messages/en/about.json';
import koAbout from '@/messages/ko/about.json';

// 객체·배열을 재귀적으로 내려가며 "a.b.0.c" 형태의 리프 키 경로를 모두 모은다
function collectPaths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectPaths(item, `${prefix}${index}.`));
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) => collectPaths(child, `${prefix}${key}.`));
  }
  return [prefix.slice(0, -1)];
}

describe('about.json (ko/en)', () => {
  it('두 언어의 키 경로 집합이 배열 인덱스까지 완전히 같다', () => {
    expect(collectPaths(koAbout).sort()).toEqual(collectPaths(enAbout).sort());
  });

  it.each([
    ['ko', koAbout],
    ['en', enAbout],
  ])('%s: 프로젝트·기술 스택·스킬 항목의 토큰이 라벨 키에 존재한다', (_lang, messages) => {
    const { projects, techStack, skills } = messages.AboutVan;

    for (const project of projects.items) {
      expect(Object.keys(projects.categories)).toContain(project.category);
      expect(Object.keys(projects.status)).toContain(project.status);
    }
    for (const tech of techStack.items) {
      expect(Object.keys(techStack.categories)).toContain(tech.category);
    }
    for (const group of skills.groups) {
      expect(Object.keys(skills.categories)).toContain(group.category);
    }
  });
});
