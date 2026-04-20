export type Viewport = 'mobile' | 'tablet' | 'desktop';

export const VIEWPORT_WIDTHS: Record<Viewport, number> = {
  mobile: 375,
  tablet: 768,
  desktop: 1280,
};

export const VIEWPORT_LABELS: Record<Viewport, string> = {
  mobile: '📱 모바일',
  tablet: '📟 태블릿',
  desktop: '🖥 데스크탑',
};
