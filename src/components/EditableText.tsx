import { useLayoutEffect, useRef, type CSSProperties, type ElementType, type FormEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  as?: ElementType;
  className?: string;
  value?: string;
  editable?: boolean;
  multiline?: boolean;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  style?: CSSProperties;
}

const normalizeEditableText = (value: string) => value.replace(/\u00a0/g, " ");

const EditableText = ({
  as: Component = "p",
  className,
  value = "",
  editable = false,
  multiline = true,
  placeholder,
  onValueChange,
  style,
}: EditableTextProps) => {
  const editableElementRef = useRef<HTMLElement | null>(null);
  const displayValue = value || (editable ? placeholder ?? "" : "");

  useLayoutEffect(() => {
    if (!editable) return;

    const element = editableElementRef.current;
    if (!element) return;

    if ((element.textContent ?? "") !== displayValue) {
      element.textContent = displayValue;
    }
  }, [displayValue, editable]);

  return (
    <Component
      ref={
        editable
          ? ((node: HTMLElement | null) => {
              editableElementRef.current = node;
            })
          : undefined
      }
      className={cn(
        className,
        editable && "rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      )}
      style={style}
      contentEditable={editable}
      suppressContentEditableWarning={editable}
      spellCheck={editable}
      onInput={(event: FormEvent<HTMLElement>) => {
        if (!editable || !onValueChange) return;
        onValueChange(normalizeEditableText(event.currentTarget.textContent ?? ""));
      }}
      onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
        if (!editable || multiline) return;
        if (event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        }
      }}
    >
      {!editable ? displayValue : null}
    </Component>
  );
};

export default EditableText;
