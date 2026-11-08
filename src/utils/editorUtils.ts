/**
 * Utilidades para editores de código en el navegador.
 * Soporta indentación con tecla Tab (4 espacios) y Shift+Tab (desindentación).
 */

export function handleTabIndent(e: KeyboardEvent, getValue: () => string, setValue: (val: string) => void) {
  if (e.key !== 'Tab') return;
  e.preventDefault();

  const target = e.target as HTMLTextAreaElement;
  const start = target.selectionStart;
  const end = target.selectionEnd;
  const val = getValue();

  if (e.shiftKey) {
    // Shift+Tab: desindentar línea actual o selección
    const lineStart = val.lastIndexOf('\n', start - 1) + 1;
    if (val.startsWith('    ', lineStart)) {
      const newVal = val.substring(0, lineStart) + val.substring(lineStart + 4);
      setValue(newVal);
      target.value = newVal;
      const newCursor = Math.max(lineStart, start - 4);
      target.selectionStart = target.selectionEnd = newCursor;
    } else if (val.startsWith('  ', lineStart)) {
      const newVal = val.substring(0, lineStart) + val.substring(lineStart + 2);
      setValue(newVal);
      target.value = newVal;
      const newCursor = Math.max(lineStart, start - 2);
      target.selectionStart = target.selectionEnd = newCursor;
    }
  } else {
    // Tab: insertar 4 espacios en la posición del cursor
    const spaces = '    ';
    const newVal = val.substring(0, start) + spaces + val.substring(end);
    setValue(newVal);
    target.value = newVal;
    target.selectionStart = target.selectionEnd = start + spaces.length;
  }
}

