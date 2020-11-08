import { Model } from '../models';
import { createParameters } from './parameters';
import { hasband, wife } from '../utils/constants';
import {
  formatMonth,
  formatDate,
  formatAmount,
  formatJoin,
} from '../utils/formatters';

export function getArticles(model: Model) {
  const p = createParameters(model);
  if (!p) {
    return;
  }
  let articleNum = 0;
  function article() {
    return `第${++articleNum}条`;
  }
  let num = 0;
  function bullet() {
    return `(${++num})`;
  }
  const { abbr } = model;

  const articles: string[] = [];

  // 離婚の合意
  // prettier-ignore
  articles.push(
`(離婚の合意)
${article()}
夫 ${p.hasbandName}(以下、「${abbr(hasband)
}」)と妻 ${p.wifeName}(以下、「${abbr(wife)
}」)は、協議離婚することに合意し、下記の通り離婚協議書を取り交わした。`
  );

  // 離婚届
  // prettier-ignore
  articles.push(
`(離婚届)
${article()}
${abbr(p.submitter)}は各自署名捺印した離婚届を${formatDate(p.submissionDate)
}までに、${p.submissionDestination}に提出するものとする。`
  );

  // 子供の数が1人以上の場合
  if (p.parentalAuthorityEnabled) {
    // 親権者及び監護権者
    // prettier-ignore
    articles.push(
`(親権者及び監護権者)
${article()}
${abbr(hasband) + abbr(wife)}間に生まれた未成年の子である${
  formatJoin(p.children.map((child) =>
    `${child.relation} ${child.name} (${formatDate(child.birthday)}生、以下「${child.abbrev}」)`
  ))
}の親権者を${abbr(p.parentalAuthority)}と定める。
2 ${abbr(p.supportCreditor)}は${formatJoin(p.children.map((c) => c.abbrev))
}の監護権者となり、それぞれが成年に達するまで、これを引き取り養育する。`
    );
  }

  // 養育費合計が1以上の場合
  // prettier-ignore
  if (p.supportEnabled) {
    articles.push(
`(養育費)
${article()}
${abbr(p.supportDebtor)}は${abbr(p.supportCreditor)}に対し${
  p.children
    .filter((c) => c.supportAmount > 0)
    .map(
      (child) =>
        `${child.abbrev}の養育費として${formatMonth(p.supportStartMonth)}から${
          child.supportEndMonth
            ? formatMonth(child.supportEndMonth)
            : `${child.abbrev}が成年に達する日の属する月`
        }まで、毎月末日限り、金${formatAmount(child.supportAmount)}円`
    )
    .join('を、')
}の合計金${formatAmount(p.supportTotalAmount)}円を${abbr(p.supportCreditor)}の指定する口座へ振込送金の方法により支払う。
2 振込手数料は${abbr(p.supportDebtor)}の負担とする。
3 ${abbr(hasband) + abbr(wife)}は、上記に定めるほか、${formatJoin(p.children.map((c) => c.abbrev))
}に関し、入学や入院等、特別な費用を要する場合は、互いに誠実に協議して分担額を定める。${''
}上記養育費は、物価の変動その他の事情の変更に応じて${abbr(hasband) + abbr(wife)}協議のうえ増減できる。`
      );
  }

  // 慰謝料が有効である場合
  if (p.solatiumEnabled) {
    // 慰謝料
    // prettier-ignore
    articles.push(
`(慰謝料)
${article()}
${abbr(p.solatiumDebtor)}は、${abbr(p.solatiumCreditor)}に対し、慰謝料として金${formatAmount(p.solatiumTotalAmount)
}円の支払義務があることを認め、${
  p.solatiumCount === 1
    ? `${formatMonth(p.solatiumStartMonth)}末日までに`
    : `これを${p.solatiumCount}回に分割して、${formatMonth(p.solatiumStartMonth)}から${formatMonth(p.solatiumEndMonth)
      }まで、毎月末日限り金${formatAmount(p.solatiumAmount)}円を`
}${abbr(p.solatiumCreditor)}の指定する金融機関の預貯金口座に振り込んで支払う。
2 振込手数料は${abbr(p.solatiumDebtor)}の負担とする。
3 ${abbr(p.solatiumDebtor)}について、下記の事由が生じた場合は、${abbr(p.solatiumCreditor)
}の通知催告を要さず、${abbr(p.solatiumDebtor)}は、当然に期限の利益を失い、${abbr(p.solatiumCreditor)
}に対して残金を直ちに支払う。${p.solatiumCount > 1 ? `
${bullet()} 分割金の支払いを1回でも怠ったとき。` : ''}
${bullet()} 他の債務につき、強制執行、競売、執行保全処分を受け、或いは公租公課の滞納処分を受けたとき。
${bullet()} 破産、民事再生手続開始の申立があったとき。
${bullet()} 手形交換所の取引停止処分を受けたとき。
${bullet()} ${abbr(p.solatiumCreditor)}の責めに帰することができない事由によって、所在が不明となったとき。`
    );
  }

  // 子供の数が1以上である場合
  if (p.parentalAuthority) {
    // 特別の費用
    // prettier-ignore
    articles.push(
`(特別の費用)
${article()}
${abbr(p.supportCreditor)}が、病気及び怪我のために${formatJoin(p.children.map((c) => c.abbrev))
}に特別出費したときは、${abbr(p.supportDebtor)}は${abbr(p.supportCreditor)}の請求により、その費用を直ちに支払うものとする。`
    );
  }

  // 財産分与が有効である場合
  if (p.divisionEnabled) {
    // 財産分与
    // prettier-ignore
    articles.push(
`(財産分与)
${article()}
${abbr(p.divisionDebtor)}は${abbr(p.divisionCreditor)}に対し、財産分与として金${formatAmount( p.divisionAmount)
}円を${formatDate(p.divisionPaymentDate)}までに${abbr(p.divisionCreditor)}の指定する口座へ振込送金の方法により支払う。
2 振込手数料は${abbr(p.divisionDebtor)}の負担とする。`
    );
  }

  // 面接交渉権が有効である場合
  if (p.meetingEnabled) {
    // 面接交渉権
    // prettier-ignore
    articles.push(
`(面接交渉権)
${article()}
${abbr(p.supportDebtor)}の${formatJoin(p.children.map((c) => c.abbrev))}に対する面接交渉については、以下の内容とする。
1 ${p.meetingLimit}とし場所は${abbr(hasband) + abbr(wife)}協議の上決定する。
2 ${abbr(p.supportCreditor)}は、${abbr(p.supportDebtor)}が${formatJoin(p.children.map((c) => c.abbrev))
}と${p.negotiationLimit}面接交渉をすることを認める。
3 面接時は事前に${abbr(p.supportDebtor)}は${abbr(p.supportCreditor)}に連絡するものとする。`
    );
  }

  // 通知
  // prettier-ignore
  articles.push(
`(通知)
${article()}
${abbr(hasband)}及び${abbr(wife)}は、住所、居所、連絡先を変更したときは、遅滞なく書面により相手方にこれを通知するものとする。`
  );

  // 裁判管轄
  // prettier-ignore
  articles.push(
`(裁判管轄)
${article()}
本契約から発生する一切の紛争の第一審の管轄裁判所を${abbr(p.supportCreditor)}の住所地を管轄する裁判所をもって合意管轄とする。`
  );

  // 清算条項
  // prettier-ignore
  articles.push(
`(清算条項)
${article()}
${abbr(hasband)}と${abbr(wife)}は、上記の各条項の外、名義の如何を問わず金銭その他の請求を相互にしないこと、${''
}及び${abbr(hasband) + abbr(wife)}以外の者が本件合意内容には一切干渉しないことを相互に確認した。`
  );

  // 公正証書が有効である場合
  if (p.notarizedDoc) {
    // 公正証書
    // prettier-ignore
    articles.push(
`(公正証書)
${article()}
${abbr(hasband)}及び${abbr(wife)}は、本合意につき、強制執行認諾約款付公正証書を作成することを承諾した。`
  );
  }

  // prettier-ignore
  articles.push(
`上記のとおり合意したので、本書二通作成し、${abbr(hasband) + abbr(wife)}各自署名押印の上、各自一通ずつ保有する。`
  );

  // 作成日
  // prettier-ignore
  articles.push(
    formatDate(p.creationDate)
  );

  return articles;
}
