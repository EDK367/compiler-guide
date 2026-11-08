import katex from 'katex';

export function renderLatex(latexString: string, displayMode: boolean = false): string {
  try {
    return katex.renderToString(latexString, {
      displayMode,
      throwOnError: false,
      strict: false
    });
  } catch (err) {
    console.error('KaTeX rendering error:', err);
    return `<span class="text-rose-400 font-mono">${latexString}</span>`;
  }
}
