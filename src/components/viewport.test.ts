import { describe, it, expect } from 'vitest';
import { VIEWPORT_WIDTHS, VIEWPORT_LABELS } from './viewport';

describe('VIEWPORT_WIDTHS', () => {
  it('모바일은 375px', () => {
    expect(VIEWPORT_WIDTHS.mobile).toBe(375);
  });

  it('태블릿은 768px', () => {
    expect(VIEWPORT_WIDTHS.tablet).toBe(768);
  });

  it('데스크탑은 1280px', () => {
    expect(VIEWPORT_WIDTHS.desktop).toBe(1280);
  });
});

describe('VIEWPORT_LABELS', () => {
  it('세 가지 뷰포트 레이블이 모두 정의되어 있다', () => {
    expect(VIEWPORT_LABELS.mobile).toBeDefined();
    expect(VIEWPORT_LABELS.tablet).toBeDefined();
    expect(VIEWPORT_LABELS.desktop).toBeDefined();
  });
});
