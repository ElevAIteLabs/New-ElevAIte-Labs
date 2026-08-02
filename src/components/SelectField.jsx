import { useEffect, useId, useRef, useState } from 'react';

/**
 * Custom dropdown replacing a native <select>, so the control matches the
 * rest of the form instead of rendering the OS widget.
 *
 * A hidden input carries the value, so the existing FormData-based submit
 * and its required-field check keep working unchanged.
 *
 * Follows the ARIA listbox pattern: the trigger owns the expanded state,
 * options are reachable by keyboard, and focus returns to the trigger on
 * close so tabbing out lands where the user expects.
 */
const SelectField = ({ id, name, options, placeholder = 'Select one', required = false }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  const listId = useId();

  // Close when focus or a click goes elsewhere on the page.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  // Keep the highlighted option in view when navigating with the keyboard.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  const choose = (option) => {
    setValue(option);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const openList = (startIndex) => {
    setOpen(true);
    setActiveIndex(startIndex);
  };

  const onKeyDown = (e) => {
    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        const current = options.indexOf(value);
        openList(current >= 0 ? current : 0);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % options.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + options.length) % options.length);
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (activeIndex >= 0) choose(options[activeIndex]);
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="select-field" ref={wrapRef}>
      {/* Carries the value into FormData exactly as the native select did. */}
      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        id={id}
        ref={triggerRef}
        className={`select-trigger ${open ? 'open' : ''} ${value ? '' : 'placeholder'}`}
        onClick={() => (open ? setOpen(false) : openList(Math.max(0, options.indexOf(value))))}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-required={required || undefined}
      >
        <span>{value || placeholder}</span>
        <svg className="select-chevron" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul className="select-list" id={listId} role="listbox" ref={listRef} tabIndex={-1}>
          {options.map((option, i) => (
            <li
              key={option}
              role="option"
              aria-selected={option === value}
              className={`select-option ${i === activeIndex ? 'active' : ''} ${option === value ? 'selected' : ''}`}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseDown={(e) => e.preventDefault()} /* keep focus on the trigger */
              onClick={() => choose(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectField;
