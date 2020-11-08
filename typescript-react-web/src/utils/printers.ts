import pdfMake from 'pdfmake/build/pdfmake';

import Model from '../models/model';
import * as literal from '../templates/literal';

pdfMake.fonts = {
  GenShinGothic: {
    normal: 'GenShinGothic-Monospace-Medium.ttf',
    bold: 'GenShinGothic-Monospace-Medium.ttf',
    italics: 'GenShinGothic-Monospace-Medium.ttf',
    bolditalics: 'GenShinGothic-Monospace-Medium.ttf',
  },
};

function print(model: Model, articles: string[]) {
  const content = [];
  content.push({ text: '離婚協議書', style: 'title' });
  content.push(articles.join('\n\n'));

  content.push({ text: '(' + model.hasband.abbrev + ')', style: 'abbrev' });
  content.push({ text: '住所', style: 'sign' });
  content.push({ text: '(印)', style: 'seal' });
  content.push({ text: '氏名', style: 'sign' });

  content.push({ text: '(' + model.wife.abbrev + ')', style: 'abbrev' });
  content.push({ text: '住所', style: 'sign' });
  content.push({ text: '(印)', style: 'seal' });
  content.push({ text: '氏名', style: 'sign' });

  const pdf = pdfMake.createPdf({
    content,
    styles: {
      title: {
        fontSize: 14,
        margin: [0, 20],
        alignment: 'center',
      },
      seal: {
        margin: [240, 0, 0, 0],
        lineHeight: 0,
      },
      abbrev: {
        lineHeight: 0,
        margin: [0, 20, 0, 0],
      },
      sign: {
        margin: [40, 0, 0, 0],
      },
    },
    defaultStyle: {
      font: 'GenShinGothic',
      fontSize: 12,
      lineHeight: 1.2,
      margin: [0, 20, 0, 0],
    },
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [80, 40, 80, 40],
    info: {
      title: '離婚協議書',
    },
  });
  pdf.open();
}

export function printWithLiteral(model: Model) {
  const articles = literal.getArticles(model);
  if (articles) {
    print(model, articles);
  }
}
