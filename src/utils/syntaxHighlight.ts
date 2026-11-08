/**
 * Utilidades de resaltado sintáctico de alto rendimiento para
 * Ensamblador RISC-V RV32I, Código de Tres Direcciones (C3D) y Código Fuente.
 * 
 * Basado en tokenización léxica directa para garantizar renderizado seguro,
 * rápido y con colores vibrantes acordes a la paleta Obsidian Dark Mode:
 * Cyan (#06b6d4), Morado (#a855f7), Azulito (#38bdf8), Ámbar y Rosa.
 */

const RISCV_OPCODES = new Set([
  'add', 'addi', 'sub', 'mul', 'div', 'rem', 'and', 'andi', 'or', 'ori',
  'xor', 'xori', 'sll', 'srl', 'sra', 'slt', 'slti', 'sltu', 'seqz', 'snez',
  'sgtz', 'sltz', 'beqz', 'bnez', 'beq', 'bne', 'blt', 'bge', 'bltu', 'bgeu',
  'ble', 'blez', 'bgt', 'bgtz', 'j', 'jr', 'jal', 'jalr', 'ret', 'call',
  'tail', 'la', 'li', 'mv', 'not', 'neg', 'nop', 'lw', 'lh', 'lb', 'lbu',
  'lhu', 'sw', 'sh', 'sb', 'fence', 'ecall', 'ebreak'
]);

const RISCV_REGISTERS = new Set([
  'zero', 'ra', 'sp', 'gp', 'tp', 'fp',
  't0', 't1', 't2', 't3', 't4', 't5', 't6',
  's0', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11',
  'a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7',
  'x0', 'x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7', 'x8', 'x9', 'x10',
  'x11', 'x12', 'x13', 'x14', 'x15', 'x16', 'x17', 'x18', 'x19', 'x20',
  'x21', 'x22', 'x23', 'x24', 'x25', 'x26', 'x27', 'x28', 'x29', 'x30', 'x31'
]);

const C3D_KEYWORDS = new Set([
  'if', 'goto', 'call', 'param', 'return'
]);

const GENERIC_KEYWORDS = new Set([
  'int', 'void', 'boolean', 'class', 'public', 'private', 'protected',
  'static', 'return', 'if', 'else', 'while', 'for', 'new', 'this',
  'true', 'false', 'null', 'float', 'double', 'char', 'struct', 'typedef', 'const'
]);

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Resalta una línea individual de ensamblador RISC-V RV32I.
 */
export function highlightRiscvLine(line: string): string {
  let pos = 0;
  let out = '';

  while (pos < line.length) {
    const ch = line[pos];

    // Comentario (# o //)
    if (ch === '#' || (ch === '/' && line[pos + 1] === '/')) {
      const comment = line.slice(pos);
      out += `<span class="text-slate-400 italic">${escapeHtml(comment)}</span>`;
      break;
    }

    // Cadenas literales "..."
    if (ch === '"') {
      let str = ch;
      pos++;
      while (pos < line.length && line[pos] !== '"') {
        str += line[pos++];
      }
      if (pos < line.length) str += line[pos++];
      out += `<span class="text-emerald-300">${escapeHtml(str)}</span>`;
      continue;
    }

    // Espacios en blanco
    if (/\s/.test(ch)) {
      out += ch;
      pos++;
      continue;
    }

    // Directivas del ensamblador (.globl, .text, .data, etc.) o etiquetas con punto (.et1:)
    if (ch === '.' && /[a-zA-Z_]/.test(line[pos + 1] || '')) {
      let word = '';
      while (pos < line.length && /[a-zA-Z0-9_.]/.test(line[pos])) {
        word += line[pos++];
      }
      if (pos < line.length && line[pos] === ':') {
        word += line[pos++];
        out += `<span class="text-amber-400 font-bold">${escapeHtml(word)}</span>`;
      } else if (word === '.globl' || word === '.text' || word === '.data' || word === '.word') {
        out += `<span class="text-purple-400 font-bold">${escapeHtml(word)}</span>`;
      } else {
        out += `<span class="text-amber-300 font-semibold">${escapeHtml(word)}</span>`;
      }
      continue;
    }

    // Identificadores, mnemónicos y registros
    if (/[a-zA-Z_]/.test(ch)) {
      let word = '';
      while (pos < line.length && /[a-zA-Z0-9_]/.test(line[pos])) {
        word += line[pos++];
      }
      // ¿Es etiqueta al inicio o sola?
      if (pos < line.length && line[pos] === ':') {
        word += line[pos++];
        out += `<span class="text-amber-400 font-bold">${escapeHtml(word)}</span>`;
        continue;
      }

      const lower = word.toLowerCase();
      if (RISCV_OPCODES.has(lower)) {
        out += `<span class="text-pink-400 font-bold">${escapeHtml(word)}</span>`;
      } else if (RISCV_REGISTERS.has(lower)) {
        out += `<span class="text-cyan-300 font-semibold">${escapeHtml(word)}</span>`;
      } else {
        out += `<span class="text-sky-200">${escapeHtml(word)}</span>`;
      }
      continue;
    }

    // Números enteros, constantes inmediatas y offsets negativos
    if (/[0-9]/.test(ch) || (ch === '-' && /[0-9]/.test(line[pos + 1] || ''))) {
      let num = line[pos++];
      while (pos < line.length && /[0-9a-fA-FxX]/.test(line[pos])) {
        num += line[pos++];
      }
      out += `<span class="text-amber-300 font-mono">${escapeHtml(num)}</span>`;
      continue;
    }

    // Paréntesis de memoria offset(reg)
    if (ch === '(' || ch === ')') {
      out += `<span class="text-indigo-300 font-bold">${escapeHtml(ch)}</span>`;
      pos++;
      continue;
    }

    // Comas y delimitadores
    if (ch === ',' || ch === ';') {
      out += `<span class="text-slate-500">${escapeHtml(ch)}</span>`;
      pos++;
      continue;
    }

    out += escapeHtml(ch);
    pos++;
  }

  return out;
}

