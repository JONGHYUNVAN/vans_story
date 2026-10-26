/**
 * 카테고리(mainCategory)별 포스트 화면 테마.
 *
 * 예전에는 카테고리마다 Layout·List·PostCard·Sidebar·page 5종(총 64개 파일)을 복사해 두고
 * 아이콘·색상·배경 영상만 바꿨다. 이제 화면 컴포넌트는 한 벌(`components/features/post/view/*`)이고
 * 카테고리별 차이는 전부 이 객체 하나에 담는다. 새 카테고리는 여기 한 항목 + public/ 이미지로 끝난다.
 *
 * 키 집합은 `constants/mainCategories.ts`의 CATEGORY_GROUPS 값 집합과 같아야 한다(테스트로 검증).
 */
import type { IconType } from 'react-icons';
import {
  SiNextdotjs,
  SiNestjs,
  SiSpring,
  SiMariadb,
  SiMongodb,
  SiDocker,
  SiJsonwebtokens,
} from 'react-icons/si';
import { TbBrandNextjs, TbDatabase, TbBinaryTree, TbBinaryTree2, TbSql } from 'react-icons/tb';
import { MdSecurity } from 'react-icons/md';
import { RiCodeBoxLine, RiShieldKeyholeLine } from 'react-icons/ri';
import { FaDocker } from 'react-icons/fa';

export const POST_THEME_KEYS = [
  'nextjs',
  'nestjs',
  'spring',
  'mariadb',
  'mongodb',
  'docker',
  'jwt',
  'algorithm',
  'database-theory',
] as const;

export type PostThemeKey = (typeof POST_THEME_KEYS)[number];

export interface PostLayoutTheme {
  /** 가장 바깥 배경 클래스 */
  baseClass: string;
  /** 반복 패턴(배경 이미지 CSS 값 그대로) */
  pattern?: { image: string; size: string; position?: string; opacityClass?: string };
  /** 천천히 회전하는 radial gradient 두 장의 색 (hex) */
  spinGradient?: string;
  /** 펄스 글로우 색 (hex) */
  glow?: string;
  /** 배경 영상. overlayClass는 영상 위(또는 overlayAfterVideo=false면 아래)에 깔리는 어둡게 처리 */
  video?: {
    src: string;
    opacityClass: string;
    overlayClass: string;
    overlayAfterVideo?: boolean;
    underlayClass?: string;
    hideInPreview?: boolean;
  };
  /** 영상 없이 어둡게만 */
  overlayOnly?: string;
  borderClass: string;
  headerBorderClass: string;
  iconClass: string;
  titleClass: string;
  contentClass: string;
}

export interface PostCardTheme {
  articleClass: string;
  /** article 안쪽에 절대 배치되는 장식 레이어(스프링) */
  layerClasses?: string[];
  titleClass: string;
  metaClass: string;
  topicClass?: string;
  dividerClass: string;
  dividerOpacity: number;
  descriptionClass: string;
  descriptionIndentClass?: string;
  cursorClass: string;
  thumbnailClass: string;
  imageFitClass: string;
  footerClass: string;
  tagClass: string;
  /** 통계에 아이콘을 붙이는 변형(스프링) */
  statIconColorClass?: string;
  /** 고정 배지(jwt) 또는 renderBadge 없을 때 기본 배지(docker) */
  fixedBadge?: 'security';
  defaultBadge?: 'docker';
}

export interface PostSidebarTheme {
  /** 사이드바 헤더에 표시할 이름. i18n 폴백 키(`<이름>.categories`)와 같아야 한다 */
  name: string;
  /** 아이콘 색(카테고리 색과 다를 수 있다) */
  iconColor: string;
  textColorClasses: string;
  borderClasses: string;
  sidebarContentBgClasses?: string;
  headerBgClasses?: string;
  previewButtonBgClasses?: string;
  categoryTitleClass?: string;
  descriptionTextClass?: string;
  headerHoverTextClass?: string;
  hoverStyles?: string;
  activeLinkStyles?: string;
  logoAnimation?: string;
  backgroundGradientClass?: string;
  iconVariant: 'default' | 'white-circle' | 'gradient-circle' | 'fixed-color' | 'boxed';
  iconGradientClass?: string;
  iconFixedColorClass?: string;
}

export interface PostDetailTheme {
  textClass: string;
  proseClass: string;
  tagClass: string;
  /** 작성자·주제·조회수 행과 태그 표시 여부 */
  showMeta: boolean;
}

