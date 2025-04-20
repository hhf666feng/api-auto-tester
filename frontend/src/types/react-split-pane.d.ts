declare module 'react-split-pane' {
  import * as React from 'react';

  interface Props {
    allowResize?: boolean;
    children?: React.ReactNode;
    className?: string;
    primary?: 'first' | 'second';
    minSize?: number | string;
    maxSize?: number | string;
    defaultSize?: number | string;
    size?: number | string;
    split?: 'vertical' | 'horizontal';
    onDragStarted?: () => void;
    onDragFinished?: (newSize: number) => void;
    onChange?: (newSize: number) => void;
    onResizerClick?: (event: MouseEvent) => void;
    onResizerDoubleClick?: (event: MouseEvent) => void;
    style?: React.CSSProperties;
    resizerStyle?: React.CSSProperties;
    paneStyle?: React.CSSProperties;
    pane1Style?: React.CSSProperties;
    pane2Style?: React.CSSProperties;
    resizerClassName?: string;
    step?: number;
  }

  export default class SplitPane extends React.Component<Props> {}
} 