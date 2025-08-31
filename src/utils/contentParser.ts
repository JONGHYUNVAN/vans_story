/**
 * TipTap/ProseMirror 같은 구조화된 컨텐츠를 파싱하기 위한 유틸리티
 */

interface ContentNode {
  type: string;
  content?: ContentNode[];
  text?: string;
  marks?: { type: string }[];
}

/**
 * 구조화된 컨텐츠 노드 배열을 재귀적으로 순회하며 텍스트만 추출하여 합칩니다.
 * @param nodes - 파싱할 컨텐츠 노드 배열
 * @returns 추출된 플레인 텍스트 문자열
 */
function extractTextFromNodes(nodes: ContentNode[] | undefined): string {
  if (!Array.isArray(nodes)) {
    return '';
  }

  let text = '';
  for (const node of nodes) {
    if (node.text) {
      text += node.text;
    }
    if (node.content) {
      // 하위 노드 사이에 공백을 추가하여 단어가 붙는 것을 방지합니다.
      text += ' ' + extractTextFromNodes(node.content);
    }
  }
  return text;
}

/**
 * Elasticsearch 하이라이트 결과 또는 구조화된 컨텐츠 객체를 받아
 * 표시 가능한 텍스트로 변환합니다.
 * @param content - 하이라이트 결과(string[]) 또는 컨텐츠 객체(object)
 * @returns 가공된 텍스트 (HTML 또는 plain text)
 */
export function parseContent(content: any): string {
  if (!content) {
    return '';
  }

  // Elasticsearch highlight 결과 처리 (HTML 태그가 포함된 문자열 배열)
  if (Array.isArray(content)) {
    console.log('🔍 Processing array content:', content);
    const processedItems = content.map(item => {
      if (typeof item === 'string') {
        return parseContent(item); // 재귀적으로 각 문자열을 파싱
      }
      return '';
    });
    return processedItems.join(' ... ');
  }

  // 구조화된 컨텐츠 객체 처리 (e.g., item.summary)
  if (typeof content === 'object' && content.type === 'doc' && Array.isArray(content.content)) {
    // 재귀적으로 텍스트를 추출하고, 여러 공백을 하나로 합칩니다.
    return extractTextFromNodes(content.content).trim().replace(/\s+/g, ' ');
  }

  // JSON 형태의 원시 데이터 처리 (이미지에서 보이는 문제)
  if (typeof content === 'string' && (content.includes("'type': 'text'") || content.includes("'content':"))) {
    console.log('🔍 Parsing JSON-like content:', content);
    try {
      // 작은따옴표를 큰따옴표로 변환하여 JSON 파싱 가능하게 만들기
      const jsonString = content
        .replace(/'/g, '"') // 작은따옴표를 큰따옴표로
        .replace(/"text":\s*"([^"]*?)"/g, (match, text) => {
          // HTML 태그 제거
          return `"text": "${text.replace(/<[^>]*>/g, '')}"`;
        });

      // JSON 배열로 파싱 시도
      try {
        const jsonArray = JSON.parse(`[${jsonString}]`);
        const texts = jsonArray
          .filter((item: any) => item && item.text)
          .map((item: any) => item.text);
        const result = texts.join(' ').trim();
        console.log('🔍 Extracted text from JSON array:', result);
        return result;
      } catch {
        // 단일 JSON 객체로 파싱 시도
        try {
          const jsonObject = JSON.parse(jsonString);
          if (jsonObject.text) {
            console.log('🔍 Extracted text from JSON object:', jsonObject.text);
            return jsonObject.text;
          }
        } catch {
                     // JSON 파싱 실패 시 정규식으로 텍스트만 추출
           const textMatches = content.match(/'text':\s*'([^']*?)'/g);
           if (textMatches && textMatches.length > 0) {
             const result = textMatches.map(match => {
               const textMatch = match.match(/'text':\s*'([^']*?)'/);
               if (textMatch) {
                 return textMatch[1].replace(/<[^>]*>/g, '');
               }
               return '';
             }).join(' ').trim();
             console.log('🔍 Extracted text from regex fallback:', result);
             return result;
           }

           // 최종 대안: 모든 텍스트 내용을 추출
           const allTextMatches = content.match(/'text':\s*'([^']*?)'/g);
           if (allTextMatches && allTextMatches.length > 0) {
             const result = allTextMatches.map(match => {
               const textMatch = match.match(/'text':\s*'([^']*?)'/);
               if (textMatch) {
                 return textMatch[1].replace(/<[^>]*>/g, '');
               }
               return '';
             }).join(' ').trim();
             console.log('🔍 Extracted all text:', result);
             return result;
           }
        }
      }
    } catch (error) {
      console.warn('Failed to parse JSON-like content:', error);
    }
  }
  
  // 이미 플레인 텍스트인 경우
  if (typeof content === 'string') {
    return content;
  }

  // 알 수 없는 형식일 경우, 사용자에게 친화적인 메시지를 반환합니다.
  console.warn('Unknown content format for parsing:', content);
  return '[내용을 불러올 수 없습니다]';
}
