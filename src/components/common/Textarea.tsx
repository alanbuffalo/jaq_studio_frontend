import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, ...props }: TextareaProps) {
  return (
    <label className='block'>
      {label ? <span className='field-label'>{label}</span> : null}
      <textarea className='field-input min-h-[120px] resize-y' {...props} />
    </label>
  );
}

