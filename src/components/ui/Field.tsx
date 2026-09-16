import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const controlClasses =
  "w-full rounded-sm border border-kemet-black/20 bg-white px-4 py-2.5 text-sm text-kemet-black placeholder:text-kemet-black/40 focus:border-kemet-gold focus:ring-1 focus:ring-kemet-gold";

export function Label({ htmlFor, children, required }: { htmlFor: string; children: ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-kemet-charcoal">
      {children}
      {required && (
        <span className="ml-0.5 text-kemet-red" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

export function ErrorText({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p role="alert" className="mt-1.5 text-sm text-kemet-red">
      {children}
    </p>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${controlClasses} ${props.className ?? ""}`} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${controlClasses} ${props.className ?? ""}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${controlClasses} ${props.className ?? ""}`} />;
}

export function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="mb-5">{children}</div>;
}

export function Checkbox({
  id,
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { id: string; label: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        className="mt-1 h-4 w-4 shrink-0 rounded-sm border-kemet-black/30 text-kemet-gold focus:ring-kemet-gold"
        {...props}
      />
      <label htmlFor={id} className="text-sm leading-relaxed text-kemet-charcoal">
        {label}
      </label>
    </div>
  );
}
