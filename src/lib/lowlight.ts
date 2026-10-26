/**
 * 코드 블록 하이라이트용 lowlight 인스턴스. 에디터(EditorExtensions)와 뷰어(Viewer)가 같은 것을 쓴다.
 * 예전에는 두 곳에서 같은 언어 21개를 각각 등록해 번들에 두 번 들어갔다.
 */
import { common, createLowlight } from 'lowlight';
import js from 'highlight.js/lib/languages/javascript';
import java from 'highlight.js/lib/languages/java';
import python from 'highlight.js/lib/languages/python';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import kotlin from 'highlight.js/lib/languages/kotlin';
import sql from 'highlight.js/lib/languages/sql';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import rust from 'highlight.js/lib/languages/rust';
import go from 'highlight.js/lib/languages/go';
import ruby from 'highlight.js/lib/languages/ruby';
import swift from 'highlight.js/lib/languages/swift';
import php from 'highlight.js/lib/languages/php';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import bash from 'highlight.js/lib/languages/bash';
import markdown from 'highlight.js/lib/languages/markdown';

export const lowlight = createLowlight(common);

const LANGUAGES = {
  js,
  javascript: js,
  typescript,
  html: xml,
  xml,
  css,
  python,
  java,
  kotlin,
  sql,
  cpp,
  csharp,
  rust,
  go,
  ruby,
  swift,
  php,
  json,
  yaml,
  bash,
  markdown,
} as const;

for (const [name, grammar] of Object.entries(LANGUAGES)) {
  lowlight.register(name, grammar);
}
