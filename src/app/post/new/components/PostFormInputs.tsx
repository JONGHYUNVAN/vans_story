import { useTranslation } from '@/utils/i18n';
import { THEMES, CategoryOption } from '@/constants/themes';

// 언어 옵션 배열
const LANGUAGES = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' }
];

interface PostFormInputsProps {
  title: string;
  setTitle: (value: string) => void;
  topic: string;
  setTopic: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  theme: string;
  setTheme: (value: string) => void;
  language: string;
  setLanguage: (value: string) => void;
  category: CategoryOption | null;
  setCategory: (value: CategoryOption | null) => void;
  thumbnail: string;
  setThumbnail: (value: string) => void;
  tags: string[];
  setTags: (value: string[]) => void;
  availableCategories: CategoryOption[];
}

export function PostFormInputs({
  title,
  setTitle,
  topic,
  setTopic,
  description,
  setDescription,
  theme,
  setTheme,
  language,
  setLanguage,
  category,
  setCategory,
  thumbnail,
  setThumbnail,
  tags,
  setTags,
  availableCategories
}: PostFormInputsProps) {
  const { t } = useTranslation('');

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t('post.create.inputTitle')}
        className="w-full p-2 border rounded text-black placeholder-black text-center"
      />
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder={t('post.create.inputTopic')}
        className="w-full p-2 border rounded text-black placeholder-black text-center"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={t('post.create.inputDescription')}
        className="w-full p-2 border rounded text-black placeholder-black text-center"
      />

      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="w-full p-2 border rounded text-black text-center"
      >
        <option value="">{t('post.create.selectTheme')}</option>
        {THEMES.map((theme) => (
          <option key={theme.value} value={theme.value}>{theme.label}</option>
        ))}
      </select>

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-full p-2 border rounded text-black text-center"
      >
        <option value="">{t('post.create.selectLanguage')}</option>
        {LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>{lang.label}</option>
        ))}
      </select>

      <select
        value={category?.value || ''}
        onChange={(e) => {
          console.log('🔄 카테고리 select onChange:', e.target.value);
          const selected = availableCategories.find(c => c.value === e.target.value);
          setCategory(selected || null);
        }}
        className="w-full p-2 border rounded text-black text-center"
        disabled={availableCategories.length === 0}
      >
        <option value="">{t('post.create.selectCategory')}</option>
        {availableCategories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
            {cat.description && ` - ${cat.description}`}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={thumbnail}
        onChange={(e) => setThumbnail(e.target.value)}
        placeholder={t('post.create.inputThumbnail')}
        className="w-full p-2 border rounded text-black placeholder-black text-center"
      />

      <input
        type="text"
        value={tags.join(', ')}
        onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
        placeholder={t('post.create.inputTags')}
        className="w-full p-2 border rounded text-black placeholder-black"
      />
    </div>
  );
} 