export interface PostTheme {
  key: PostThemeKey;
  /** 목록 제목·메뉴 이름 */
  name: string;
  path: string;
  icon: IconType;
  color: string;
  /** 목록 카드 오른쪽 배지 아이콘 */
  badgeIcon: IconType;
  badgeClass: string;
  /** 썸네일 없을 때 */
  fallbackImage: string;
  /** 정렬 select */
  selectClass: string;
  /** 하위 카테고리 글이 없을 때 안내 문구 색 */
  emptyTextClass: string;
  layout: PostLayoutTheme;
  card: PostCardTheme;
  sidebar: PostSidebarTheme;
  detail: PostDetailTheme;
}

// ── 공통 조각 ──────────────────────────────────────────────────────────────

const DARK_PROSE =
  'prose prose-invert max-w-none [&_*]:!text-white [&_a]:!text-blue-300 [&_code]:!text-green-300 [&_em]:!text-white [&_h1]:!text-white [&_h2]:!text-white [&_h3]:!text-white [&_h4]:!text-white [&_h5]:!text-white [&_h6]:!text-white [&_li]:!text-white [&_strong]:!text-white [&_td]:!text-white [&_th]:!bg-gray-700 [&_th]:!text-white';

const DARK_SELECT =
  'w-36 rounded-lg border border-[#333333] bg-black/50 py-2 text-center text-white backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-[#333333]';
const LIGHT_SELECT =
  'w-36 rounded-lg border border-black bg-white py-2 text-center text-gray-800 focus:outline-none focus:ring-1 focus:ring-black';

const DARK_DETAIL: PostDetailTheme = {
  textClass: 'text-white',
  proseClass: DARK_PROSE,
  tagClass: 'bg-[#1a1a1a] text-gray-300',
  showMeta: true,
};
const LIGHT_DETAIL: PostDetailTheme = {
  textClass: 'text-gray-800',
  proseClass: 'prose prose-gray max-w-none',
  tagClass: 'bg-gray-100 text-gray-700',
  showMeta: false,
};

const DARK_CARD: PostCardTheme = {
  articleClass: 'bg-black text-white hover:shadow-lg hover:shadow-blue-400/20',
  titleClass: 'text-white group-hover:text-white',
  metaClass: 'text-gray-400',
  dividerClass: 'via-gray-500',
  dividerOpacity: 0.6,
  descriptionClass: 'text-gray-300',
  cursorClass: 'border-white',
  thumbnailClass: 'h-24 w-24',
  imageFitClass: 'object-cover',
  footerClass: 'text-gray-400',
  tagClass: 'bg-zinc-800 text-gray-300',
};

const LIGHT_CARD: PostCardTheme = {
  articleClass:
    'border border-black bg-white text-gray-800 hover:shadow-lg hover:shadow-gray-200/30',
  titleClass: 'text-gray-900 group-hover:text-gray-700',
  metaClass: 'text-gray-600',
  dividerClass: 'via-black',
  dividerOpacity: 0.8,
  descriptionClass: 'text-gray-700',
  cursorClass: 'border-gray-800',
  thumbnailClass: 'h-24 w-24 border border-black/30',
  imageFitClass: 'object-cover',
  footerClass: 'text-gray-600',
  tagClass: 'bg-gray-100 text-gray-700',
};

const LIGHT_SIDEBAR: Omit<PostSidebarTheme, 'name' | 'iconColor'> = {
  textColorClasses: 'text-gray-700',
  borderClasses: 'border-black',
  sidebarContentBgClasses: 'bg-white',
  headerBgClasses: 'bg-white',
  previewButtonBgClasses: 'bg-white shadow-sm',
  categoryTitleClass: 'text-gray-700',
  descriptionTextClass: 'text-gray-500',
  headerHoverTextClass: 'hover:text-gray-900',
  hoverStyles: 'hover:bg-gray-100',
  activeLinkStyles: 'text-gray-900 bg-gray-100',
  iconVariant: 'boxed',
};

