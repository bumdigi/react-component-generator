import { useState } from 'react';
import type { GeneratedComponent } from '../types';
import { LivePreview } from './LivePreview';
import { CodeView } from './CodeView';
import { VIEWPORT_WIDTHS, VIEWPORT_LABELS, type Viewport } from './viewport';

interface ComponentCardProps {
  component: GeneratedComponent;
  onRemove: (id: string) => void;
  onRegenerate: (prompt: string) => void;
  isLoading: boolean;
}

type Tab = 'preview' | 'code';

export function ComponentCard({ component, onRemove, onRegenerate, isLoading }: ComponentCardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('preview');
  const [previewKey, setPreviewKey] = useState(0);
  const [viewport, setViewport] = useState<Viewport>('desktop');

  return (
    <div className="component-card">
      <div className="card-header">
        <p className="card-prompt">{component.prompt}</p>
        <div className="card-actions">
          <button
            className="btn-refresh"
            onClick={() => setPreviewKey((k) => k + 1)}
            title="미리보기 새로고침"
          >
            ↻
          </button>
          <button
            className="btn-regenerate"
            onClick={() => onRegenerate(component.prompt)}
            disabled={isLoading}
          >
            {isLoading ? '생성 중...' : '재생성'}
          </button>
          <button
            className="btn-remove"
            onClick={() => onRemove(component.id)}
          >
            삭제
          </button>
        </div>
      </div>
      <div className="card-tabs">
        <button
          className={`tab ${activeTab === 'preview' ? 'tab--active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          미리보기
        </button>
        <button
          className={`tab ${activeTab === 'code' ? 'tab--active' : ''}`}
          onClick={() => setActiveTab('code')}
        >
          코드
        </button>
      </div>
      {activeTab === 'preview' && (
        <div className="viewport-toolbar">
          {(Object.keys(VIEWPORT_WIDTHS) as Viewport[]).map((vp) => (
            <button
              key={vp}
              className={`btn-viewport ${viewport === vp ? 'btn-viewport--active' : ''}`}
              onClick={() => setViewport(vp)}
              title={`${VIEWPORT_WIDTHS[vp]}px`}
            >
              {VIEWPORT_LABELS[vp]}
            </button>
          ))}
        </div>
      )}
      <div className="card-content">
        {activeTab === 'preview' ? (
          <LivePreview key={previewKey} code={component.code} viewportWidth={VIEWPORT_WIDTHS[viewport]} />
        ) : (
          <CodeView code={component.code} />
        )}
      </div>
    </div>
  );
}
