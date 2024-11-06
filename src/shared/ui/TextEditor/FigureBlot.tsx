import Quill from 'quill';
import * as Parchment from 'parchment';

const BlockEmbed = Quill.import(
  'blots/block/embed'
) as typeof Parchment.EmbedBlot;

class FigureBlot extends BlockEmbed {
  static blotName = 'figure';
  static tagName = 'figure';

  static create(value: {
    src: string;
    alt: string;
    sourceUrl?: string;
    sourceName?: string;
    width: number;
    height: number;
  }): HTMLElement {
    const node = super.create() as HTMLElement;
    const img = document.createElement('img');

    img.setAttribute('src', value.src);
    img.setAttribute('alt', value.alt);
    img.setAttribute('width', value?.width.toString() || '800');
    img.setAttribute('height', value?.height.toString() || '600');

    const figcaption = document.createElement('figcaption');

    if (value.sourceName && value.sourceUrl) {
      figcaption.innerHTML = `<span></span><div><a target="_blank" rel="noreferrer" href="${value.sourceUrl}">${value.sourceName}</a></div>      `;
    } else if (value.sourceName !== '') {
      figcaption.innerHTML = `<p>${value.alt}</p><div data-source="true">${value.sourceName}</div>`;
    } else {
      figcaption.innerHTML = `<p>${value.alt}</p>`;
    }

    node.setAttribute('data-alt', value.alt);

    node.appendChild(img);
    node.appendChild(figcaption);

    return node;
  }

  static value(node: HTMLElement) {
    const img = node.querySelector('img');
    const figcaption = node.querySelector('figcaption');

    const link = figcaption?.querySelector('a');
    const div = figcaption?.querySelector('div');

    return {
      src: img?.getAttribute('src') || '',
      alt: img?.getAttribute('alt') || '',
      width: img?.getAttribute('width') || '',
      height: img?.getAttribute('height') || '',
      sourceUrl: link?.getAttribute('href') || '',
      sourceName: link?.textContent || div?.textContent || '',
    };
  }
}

Quill.register(FigureBlot);

export { FigureBlot };