const DIAMOND_PATTERN = {
  image: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 30 L30 55 L5 30 Z' stroke='%23777777' fill='none' stroke-width='1.5'/%3E%3Ccircle cx='30' cy='30' r='3' fill='%23777777'/%3E%3Ccircle cx='15' cy='15' r='2' fill='%23777777'/%3E%3Ccircle cx='45' cy='15' r='2' fill='%23777777'/%3E%3Ccircle cx='15' cy='45' r='2' fill='%23777777'/%3E%3Ccircle cx='45' cy='45' r='2' fill='%23777777'/%3E%3Cpath d='M15 15 L30 30 M45 15 L30 30 M15 45 L30 30 M45 45 L30 30' stroke='%23777777' stroke-width='0.5'/%3E%3C/svg%3E")`,
  size: '80px 80px',
  opacityClass: 'opacity-[0.05]',
};

const LIGHT_LAYOUT = (icon: string): PostLayoutTheme => ({
  baseClass: 'bg-white',
  pattern: DIAMOND_PATTERN,
  borderClass: 'border-black',
  headerBorderClass: 'border-black',
  iconClass: `h-8 w-8 ${icon}`,
  titleClass: 'text-gray-900',
  contentClass: '',
});

// ── 테마 ───────────────────────────────────────────────────────────────────

