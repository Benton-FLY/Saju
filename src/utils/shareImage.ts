import type { ShareSummary } from '../types/report';
import { serviceCopy } from '../data/serviceCopy';
/** Native Canvas: no DOM cloning, remote assets, or hidden birth data. */
export async function renderShareImage(summary: ShareSummary): Promise<Blob> {
  await document.fonts.load('500 32px "Noto Serif KR Variable"', summary.title);
  await document.fonts.load('400 20px "Noto Sans KR Variable"', summary.phrase);
  await document.fonts.ready;
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1440;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.scale(2, 2);
  const round = (x: number, y: number, w: number, h: number, r: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
  };
  ctx.fillStyle = '#f7f4ec';
  ctx.fillRect(0, 0, 540, 720);
  round(24, 24, 492, 672, 24, '#284e40');
  ctx.strokeStyle = '#788e6e';
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.roundRect(34, 34, 472, 652, 18);
  ctx.stroke();
  const draw = (
    value: string,
    x: number,
    y: number,
    width: number,
    size: number,
    color: string,
    font = 'Noto Sans KR Variable',
    maxLines = 6,
  ) => {
    ctx.fillStyle = color;
    ctx.font = `${font.includes('Serif') ? '500' : '400'} ${size}px "${font}"`;
    ctx.textBaseline = 'top';
    let currentY = y;
    const lines: string[] = [];
    for (const para of value.split('\n')) {
      let line = '';
      for (const ch of [...para]) {
        if (ctx.measureText(line + ch).width > width && line) {
          lines.push(line);
          line = ch;
        } else line += ch;
      }
      lines.push(line);
    }
    lines.slice(0, maxLines).forEach((line, i) => {
      let final = line;
      if (i === maxLines - 1 && lines.length > maxLines) {
        while (ctx.measureText(final + '…').width > width) final = final.slice(0, -1);
        final += '…';
      }
      ctx.fillText(final, x, currentY);
      currentY += size * 1.5;
    });
    return currentY;
  };
  draw(serviceCopy.result.eyebrow, 58, 57, 400, 11, '#c4c9b1');
  draw(
    `${summary.parent.nickname} × ${summary.child.nickname}`,
    58,
    88,
    420,
    16,
    '#efe9d8',
    undefined,
    2,
  );
  const titleEnd = draw(summary.title, 58, 147, 415, 30, '#fbf5df', 'Noto Serif KR Variable', 4);
  const typeY = Math.max(290, titleEnd + 15);
  draw(summary.type, 58, typeY, 400, 12, '#d9bf84');
  const cardY = Math.max(339, typeY + 36);
  round(49, cardY, 442, 116, 14, '#efe5d5');
  draw(serviceCopy.share.war, 69, cardY + 18, 392, 12, '#956344');
  draw(
    summary.trigger || serviceCopy.share.legacyNote,
    69,
    cardY + 46,
    398,
    21,
    '#654632',
    'Noto Serif KR Variable',
    2,
  );
  round(49, cardY + 130, 442, 116, 14, '#e8eddf');
  draw(serviceCopy.share.peace, 69, cardY + 148, 392, 12, '#596d48');
  draw(summary.phrase, 69, cardY + 176, 398, 20, '#344e38', 'Noto Serif KR Variable', 2);
  draw(serviceCopy.name, 58, 635, 400, 16, '#e8debf', 'Noto Serif KR Variable');
  draw('사주를 생활 언어로 옮긴 참고용 요약', 58, 664, 400, 9, '#bac6ae');
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('PNG encoding failed'))),
      'image/png',
    ),
  );
}
