import Prism from 'prismjs';
import { FC, useEffect } from 'react';

export interface HighlightLanguageProps {
  code?: string;
  language?: string;
}

const HighlightLanguage: FC<HighlightLanguageProps> = ({ code, language, ...props }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <div {...props}>
      <pre className="max-h-[500px] min-h-[300px] overflow-y-auto rounded-md">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
};
export default HighlightLanguage;
