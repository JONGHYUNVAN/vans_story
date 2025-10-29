import { useCallback } from 'react'
import { ApiFetch } from '@/lib/apiFetch'
import { API_URLS } from '@/constants/apiUrl';

/**
 * 에디터 HTML 내 blob: URL 이미지를 서버에 업로드하고 src를 서버 URL로 치환
 * @param localImages Blob URL과 File 객체를 매핑한 Map
 */
export function useImageUploadAndReplace(localImages: Map<string, File>) {
  const uploadAndReplace = useCallback(async (html: string) => {
    // 1. Blob URL 추출
    const blobUrls = Array.from(html.matchAll(/<img[^>]+src="(blob:[^"]+)"/g)).map(m => m[1]);
    if (blobUrls.length === 0) return html;

    // 2. 업로드
    const uploadResults = await Promise.all(blobUrls.map(async (blobUrl) => {
      const file = localImages.get(blobUrl);
      if (!file) return { blobUrl, serverUrl: null };
      const formData = new FormData();
      formData.append('image', file);
      const res = await ApiFetch.filePost(API_URLS.POST.UPLOAD_IMAGE, formData);
      if (!res.ok) return { blobUrl, serverUrl: null };
      const { fileName } = await res.json();
      const serverUrl = fileName;
      return { blobUrl, serverUrl };
    }));

    // 3. 치환
    let finalHtml = html;
    uploadResults.forEach(({ blobUrl, serverUrl }) => {
      if (serverUrl) {
        finalHtml = finalHtml.replaceAll(blobUrl, serverUrl);
      }
    });
    return finalHtml;
  }, [localImages]);

  return { uploadAndReplace };
} 