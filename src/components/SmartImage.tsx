import React, { useEffect, useMemo, useState } from 'react';
import { Globe } from 'lucide-react';
import { getImageCandidates } from '../utils/mediaUtils';

interface SmartImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  compactFallback?: boolean;
  onStatusChange?: (status: 'loading' | 'loaded' | 'error') => void;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  compactFallback = false,
  onStatusChange,
}) => {
  const candidates = useMemo(() => getImageCandidates(src), [src]);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [hasFailed, setHasFailed] = useState(candidates.length === 0);
  const statusCbRef = React.useRef(onStatusChange);
  statusCbRef.current = onStatusChange;

  useEffect(() => {
    setCandidateIndex(0);
    if (candidates.length === 0) {
      setHasFailed(true);
      statusCbRef.current?.('error');
    } else {
      setHasFailed(false);
      statusCbRef.current?.('loading');
    }
  }, [candidates]);

  const activeSrc = candidates[candidateIndex];

  if (hasFailed || !activeSrc) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0b1328] via-[#070d1d] to-[#0c1a38] text-center px-4 select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-cyan-400/30 flex items-center justify-center mb-1.5 shadow-inner">
          <Globe className="w-5 h-5 text-cyan-400" />
        </div>
        {!compactFallback && (
          <span className="text-xs font-semibold text-slate-300 line-clamp-1 max-w-[200px]">
            {fallbackTitle || alt}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={activeSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onLoad={(e) => {
        if (e.currentTarget.naturalWidth === 0) {
          if (candidateIndex + 1 < candidates.length) {
            setCandidateIndex((prev) => prev + 1);
          } else {
            setHasFailed(true);
            onStatusChange?.('error');
          }
          return;
        }
        onStatusChange?.('loaded');
      }}
      onError={() => {
        if (candidateIndex + 1 < candidates.length) {
          setCandidateIndex((prev) => prev + 1);
        } else {
          setHasFailed(true);
          onStatusChange?.('error');
        }
      }}
    />
  );
};
