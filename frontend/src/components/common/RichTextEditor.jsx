import { useRef } from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  Code,
} from 'lucide-react';
import { classNames } from '../../utils/helpers';

const RichTextEditor = ({ value, onChange, placeholder, error }) => {
  const textareaRef = useRef(null);

  const wrapSelection = (prefix, suffix = prefix) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);

    const newText = beforeText + prefix + selectedText + suffix + afterText;
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const toolbarButtons = [
    { icon: Bold, action: () => wrapSelection('**'), label: 'Bold' },
    { icon: Italic, action: () => wrapSelection('*'), label: 'Italic' },
    { icon: Quote, action: () => wrapSelection('> ', '\n'), label: 'Quote' },
    { icon: Code, action: () => wrapSelection('`'), label: 'Code' },
    { icon: List, action: () => wrapSelection('- ', '\n'), label: 'Bullet List' },
    { icon: ListOrdered, action: () => wrapSelection('1. ', '\n'), label: 'Numbered List' },
    { icon: LinkIcon, action: () => wrapSelection('[', '](url)'), label: 'Link' },
  ];

  return (
    <div
      className={classNames(
        'border rounded-md overflow-hidden',
        error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center space-x-1 p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
        {toolbarButtons.map((button, index) => {
          const Icon = button.icon;
          return (
            <button
              key={index}
              type="button"
              onClick={button.action}
              title={button.label}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={12}
        className="w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none resize-none"
      />
    </div>
  );
};

export default RichTextEditor;