/**
 * Resalta un bloque completo de código RISC-V RV32I.
 */
export function highlightRiscv(code: string): string {
  if (!code) return '';
  return code
    .split('\n')
    .map(line => highlightRiscvLine(line))
    .join('\n');
}

/**
 * Resalta una línea individual de Código de Tres Direcciones (C3D).
 */
export function highlightC3DLine(line: string): string {
  let pos = 0;
  let out = '';

  while (pos < line.length) {
    const ch = line[pos];

    // Comentario // o /* o #
    if ((ch === '/' && line[pos + 1] === '/') || ch === '#') {
      const comment = line.slice(pos);
      out += `<span class="text-slate-400 italic">${escapeHtml(comment)}</span>`;
      break;
    }

    // Cadenas "..."
    if (ch === '"') {
      let str = ch;
      pos++;
      while (pos < line.length && line[pos] !== '"') {
        str += line[pos++];
      }
      if (pos < line.length) str += line[pos++];
      out += `<span class="text-emerald-300">${escapeHtml(str)}</span>`;
      continue;
    }

    // Espacios en blanco
    if (/\s/.test(ch)) {
      out += ch;
      pos++;
      continue;
    }

    // Identificadores, palabras clave y etiquetas
    if (/[a-zA-Z_]/.test(ch)) {
      let word = '';
      while (pos < line.length && /[a-zA-Z0-9_]/.test(line[pos])) {
        word += line[pos++];
      }
      // ¿Es etiqueta? (ej. et1: o L_TRUE: o depositar:)
      if (pos < line.length && line[pos] === ':') {
        word += line[pos++];
        out += `<span class="text-amber-400 font-bold">${escapeHtml(word)}</span>`;
        continue;
      }

      if (C3D_KEYWORDS.has(word)) {
        out += `<span class="text-purple-400 font-bold">${escapeHtml(word)}</span>`;
      } else if (word === 'Heap' || word === 'Stack') {
        out += `<span class="text-emerald-400 font-bold">${escapeHtml(word)}</span>`;
      } else if (word === 'this') {
        out += `<span class="text-emerald-300 font-semibold">${escapeHtml(word)}</span>`;
      } else if (/^t[0-9]+$/.test(word)) {
        out += `<span class="text-cyan-400 font-bold">${escapeHtml(word)}</span>`;
      } else if (/^(et[0-9]+|L_[a-zA-Z0-9_]+)$/.test(word)) {
        out += `<span class="text-amber-300 font-semibold">${escapeHtml(word)}</span>`;
      } else {
        out += `<span class="text-sky-300">${escapeHtml(word)}</span>`;
      }
      continue;
    }

    // Números enteros
    if (/[0-9]/.test(ch)) {
      let num = '';
      while (pos < line.length && /[0-9]/.test(line[pos])) {
        num += line[pos++];
      }
      out += `<span class="text-amber-300 font-mono">${escapeHtml(num)}</span>`;
      continue;
    }

    // Operadores compuestos (>=, <=, ==, !=, &&, ||)
    const twoChars = line.slice(pos, pos + 2);
    if (['>=', '<=', '==', '!=', '&&', '||'].includes(twoChars)) {
      out += `<span class="text-pink-400 font-bold">${escapeHtml(twoChars)}</span>`;
      pos += 2;
      continue;
    }

    // Operadores simples (=, +, -, *, /, %, >, <, !)
    if (['=', '+', '-', '*', '/', '%', '>', '<', '!'].includes(ch)) {
      out += `<span class="text-pink-400 font-bold">${escapeHtml(ch)}</span>`;
      pos++;
      continue;
    }

    // Corchetes y delimitadores
    if (ch === '[' || ch === ']' || ch === '(' || ch === ')') {
      out += `<span class="text-indigo-300 font-bold">${escapeHtml(ch)}</span>`;
      pos++;
      continue;
    }
    if (ch === ',' || ch === ';') {
      out += `<span class="text-slate-500">${escapeHtml(ch)}</span>`;
      pos++;
      continue;
    }

    out += escapeHtml(ch);
    pos++;
  }

  return out;
}

