export interface WorkBadge {
  label: string;
  variant?: 'primary' | 'secondary';
}

export interface WorkDetail {
  id: number;
  title: string;
  src: string;
  summary: string;
  period: string;
  role: string;
  scope: string;
  categories: string[];
  techStack: string[];
  responsibilities: string[];
  highlights: string[];
}
