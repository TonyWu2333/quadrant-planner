import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type QuadrantId = 'do' | 'plan' | 'delegate' | 'drop';

export type Quadrant = {
  id: QuadrantId;
  title: string;
  action: string;
  description: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  color: string;
};

export const QUADRANTS: Quadrant[] = [
  {
    id: 'do',
    title: '重要且紧急',
    action: '立即做',
    description: '有明确期限、不做会有后果的事',
    icon: 'flame',
    color: '#E5484D',
  },
  {
    id: 'plan',
    title: '重要不紧急',
    action: '计划做',
    description: '长期价值最高，给它们留出固定时间',
    icon: 'calendar-clear',
    color: '#5B5BD6',
  },
  {
    id: 'delegate',
    title: '紧急不重要',
    action: '交给别人',
    description: '别人也能做好的事，尽量委派或批量处理',
    icon: 'people',
    color: '#E38A00',
  },
  {
    id: 'drop',
    title: '不重要不紧急',
    action: '少做或不做',
    description: '消耗时间的事，留到真正空闲的时候',
    icon: 'cafe',
    color: '#7C8592',
  },
];

export const quadrantById = (id: QuadrantId) => QUADRANTS.find((q) => q.id === id)!;