export const POST_THEMES: Record<PostThemeKey, PostTheme> = {
  nextjs: {
    key: 'nextjs',
    name: 'Next.js',
    path: '/post/view/nextjs',
    icon: SiNextdotjs,
    color: '#000000',
    badgeIcon: TbBrandNextjs,
    badgeClass: 'bg-gray-200 text-gray-700',
    fallbackImage: '/nextjs.webp',
    selectClass: DARK_SELECT,
    emptyTextClass: 'text-white',
    layout: {
      baseClass: 'bg-black',
      pattern: {
        image:
          'radial-gradient(#80808015 1px, transparent 1px), radial-gradient(#80808015 1px, transparent 1px)',
        size: '20px 20px',
        position: '0 0, 10px 10px',
      },
      video: {
        src: '/nextjs_background.webm',
        opacityClass: 'opacity-30',
        overlayClass: 'bg-black/80',
      },
      borderClass: 'border-[#333333]',
      headerBorderClass: 'border-[#333333]',
      iconClass: 'h-8 w-8',
      titleClass: 'text-white',
      contentClass: 'text-white',
    },
    card: DARK_CARD,
    sidebar: {
      name: 'Nextjs',
      iconColor: '#000000',
      textColorClasses: 'text-[#888888]',
      borderClasses: 'border-[#333333]',
      iconVariant: 'white-circle',
    },
    detail: DARK_DETAIL,
  },

  nestjs: {
    key: 'nestjs',
    name: 'Nest.js',
    path: '/post/view/nestjs',
    icon: SiNestjs,
    color: '#E0234E',
    badgeIcon: SiNestjs,
    badgeClass: 'bg-gray-200 text-gray-700',
    fallbackImage: '/nestjs.webp',
    selectClass: DARK_SELECT,
    emptyTextClass: 'text-white',
    layout: {
      baseClass: 'bg-gradient-to-br from-[#3d0415] via-[#2a0110] to-[#1a000a]',
      pattern: {
        image: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 256 255' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMidYMid'%3E%3Cpath d='M160.227 182.262h-33.981l84.183-84.183-15.655-15.657-84.182 84.183v-33.98l99.84-99.84 15.656 15.657-65.86 65.86 65.86 65.86-15.656 15.657-50.215-50.216v36.659Z' fill='%23E0234E'/%3E%3C/svg%3E")`,
        size: '60px 60px',
        opacityClass: 'opacity-[0.04]',
      },
      spinGradient: '#E0234E',
      glow: '#E0234E',
      video: {
        src: '/nestjs_background.webm',
        opacityClass: 'opacity-30',
        overlayClass: 'bg-black/80',
      },
      borderClass: 'border-[#333333]',
      headerBorderClass: 'border-[#333333]',
      iconClass: 'h-8 w-8 text-[#E0234E]',
      titleClass: 'text-white',
      contentClass: '',
    },
    card: {
      ...DARK_CARD,
      articleClass: 'bg-black text-white hover:shadow-lg hover:shadow-red-400/20',
      dividerClass: 'via-[#E0234E]',
      thumbnailClass: 'h-28 w-24',
      imageFitClass: 'object-contain',
      descriptionIndentClass: 'mt-2',
    },
    sidebar: {
      name: 'Nestjs',
      iconColor: '#E0234E',
      textColorClasses: 'text-[#888888]',
      borderClasses: 'border-[#333333]',
      iconVariant: 'default',
    },
    detail: DARK_DETAIL,
  },

  spring: {
    key: 'spring',
    name: 'Spring',
    path: '/post/view/spring',
    icon: SiSpring,
    color: '#6DB33F',
    badgeIcon: SiSpring,
    badgeClass: 'bg-gray-200 text-gray-700',
    fallbackImage: '/spring.webp',
    selectClass: DARK_SELECT,
    emptyTextClass: 'text-white',
    layout: {
      baseClass: 'bg-[#0c1511]',
      pattern: {
        image: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M91.8 28.6C86.9 16.8 77.5 7.4 65.7 2.5 59.9 0.2 53.7-0.5 47.6 0.3 41.5 1.1 35.7 3.4 30.6 7 25.5 10.6 21.3 15.4 18.2 21 15.1 26.6 13.3 32.8 12.9 39.2 12.5 45.6 13.6 52 16.1 57.9 18.6 63.8 22.3 69.1 27 73.4 31.7 77.7 37.2 81 43.2 83.1 49.2 85.2 55.6 86 62 85.6 68.4 85.2 74.6 83.4 80.2 80.3 85.8 77.2 90.6 73 94.2 67.9 97.8 62.8 100.1 57 100.9 50.9 101.7 44.8 101 38.6 98.7 32.8 93.8 21 84.4 11.6 72.6 6.7L91.8 28.6Z' fill='%236DB33F'/%3E%3C/svg%3E")`,
        size: '60px 60px',
        opacityClass: 'opacity-[0.03]',
      },
      spinGradient: '#6DB33F',
      video: {
        src: '/spring_background.webm',
        opacityClass: 'opacity-30',
        overlayClass: 'bg-black/70',
        overlayAfterVideo: true,
        underlayClass: 'bg-[#0c1511]',
      },
      borderClass: 'border-slate-700/30',
      headerBorderClass: 'border-slate-700/40',
      iconClass: 'h-8 w-8 text-[#6DB33F]',
      titleClass: 'text-white',
      contentClass: 'text-white',
    },
    card: {
      articleClass:
        'border border-slate-700/40 bg-[#0c1511] text-white hover:shadow-lg hover:shadow-[#6DB33F]/10',
      layerClasses: [
        'bg-gradient-to-b from-[#101b13] to-[#0a100d]',
        'bg-gradient-to-r from-[#6DB33F]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-20',
      ],
      titleClass: 'text-white transition-colors duration-300 group-hover:text-[#9DE67E]/80',
      metaClass: 'text-gray-300',
      topicClass: 'text-[#9DE67E]/60',
      dividerClass: 'via-[#6DB33F]/30',
      dividerOpacity: 0.6,
      descriptionClass: 'text-gray-200',
      descriptionIndentClass: 'mt-2',
      cursorClass: 'border-white',
      thumbnailClass: 'h-24 w-24 border border-slate-700/60',
      imageFitClass: 'object-contain',
      footerClass: 'text-gray-300',
      tagClass: 'border border-slate-700/40 bg-slate-800/70 text-gray-300',
      statIconColorClass: 'text-[#6DB33F]/60',
    },
    sidebar: {
      name: 'Spring',
      iconColor: '#6DB33F',
      textColorClasses: 'text-gray-300',
      borderClasses: 'border-slate-700/40',
      sidebarContentBgClasses: 'bg-[#0c1511]',
      headerBgClasses: 'backdrop-blur-sm',
      previewButtonBgClasses: 'bg-[#0c1511] backdrop-blur-sm',
      categoryTitleClass: 'text-gray-400',
      descriptionTextClass: 'text-gray-500',
      headerHoverTextClass: 'hover:text-[#9DE67E]/80',
      hoverStyles: 'hover:bg-slate-800/40',
      activeLinkStyles: 'text-white bg-slate-800/50',
      logoAnimation: 'transition-transform duration-300 group-hover:scale-105',
      backgroundGradientClass: 'bg-gradient-to-b from-[#2f3b22] to-[#0a100d]',
      iconVariant: 'default',
    },
    detail: DARK_DETAIL,
  },

  mariadb: {
    key: 'mariadb',
    name: 'MariaDB',
    path: '/post/view/mariadb',
    icon: SiMariadb,
    color: '#003545',
    badgeIcon: SiMariadb,
    badgeClass: 'bg-gray-200 text-gray-700',
    fallbackImage: '/mariadb.webp',
    selectClass: DARK_SELECT,
    emptyTextClass: 'text-white',
    layout: {
      baseClass: 'bg-gradient-to-b from-[#1A2024] to-[#212A2E]',
      pattern: {
        image: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%2300A1CB' stroke-width='1.5'%3E%3Ccircle cx='15' cy='15' r='6' /%3E%3Ccircle cx='65' cy='15' r='6' /%3E%3Ccircle cx='15' cy='65' r='6' /%3E%3Ccircle cx='65' cy='65' r='6' /%3E%3Cpath d='M22 15 L58 15' stroke-dasharray='3,3' /%3E%3Cpath d='M15 22 L15 58' stroke-dasharray='3,3' /%3E%3Cpath d='M22 65 L58 65' stroke-dasharray='3,3' /%3E%3Cpath d='M65 22 L65 58' stroke-dasharray='3,3' /%3E%3Crect x='35' y='35' width='10' height='10' stroke='%2300A1CB' fill='%2300A1CB' fill-opacity='0.2' /%3E%3C/g%3E%3C/svg%3E")`,
        size: '80px 80px',
        opacityClass: 'opacity-[0.15]',
      },
      video: {
        src: '/mariadb_background.webm',
        opacityClass: 'opacity-30',
        overlayClass: 'bg-black/80',
      },
      borderClass: 'border-slate-700/30',
      headerBorderClass: 'border-slate-700/40',
      iconClass: 'h-8 w-8 text-[#003545]',
      titleClass: 'text-white',
      contentClass: '',
    },
    card: {
      articleClass:
        'bg-gradient-to-br from-[#1A2024] to-[#2A3034] text-white hover:shadow-lg hover:shadow-[#2A3034]/20',
      titleClass: 'text-white group-hover:text-[#A7B6BD]',
      metaClass: 'text-[#7A868D]',
      dividerClass: 'via-[#616364]',
      dividerOpacity: 0.6,
      descriptionClass: 'text-[#ECEFF4]',
      cursorClass: 'border-[#A7B6BD]',
      thumbnailClass: 'h-24 w-24',
      imageFitClass: 'object-cover',
      footerClass: 'text-[#7A868D]',
      tagClass: 'bg-[#1A2024] text-[#A7B6BD]',
    },
    sidebar: {
      name: 'MariaDB',
      iconColor: '#2A3034',
      textColorClasses: 'text-[#A7B6BD]',
      borderClasses: 'border-[#3A4044]/30',
      sidebarContentBgClasses: 'bg-gradient-to-br from-[#1A2024] to-[#2A3034]',
      headerBgClasses: 'backdrop-blur-sm bg-[#1A2024]/70',
      previewButtonBgClasses: 'bg-[#1A2024]/70 backdrop-blur-sm',
      categoryTitleClass: 'text-[#8FA7AF]',
      descriptionTextClass: 'text-[#7A868D]',
      headerHoverTextClass: 'hover:text-white',
      hoverStyles: 'hover:bg-white/10',
      activeLinkStyles: 'text-white bg-white/10',
      logoAnimation: 'transition-transform duration-300 group-hover:scale-110',
      iconVariant: 'gradient-circle',
      iconGradientClass: 'bg-gradient-to-br from-[#3A4044] to-[#1A2024]',
    },
    detail: DARK_DETAIL,
  },

  mongodb: {
    key: 'mongodb',
    name: 'MongoDB',
    path: '/post/view/mongodb',
    icon: SiMongodb,
    color: '#47A248',
    badgeIcon: SiMongodb,
    badgeClass: 'bg-gray-200 text-gray-700',
    fallbackImage: '/mongodb.webp',
    selectClass: DARK_SELECT,
    emptyTextClass: 'text-white',
    layout: {
      baseClass: 'bg-gradient-to-b from-[#ba8448] to-[#8b5e2f]',
      pattern: {
        image: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M15.9.087l.854 1.604c.192.296.4.558.645.802.715.715 1.394 1.464 2.004 2.266 1.447 1.9 2.423 4.01 3.12 6.292.418 1.394.645 2.824.662 4.27.07 4.323-1.412 8.035-4.4 11.12-.488.488-1.01.94-1.57 1.342-.296 0-.436-.227-.558-.436-.227-.383-.366-.802-.436-1.222-.174-.978-.314-1.974-.314-2.968 0-.314.07-.628.027-.94-.09-.706-.44-1.318-.98-1.82-.82-.766-1.9-.98-2.934-.57-.52.2-1.02.436-1.494.7-.315.174-.54.383-.834.366-.37-.006-.62-.296-.796-.575-.81-1.322-1.02-2.7-1.004-4.142.012-.94.314-1.796.664-2.645.836-2.022 2.08-3.784 3.743-5.18C12.46 6.782 13.67 6.15 15.065 6.15c.313 0 .627.727.94.122z' fill='%23f0d8a8'/%3E%3C/svg%3E")`,
        size: '60px 60px',
        opacityClass: 'opacity-[0.15]',
      },
      video: {
        src: '/mongodb_background.webm',
        opacityClass: 'opacity-75',
        overlayClass: 'bg-black/70',
        hideInPreview: true,
      },
      borderClass: 'border-[#A67C52]/30',
      headerBorderClass: 'border-[#A67C52]/30',
      iconClass: 'h-8 w-8 text-[#C19A6B]',
      titleClass: 'text-white',
      contentClass: '',
    },
    card: {
      articleClass:
        'border border-[#A67C52]/20 bg-gradient-to-br from-[#2c1d12] to-[#3a2617] text-white hover:shadow-lg hover:shadow-[#8B6226]/30',
      titleClass: 'text-white group-hover:text-[#E6C8A0]',
      metaClass: 'text-[#D2B48C]',
      dividerClass: 'via-[#C19A6B]',
      dividerOpacity: 0.8,
      descriptionClass: 'text-[#F5DEB3]',
      cursorClass: 'border-white',
      thumbnailClass: 'h-24 w-24 border border-[#A67C52]/30',
      imageFitClass: 'object-cover',
      footerClass: 'text-[#D2B48C]',
      tagClass: 'border border-[#A67C52]/30 bg-[#3a2617] text-[#E6C8A0]',
    },
    sidebar: {
      name: 'MongoDB',
      iconColor: '#C19A6B',
      textColorClasses: 'text-[#F5DEB3]',
      borderClasses: 'border-[#C19A6B]/30',
      sidebarContentBgClasses: 'bg-gradient-to-br from-[#2c1d12] to-[#3a2617]',
      headerBgClasses: 'backdrop-blur-sm bg-[#3a2617]/80',
      previewButtonBgClasses: 'bg-[#3a2617]/80 backdrop-blur-sm',
      categoryTitleClass: 'text-[#E6C8A0]',
      descriptionTextClass: 'text-[#D2B48C]',
      headerHoverTextClass: 'hover:text-[#F5DEB3]',
      hoverStyles: 'hover:bg-[#C19A6B]/20',
      activeLinkStyles: 'text-white bg-[#C19A6B]/30',
      logoAnimation: 'transition-transform duration-300 group-hover:scale-110',
      iconVariant: 'gradient-circle',
      iconGradientClass: 'bg-gradient-to-br from-[#3a2617] to-[#2c1d12]',
    },
    detail: {
      ...DARK_DETAIL,
      proseClass: `rounded-lg bg-[rgba(72,48,29,0.5)] p-6 text-[#f6d6c0] ${DARK_PROSE}`,
    },
  },

  docker: {
    key: 'docker',
    name: 'Docker',
    path: '/post/view/docker',
    icon: SiDocker,
    color: '#2496ED',
    badgeIcon: FaDocker,
    badgeClass: 'bg-gray-200 text-gray-700',
    fallbackImage: '/docker.webp',
    selectClass: DARK_SELECT,
    emptyTextClass: 'text-white',
    layout: {
      baseClass: 'bg-[#0d1117]',
      pattern: {
        image: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cpath d='M15,30h25v25h-25z M45,30h25v25h-25z M75,30h25v25h-25z M15,60h25v25h-25z M45,60h25v25h-25z M75,60h25v25h-25z' fill='%232496ED'/%3E%3C/svg%3E")`,
        size: '120px 120px',
        opacityClass: 'opacity-[0.03]',
      },
      spinGradient: '#2496ED',
      video: {
        src: '/docker_background.webm',
        opacityClass: 'opacity-60',
        overlayClass: '',
        underlayClass: 'bg-[#0d1117]',
      },
      borderClass: 'border-slate-700/30',
      headerBorderClass: 'border-slate-700/40',
      iconClass: 'h-8 w-8 text-[#2496ED]',
      titleClass: 'text-white',
      contentClass: '',
    },
    card: {
      ...DARK_CARD,
      articleClass: 'bg-[#0f1b2b] text-white hover:shadow-lg hover:shadow-[#2496ed]/30',
      dividerClass: 'via-[#2496ed]',
      defaultBadge: 'docker',
    },
    sidebar: {
      name: 'Docker',
      iconColor: '#2496ED',
      textColorClasses: 'text-gray-300',
      borderClasses: 'border-slate-700/40',
      sidebarContentBgClasses: 'bg-[#0d1117]',
      headerBgClasses: 'backdrop-blur-sm',
      previewButtonBgClasses: 'bg-[#0d1117] backdrop-blur-sm',
      categoryTitleClass: 'text-gray-400',
      descriptionTextClass: 'text-gray-500',
      headerHoverTextClass: 'hover:text-[#2496ED]/80',
      hoverStyles: 'hover:bg-slate-800/40',
      activeLinkStyles: 'text-white bg-slate-800/50',
      logoAnimation: 'transition-transform duration-300 group-hover:scale-105',
      backgroundGradientClass: 'bg-gradient-to-b from-[#121920] to-[#0a1017]',
      iconVariant: 'default',
    },
    detail: DARK_DETAIL,
  },

  jwt: {
    key: 'jwt',
    name: 'JWT',
    path: '/post/view/jwt',
    icon: RiShieldKeyholeLine,
    color: '#00B4CC',
    badgeIcon: SiJsonwebtokens,
    badgeClass: 'bg-gray-200 text-gray-700',
    fallbackImage: '/jwt.webp',
    selectClass: DARK_SELECT,
    emptyTextClass: 'text-white',
    layout: {
      baseClass: 'bg-black',
      pattern: {
        image: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='100' viewBox='0 0 300 100'%3E%3Ctext x='10' y='30' font-family='monospace' font-size='12' fill='%23FF3333'%3Eeyj0eXAiOiJKV1QiLCJhbG%3C/text%3E%3Ctext x='10' y='50' font-family='monospace' font-size='12' fill='%23FF3333'%3EnVzZXJuYW1lIjoiSm9obiIsImF%3C/text%3E%3Ctext x='10' y='70' font-family='monospace' font-size='12' fill='%23FF3333'%3ENuRXkwMHFPOUZPcmNsZk40RiI%3C/text%3E%3Cline x1='0' y1='35' x2='300' y2='35' stroke='%23FF3333' stroke-width='0.5' stroke-dasharray='2,2' /%3E%3Cline x1='0' y1='65' x2='300' y2='65' stroke='%23FF3333' stroke-width='0.5' stroke-dasharray='2,2' /%3E%3Ctext x='260' y='25' font-family='monospace' font-size='8' fill='%231E4D2B'%3Eheader%3C/text%3E%3Ctext x='260' y='55' font-family='monospace' font-size='8' fill='%231E4D2B'%3Epayload%3C/text%3E%3Ctext x='260' y='85' font-family='monospace' font-size='8' fill='%231E4D2B'%3Esignature%3C/text%3E%3C/svg%3E")`,
        size: '300px 100px',
        opacityClass: 'opacity-[0.07]',
      },
      overlayOnly: 'bg-black/80',
      borderClass: 'border-[#FF3333]/20',
      headerBorderClass: 'border-[#FF3333]/20',
      iconClass: 'h-8 w-8 text-[#1E4D2B]',
      titleClass: 'text-white',
      contentClass: 'text-white',
    },
    card: {
      ...DARK_CARD,
      articleClass:
        'border border-[#FF3333]/20 bg-[#0a0a0a] text-white hover:border-[#1E4D2B] hover:shadow-lg hover:shadow-[#1E4D2B]/30',
      dividerClass: 'via-[#1E4D2B]',
      tagClass: 'border border-[#FF3333]/20 bg-[#1E4D2B]/10 text-gray-300',
      fixedBadge: 'security',
    },
    sidebar: {
      name: 'JWT',
      iconColor: '#1E4D2B',
      textColorClasses: 'text-[#A0AEC0]',
      borderClasses: 'border-[#FF3333]/20',
      sidebarContentBgClasses: 'bg-[#0A0A0A]',
      headerBgClasses: 'bg-[#1A1A1A] border-b border-[#FF3333]/20',
      previewButtonBgClasses: 'bg-[#1A1A1A] border border-[#FF3333]/20',
      categoryTitleClass: 'text-[#1E4D2B]',
      descriptionTextClass: 'text-[#718096]',
      headerHoverTextClass: 'hover:text-[#1E4D2B]',
      hoverStyles: 'hover:bg-[#1A1A1A] hover:border-[#1E4D2B] hover:text-[#1E4D2B]',
      activeLinkStyles: 'text-[#1E4D2B] bg-[#1A1A1A] border-[#1E4D2B]',
      logoAnimation: 'transition-transform duration-300 group-hover:scale-110',
      iconVariant: 'fixed-color',
      iconFixedColorClass: 'text-[#1E4D2B]',
    },
    detail: {
      textClass: 'text-[#A0AEC0]',
      proseClass:
        'prose prose-headings:text-[#A0AEC0] prose-p:text-[#A0AEC0] prose-strong:text-[#A0AEC0] prose-code:text-[#A0AEC0] prose-ul:text-[#A0AEC0] prose-ol:text-[#A0AEC0] prose-blockquote:text-[#A0AEC0] prose-a:text-[#1E4D2B] max-w-none rounded-lg border border-[#FF3333]/20 bg-[#0A0A0A] p-6 [&_*]:!text-[#A0AEC0] [&_a]:!text-blue-300 [&_code]:!text-green-300 [&_em]:!text-[#A0AEC0] [&_h1]:!text-[#A0AEC0] [&_h2]:!text-[#A0AEC0] [&_h3]:!text-[#A0AEC0] [&_h4]:!text-[#A0AEC0] [&_h5]:!text-[#A0AEC0] [&_h6]:!text-[#A0AEC0] [&_li]:!text-[#A0AEC0] [&_strong]:!text-[#A0AEC0] [&_td]:!text-[#A0AEC0] [&_th]:!bg-gray-700 [&_th]:!text-[#A0AEC0]',
      tagClass: 'border border-[#FF3333]/20 bg-[#0A0A0A] text-[#A0AEC0]',
      showMeta: true,
    },
  },

  algorithm: {
    key: 'algorithm',
    name: 'Algorithm',
    path: '/post/view/algorithm',
    icon: TbBinaryTree2,
    color: '#4CAF50',
    badgeIcon: TbBinaryTree,
    badgeClass: 'bg-gray-200 text-gray-700',
    fallbackImage: '/algorithm.webp',
    selectClass: LIGHT_SELECT,
    emptyTextClass: 'text-gray-800',
    layout: LIGHT_LAYOUT('text-gray-700'),
    card: LIGHT_CARD,
    sidebar: { name: 'Algorithm', iconColor: '#6B7280', ...LIGHT_SIDEBAR },
    detail: LIGHT_DETAIL,
  },

  'database-theory': {
    key: 'database-theory',
    name: 'Database Theory',
    path: '/post/view/database-theory',
    icon: TbDatabase,
    color: '#2563EB',
    badgeIcon: TbSql,
    badgeClass: 'bg-gray-200 text-gray-700',
    fallbackImage: '/algorithm.webp',
    selectClass: LIGHT_SELECT,
    emptyTextClass: 'text-gray-800',
    layout: LIGHT_LAYOUT('text-gray-700'),
    card: LIGHT_CARD,
    sidebar: { name: 'DatabaseTheory', iconColor: '#2563EB', ...LIGHT_SIDEBAR },
    detail: LIGHT_DETAIL,
  },
};

/** 알고리즘 레이아웃은 RiCodeBoxLine, DB 이론은 TbDatabase 아이콘을 헤더에 쓴다(메뉴 아이콘과 다름) */
export const POST_LAYOUT_ICON_OVERRIDES: Partial<Record<PostThemeKey, IconType>> = {
  algorithm: RiCodeBoxLine,
  jwt: MdSecurity,
};

export function isPostThemeKey(value: string): value is PostThemeKey {
  return (POST_THEME_KEYS as readonly string[]).includes(value);
}

export function getPostTheme(key: string): PostTheme | null {
  return isPostThemeKey(key) ? POST_THEMES[key] : null;
}

/** 홈 사이드바·헤더 메뉴용 그룹. 라우트가 있는 카테고리만 들어간다 */
export const POST_THEME_GROUPS: Record<string, PostThemeKey[]> = {
  Frontend: ['nextjs'],
  Backend: ['nestjs', 'spring'],
  Database: ['database-theory', 'mariadb', 'mongodb'],
  IT: ['docker', 'jwt'],
  Etc: ['algorithm'],
};
