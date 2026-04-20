import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentCard } from './ComponentCard';
import type { GeneratedComponent } from '../types';

vi.mock('./LivePreview', () => ({
  LivePreview: ({ code, viewportWidth }: { code: string; viewportWidth?: number }) => (
    <div data-testid="live-preview" data-viewport-width={viewportWidth} data-code={code} />
  ),
}));

vi.mock('./CodeView', () => ({
  CodeView: ({ code }: { code: string }) => (
    <div data-testid="code-view" data-code={code} />
  ),
}));

const mockComponent: GeneratedComponent = {
  id: 'test-1',
  prompt: '버튼 컴포넌트',
  code: 'render(<button>Hello</button>)',
  createdAt: new Date(),
};

describe('ComponentCard — 반응형 뷰포트 툴바', () => {
  let onRemove: (id: string) => void;
  let onRegenerate: (prompt: string) => void;

  beforeEach(() => {
    onRemove = vi.fn();
    onRegenerate = vi.fn();
  });

  it('미리보기 탭에서 뷰포트 툴바가 보인다', () => {
    render(
      <ComponentCard
        component={mockComponent}
        onRemove={onRemove}
        onRegenerate={onRegenerate}
        isLoading={false}
      />
    );

    expect(screen.getByRole('button', { name: /모바일/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /태블릿/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /데스크탑/i })).toBeInTheDocument();
  });

  it('코드 탭으로 전환하면 뷰포트 툴바가 숨겨진다', async () => {
    const user = userEvent.setup();
    render(
      <ComponentCard
        component={mockComponent}
        onRemove={onRemove}
        onRegenerate={onRegenerate}
        isLoading={false}
      />
    );

    await user.click(screen.getByRole('button', { name: '코드' }));

    expect(screen.queryByRole('button', { name: /모바일/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /태블릿/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /데스크탑/i })).not.toBeInTheDocument();
  });

  it('기본 뷰포트는 데스크탑(1280px)이다', () => {
    render(
      <ComponentCard
        component={mockComponent}
        onRemove={onRemove}
        onRegenerate={onRegenerate}
        isLoading={false}
      />
    );

    const preview = screen.getByTestId('live-preview');
    expect(preview).toHaveAttribute('data-viewport-width', '1280');
  });

  it('모바일 버튼 클릭 시 LivePreview에 375px이 전달된다', async () => {
    const user = userEvent.setup();
    render(
      <ComponentCard
        component={mockComponent}
        onRemove={onRemove}
        onRegenerate={onRegenerate}
        isLoading={false}
      />
    );

    await user.click(screen.getByRole('button', { name: /모바일/i }));

    const preview = screen.getByTestId('live-preview');
    expect(preview).toHaveAttribute('data-viewport-width', '375');
  });

  it('태블릿 버튼 클릭 시 LivePreview에 768px이 전달된다', async () => {
    const user = userEvent.setup();
    render(
      <ComponentCard
        component={mockComponent}
        onRemove={onRemove}
        onRegenerate={onRegenerate}
        isLoading={false}
      />
    );

    await user.click(screen.getByRole('button', { name: /태블릿/i }));

    const preview = screen.getByTestId('live-preview');
    expect(preview).toHaveAttribute('data-viewport-width', '768');
  });

  it('활성 뷰포트 버튼에 btn-viewport--active 클래스가 붙는다', async () => {
    const user = userEvent.setup();
    render(
      <ComponentCard
        component={mockComponent}
        onRemove={onRemove}
        onRegenerate={onRegenerate}
        isLoading={false}
      />
    );

    const mobileBtn = screen.getByRole('button', { name: /모바일/i });
    await user.click(mobileBtn);

    expect(mobileBtn).toHaveClass('btn-viewport--active');
  });
});
