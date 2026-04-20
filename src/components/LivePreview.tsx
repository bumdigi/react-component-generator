import { LiveProvider, LivePreview as ReactLivePreview, LiveError } from 'react-live';

interface LivePreviewProps {
  code: string;
  viewportWidth?: number;
}

export function LivePreview({ code, viewportWidth }: LivePreviewProps) {
  return (
    <div className="preview-panel">
      <div className="panel-header">
        <h3>미리보기</h3>
        {viewportWidth && (
          <span className="viewport-badge">{viewportWidth}px</span>
        )}
      </div>
      <div className="preview-content">
        <LiveProvider code={code} noInline>
          <div
            className="preview-render"
            style={viewportWidth ? { width: viewportWidth, maxWidth: '100%', margin: '0 auto' } : undefined}
          >
            <ReactLivePreview />
          </div>
          <LiveError className="preview-error" />
        </LiveProvider>
      </div>
    </div>
  );
}