/**
 * Resalta un bloque completo de Código de Tres Direcciones (C3D).
 */
export function highlightC3D(code: string): string {
  if (!code) return '';
  return code
    .split('\n')
    .map(line => highlightC3DLine(line))
    .join('\n');
}

/**
 * Resalta código genérico de lenguajes de alto nivel (Java / C / C++).
 */
export function highlightGeneric(code: string): string {
  if (!code) return '';
  return code.split('\n').map(line => {
    let pos = 0;
    let out = '';
    while (pos < line.length) {
      const ch = line[pos];
      if (ch === '/' && line[pos + 1] === '/') {
        out += `<span class="text-slate-400 italic">${escapeHtml(line.slice(pos))}</span>`;
        break;
      }
      if (ch === '"') {
        let str = ch;
        pos++;
        while (pos < line.length && line[pos] !== '"') str += line[pos++];
        if (pos < line.length) str += line[pos++];
        out += `<span class="text-emerald-300">${escapeHtml(str)}</span>`;
        continue;
      }
      if (/\s/.test(ch)) { out += ch; pos++; continue; }
      if (/[a-zA-Z_]/.test(ch)) {
        let word = '';
        while (pos < line.length && /[a-zA-Z0-9_]/.test(line[pos])) word += line[pos++];
        if (GENERIC_KEYWORDS.has(word)) {
          out += `<span class="text-purple-400 font-bold">${escapeHtml(word)}</span>`;
        } else if (word === 'printf' || word === 'println' || word === 'print' || word === 'System') {
          out += `<span class="text-cyan-300 font-bold">${escapeHtml(word)}</span>`;
        } else {
          out += `<span class="text-sky-200">${escapeHtml(word)}</span>`;
        }
        continue;
      }
      if (/[0-9]/.test(ch)) {
        let num = '';
        while (pos < line.length && /[0-9a-fA-FxX]/.test(line[pos])) num += line[pos++];
        out += `<span class="text-amber-300 font-mono">${escapeHtml(num)}</span>`;
        continue;
      }
      if (['=', '+', '-', '*', '/', '%', '>', '<', '!', '&', '|'].includes(ch)) {
        out += `<span class="text-pink-400 font-bold">${escapeHtml(ch)}</span>`;
        pos++;
        continue;
      }
      out += escapeHtml(ch);
      pos++;
    }
    return out;
  }).join('\n');
}

/**
 * Función universal para resaltar cualquier snippet según su lenguaje.
 */
export function highlightCode(code: string, lang = 'c'): string {
  if (!code) return '';
  const l = (lang || '').toLowerCase().trim();
  if (l === 'riscv' || l === 'assembly' || l === 'asm' || l === 's') {
    return highlightRiscv(code);
  }
  if (l === 'c3d' || l === 'tac' || l === '3ac' || l === 'intermedio') {
    return highlightC3D(code);
  }
  return highlightGeneric(code);
}
