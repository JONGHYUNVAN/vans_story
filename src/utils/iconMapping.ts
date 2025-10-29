/**
 * 아이콘 매핑 유틸리티
 * API에서 받은 아이콘 이름을 실제 React 아이콘 컴포넌트로 매핑
 */

import { 
  SiNestjs, 
  SiSpring, 
  SiMariadb, 
  SiMongodb, 
  SiNextdotjs, 
  SiDocker, 
  SiJest, 
  SiCypress, 
  SiGit, 
  SiJunit5 
} from "react-icons/si";
import { TbBinaryTree2, TbDatabase } from "react-icons/tb";
import { RiShieldKeyholeLine } from "react-icons/ri";
import { IconType } from "react-icons";

/**
 * 아이콘 이름과 실제 아이콘 컴포넌트 매핑
 */
export const ICON_MAP: Record<string, IconType> = {
  'SiNextdotjs': SiNextdotjs,
  'SiNestjs': SiNestjs,
  'SiSpring': SiSpring,
  'TbDatabase': TbDatabase,
  'SiMariadb': SiMariadb,
  'SiMongodb': SiMongodb,
  'SiDocker': SiDocker,
  'RiShieldKeyholeLine': RiShieldKeyholeLine,
  'SiJest': SiJest,
  'SiCypress': SiCypress,
  'SiJunit5': SiJunit5,
  'SiGit': SiGit,
  'TbBinaryTree2': TbBinaryTree2,
};

/**
 * 아이콘 이름으로 아이콘 컴포넌트 가져오기
 * 
 * @param iconName - 아이콘 이름
 * @returns 아이콘 컴포넌트 또는 기본 아이콘
 */
export function getIconComponent(iconName: string): IconType {
  return ICON_MAP[iconName] || TbDatabase; // 기본 아이콘
}

