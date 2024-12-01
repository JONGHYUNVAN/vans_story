import { Menu, Transition, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Fragment } from 'react';
import { MdKeyboardArrowDown } from "react-icons/md";
import { useTranslation } from '@/utils/i18n';
import 'flag-icons/css/flag-icons.min.css';

/**
 * 지원하는 언어 목록
 */
const languages = [
  { code: 'ko', label: '한국어', flag: 'kr' },
  { code: 'en', label: 'English', flag: 'us' },
];

export default function LanguageSelector() {
  const { locale, changeLocale } = useTranslation();

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm">
        <span className={`fi fi-${currentLanguage.flag} w-4`} />
        <span>{currentLanguage.label}</span>
        <MdKeyboardArrowDown />
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 mt-2 w-32 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          {languages.map((lang) => (
            <MenuItem key={lang.code}>
              <button
                onClick={() => changeLocale(lang.code as 'ko' | 'en')}
                className={`${
                  locale === lang.code ? 'font-medium bg-gray-100' : ''
                } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2`}
              >
                <span className={`fi fi-${lang.flag} w-4`} />
                {lang.label}
              </button>
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  );
} 