import { ReactNode } from 'react';
import '@styles/tooltip.scss';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  return (
    <div className={`tooltip tooltip--${position}`}>
      <div className="tooltip__trigger">{children}</div>
      <div className="tooltip__content" role="tooltip">
        {content}
      </div>
    </div>
  );
}
