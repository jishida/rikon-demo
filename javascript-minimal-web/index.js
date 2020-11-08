// HTMLが読み込まれたときに実行するスクリプト。
(function () {
  "use strict";
  // 年月を表す入力項目に初期値をいれるためDate型を文字列に変換する関数。
  function toMonthString(d) {
    var y = d.getFullYear().toString(10);
    var m = d.getMonth() + 1;
    return y.toString(10) + (m < 10 ? "-0" : "-") + m.toString(10);
  }
  // 日付を表す入力項目に初期値をいれるためDate型を文字列に変換する関数。
  function toDateString(d) {
    var s = toMonthString(d);
    var d = d.getDate();
    return s + (d < 10 ? "-0" : "-") + d.toString(10);
  }
  // 現在の日時を表すDate型を取得。
  var today = new Date();
  // 離婚期限提出日を入力するエレメントを取得し現在の日付を設定する。
  var picker = document.getElementById("submission_date");
  picker.value = toDateString(today);
  // 作成日を入力するエレメントを取得し現在の日付を設定する。
  picker = document.getElementById("creation_date");
  picker.value = toDateString(today);
  // 養育費支払い開始月を入力するエレメントを取得し現在の年月を設定する。
  picker = document.getElementById("support_start_month");
  picker.value = toMonthString(today);
  // 慰謝料支払い開始月を入力するエレメントを取得し現在の年月を設定する。
  picker = document.getElementById("solatium_start_month");
  picker.value = toMonthString(today);
  // 財産分与支払い開始月を入力するエレメントを取得し現在の日付を設定する。
  picker = document.getElementById("division_payment_date");
  picker.value = toDateString(today);

  // padmake のフォント設定。
  pdfMake.fonts = {
    GenShinGothic: {
      normal: "GenShinGothic-Monospace-Medium.ttf",
      bold: "GenShinGothic-Monospace-Medium.ttf",
      italics: "GenShinGothic-Monospace-Medium.ttf",
      bolditalics: "GenShinGothic-Monospace-Medium.ttf"
    }
  };
})();

// 入力フォームから値を取り出し、内容に沿ってPDFファイルを作成する関数。
function createDoc() {
  "use strict;";
  var articleNum = 0;
  var abbrevs = ["甲", "乙", "丙", "丁", "戌", "己", "庚", "辛", "壬", "癸"];
  // "第○条"といった文字列を返す関数。呼び出すごとに第○条の数字が増えていく。
  function article() {
    return "第" + ++articleNum + "条";
  }
  // 引数に"hasband"が与えられたら"wife"を、"wife"が与えられたら"hasband"を返す関数。
  function opponent(couple) {
    return couple === "hasband"
      ? "wife"
      : couple === "wife"
      ? "hasband"
      : void 0;
  }
  // 引数に"hasband"または"wife"という文字列が与えられたら対応する"甲"や"乙"といった略称を返す関数。
  function abbr(couple) {
    return couple === "hasband"
      ? abbrevs[0]
      : couple === "wife"
      ? abbrevs[1]
      : void 0;
  }
  // Date型の年月から文書に表示するために整えられた文字列を取得する関数。
  function formatMonth(month) {
    var s = month.getFullYear().toString(10) + "年";
    s += (month.getMonth() + 1).toString(10) + "月";
    return s;
  }
  // Date型の日付から文書に表示するために整えられた文字列を取得する関数。
  function formatDate(date) {
    var s = formatMonth(date);
    s += date.getDate().toString(10) + "日";
    return s;
  }
  // number型の自然数から文書に表示するために整えられた文字列(漢数字)を取得する関数。
  function formatAmount(n) {
    if (n > 999999999999999 || n < 1) {
      throw new RangeError("formatAmount: 1 ~ 999999999999999の範囲外です。");
    }
    var nums = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    var smallUnits = ["", "十", "百", "千"];
    var largeUnits = ["", "万", "億", "兆"];
    var i = 0;
    var r = "";
    var buf = "";
    for (; ; i++) {
      var t = Math.floor(n / 10);
      var d = n - t * 10;
      var s = i % 4;
      if (s === 0 && buf) {
        r = buf + largeUnits[Math.floor(i / 4) - 1] + r;
        buf = "";
      }
      if (d !== 0) {
        buf = smallUnits[s] + buf;
        if (d !== 1 || s === 0) {
          buf = nums[d] + buf;
        }
      }
      if (t === 0) {
        break;
      } else {
        n = t;
      }
    }
    if (buf) {
      r = buf + largeUnits[Math.floor(i / 4)] + r;
    }
    return r;
  }
  // 文字列の配列["〇〇", "△△", "××"]から"〇〇、△△、及び××"という文字列を生成する関数。
  function formatJoin(strs) {
    var text = "";
    for (var i = 0; i < strs.length; i++) {
      if (i !== 0) {
        if (i === strs.length - 1) {
          text += "、及び";
        } else {
          text += "、";
        }
      }
      text += strs[i];
    }
    return text;
  }
  // document.getElementById() の関数名が長いので関数名を短くしたラッパー関数。
  function elem(id) {
    return document.getElementById(id);
  }
  // Internet Explorerかどうか判定する関数。
  function isInternetExplorer() {
    return window.navigator.userAgent.indexOf("Trident/") > 0;
  }
  // 文字列sが空文字列ならエラーを投げるパース(解析)関数。
  // nameに項目名を入れるとエラーメッセージに項目名が入る。
  function parseNonEmpty(s, name) {
    if (!s) {
      throw new Error(name + ": 必須項目です。");
    }
    return s;
  }
  // 文字列sが年月を表す文字列(YYYY-MM)ならDate型の年月を返し
  // それ以外ならエラーを投げるパース関数。
  // nameに項目名を入れるとエラーメッセージに項目名が入る。
  function parseMonth(s, name) {
    if (!/^\d{4}-\d{2}$/.test(s)) {
      throw new Error(name ? name + ": 必須項目です。" : "");
    }
    var y = s.substr(0, 4);
    var m = s.substr(5, 2);
    return new Date(y, m - 1, 1);
  }
  // 文字列sが日付を表す文字列(YYYY-MM-DD)ならDate型の日付を返し
  // それ以外ならエラーを投げるパース関数。
  // nameに項目名を入れるとエラーメッセージに項目名が入る。
  function parseDate(s, name) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      throw new Error(name ? name + ": 必須項目です。" : "");
    }
    var y = s.substr(0, 4);
    var m = s.substr(5, 2);
    var d = s.substr(8, 2);
    return new Date(y, m - 1, d);
  }
  // 文字列sが自然数ならnumber型の自然数を返し
  // それ以外ならエラーを投げるパース関数。
  // nameに項目名を入れるとエラーメッセージに項目名が入る。
  // min, maxに最小値、最大値を与えることで範囲指定ができる。
  function parseUint(s, name, min, max) {
    if (!/^(0|[1-9][0-9, ]*)$/.test(s)) {
      throw new Error(
        name + ': "' + s + '"は不正です。正の整数でなければなりません。'
      );
    }
    s = s.replace(/[, ]/g, "");
    var n = parseInt(s, 10);
    min = typeof min === "number" ? min : 0;
    max = typeof max === "number" ? max : 999999999999;
    if (n < min || n > max) {
      throw new RangeError(
        name +
          ': "' +
          s +
          '"は不正です。' +
          min +
          "~" +
          max +
          "の範囲の整数でなければいけません。"
      );
    }
    return n;
  }
  // 入力フォームの値を読み込んで仕様に沿ったオブジェクトに整える関数。
  // 誤った値があればエラーを投げる。
  function parseParameters() {
    // Date型の年月に月数を表す整数deltaを加算する関数。
    function addMonth(month, delta) {
      var d = new Date(month.getFullYear(), month.getMonth(), 1);
      d.setMonth(d.getMonth() + delta);
      return d;
    }
    // 2つのDate型の年月の差を月数を表す整数で返す関数。
    function getMonthDelta(month1, month2) {
      var m1 = month1.getMonth() + month1.getFullYear() * 12;
      var m2 = month2.getMonth() + month2.getFullYear() * 12;
      return m1 - m2;
    }
    // 現在の日時からDate型の現在の年月と現在の日付を取得する。
    var now = new Date();
    var currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    var currentDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    // 関数の最終的な返り値となるオブジェクトを作成する。
    var p = { children: [] };
    // 夫の名前を読み込みオブジェクトに設定する。
    p.hasbandName = parseNonEmpty(elem("hasband_name").value, "[夫] 名前");
    // 妻の名前を読み込みオブジェクトに設定する。
    p.wifeName = parseNonEmpty(elem("wife_name").value, "[妻] 名前");
    // 8個ある子供の入力フォームをforループで処理する。
    for (var i = 1; i <= 8; i++) {
      // 子供に関するエレメントIDの接頭辞を決定する。
      var childId = "child" + i;
      // 子供の名前を取得する。
      var name = elem(childId + "_name").value;
      // 子供の名前が空ならスキップ次の子供へ進む。
      if (!name) {
        continue;
      }
      // 子供を表すオブジェクトを作成する。
      var child = {
        name: name,
        // 配列 abbrevs から略称を取得し子供オブジェクトに設定する。
        abbrev: abbrevs[2 + p.children.length],
        // 子供の続柄を読み込み子供オブジェクトに設定する。
        relation: parseNonEmpty(
          elem(childId + "_relation").value,
          "[子" + i + "] 続柄"
        ),
        // 子供の誕生日を読み込み子供オブジェクトに設定する。
        birthday: parseDate(
          elem(childId + "_birthday").value,
          "[子" + i + "] 生年月日"
        )
      };
      // 子供の養育費を読み込み子供オブジェクトに設定する。
      var amount = elem(childId + "_support_amount").value;
      if (amount === "") {
        // 養育費が空欄なら0を子供オブジェクトに設定する。
        child.supportAmount = 0;
      } else {
        child.supportAmount = parseUint(
          elem(childId + "_support_amount").value,
          "[子" + i + "] 養育費"
        );
      }
      // 子供の養育費支払い期限を読み込み子供オブジェクトに設定する。
      try {
        child.supportEndMonth = parseMonth(
          elem(childId + "_support_end_month").value
        );
      } catch (_) {
        // パースに失敗した場合 null を子供オブジェクトに設定する。
        child.supportEndMonth = null;
      }
      // 最終的に返すオブジェクトのchildren配列に子供オブジェクトを追加する。
      p.children.push(child);
    }
    // 親権者が有効であるかを判定してオブジェクトに設定する。
    // 子供の数が1人以上の場合有効、それ以外の場合無効。
    p.parentalAuthorityEnabled = p.children.length > 0;
    // 親権者が有効である場合場合実行する処理。
    if (p.parentalAuthorityEnabled) {
      // 親権者を読み取りオブジェクトに設定する。
      p.parentalAuthority = elem("parental_authority").value;
      // 監護権者を読み取りオブジェクトに設定する。
      p.supportCreditor = elem("support_creditor").value;
      // 非監護権者をオブジェクトに設定する。
      p.supportDebtor = opponent(p.supportCreditor);
      // 養育費支払い開始年月を読み取りオブジェクトに設定する。
      try {
        p.supportStartMonth = parseMonth(elem("support_start_month").value);
      } catch (_) {
        // 読み取りに失敗したら現在の年月をオブジェクトに設定する。
        p.supportStartMonth = currentMonth;
      }
      // 養育費の合計を計算しオブジェクトに設定する。
      p.supportTotalAmount = p.children
        .map(function (child) {
          var endMonth =
            child.supportEndMonth ||
            new Date(
              child.birthday.getFullYear() + 20,
              child.birthday.getMonth(),
              1
            );
          var count = getMonthDelta(endMonth, p.supportStartMonth) + 1;
          if (count < 1) {
            throw new Error(
              "子供(" +
                child.name +
                ")の養育費支払い終了月が支払い開始月よりも早い日付になっています。"
            );
          }
          return child.supportAmount * count;
        })
        .reduce(function (acc, cur) {
          return acc + cur;
        });
      // 養育費の有無を判定してオブジェクトに設定する。
      p.supportEnabled = p.supportTotalAmount > 0;
    }
    // 慰謝料債務者を取得する。
    var debtor = elem("solatium_debtor").value;
    // 慰謝料債務者が空白なら慰謝料は無効、空白でないなら有効としてオブジェクトに設定する。
    p.solatiumEnabled = debtor !== "";
    // 慰謝料が有効である場合実行する処理。
    if (p.solatiumEnabled) {
      // 慰謝料債権者をオブジェクトに設定する。
      p.solatiumCreditor = opponent(debtor);
      // 慰謝料債務者をオブジェクトに設定する。
      p.solatiumDebtor = debtor;
      // 慰謝料を読み込みオブジェクトに設定する。
      p.solatiumAmount = parseUint(elem("solatium_amount").value, "慰謝料", 1);
      // 慰謝料支払い回数を読み込みオブジェクトに設定する。
      p.solatiumCount = parseUint(
        elem("solatium_count").value,
        "慰謝料支払い回数",
        1,
        999
      );
      // 慰謝料支払い開始月を読み込みオブジェクトに設定する。
      try {
        p.solatiumStartMonth = parseMonth(elem("solatium_start_month").value);
      } catch (_) {
        // 読み込みに失敗したら現在の年月をオブジェクトに設定する。
        p.solatiumStartMonth = currentMonth;
      }
      // 慰謝料支払い終了月を計算しオブジェクトに設定する。
      p.solatiumEndMonth = addMonth(p.solatiumStartMonth, p.solatiumCount - 1);
      // 慰謝料合計を計算しオブジェクトに設定する。
      p.solatiumTotalAmount = p.solatiumAmount * p.solatiumCount;
    }

    // 財産分与債務者を取得する。
    debtor = elem("division_debtor").value;
    // 財産分与債務者が空白なら財産分与は無効、空白でないなら有効としてオブジェクトに設定する。
    p.divisionEnabled = debtor !== "";
    // 財産分与が有効である場合実行する処理。
    if (p.divisionEnabled) {
      // 財産分与債権者をオブジェクトに設定する。
      p.divisionCreditor = opponent(debtor);
      // 財産分与債務者をオブジェクトに設定する。
      p.divisionDebtor = debtor;
      // 財産分与金額を読み取りオブジェクトに設定する。
      p.divisionAmount = parseUint(
        elem("division_amount").value,
        "財産分与金額",
        1
      );
      // 財産分与支払い日を読み取りオブジェクトに設定する。
      try {
        p.divisionPaymentDate = parseDate(elem("division_payment_date").value);
      } catch (_) {
        // 読み込みに失敗したら現在の日付をオブジェクトに設定する。
        p.divisionPaymentDate = currentDate;
      }
    }

    // 作成日を読み込みオブジェクトに設定する。
    try {
      p.creationDate = parseDate(elem("creation_date").value);
    } catch (_) {
      // 読み込みに失敗したら現在の日付をオブジェクトに設定する。
      p.creationDate = currentDate;
    }
    // 離婚届提出者を読み込みオブジェクトに設定する。
    p.submitter = elem("submitter").value;
    // 離婚届提出日を読み込みオブジェクトに設定する。
    try {
      p.submissionDate = parseDate(elem("submission_date").value);
    } catch (_) {
      // 読み込みに失敗したら現在の日付をオブジェクトに設定する。
      p.submissionDate = currentDate;
    }
    // 離婚届提出先を読み込みオブジェクトに設定する。
    p.submissionDestination = parseNonEmpty(
      elem("submission_destination").value,
      "離婚届提出先"
    );
    // 公正証書のチェックを読み込みオブジェクトに設定する。
    p.notarizedDoc = elem("notarized_doc").checked;
    // 面接制限と面接交渉条件を取得し、親権者が有効(子供の数が1人以上)かつ両方空白でないなら面接交渉権を有効、
    // 親権者が無効(子供がいない)または面接制限と面接交渉条件のどちらか一方が空白なら無効としてオブジェクトに設定する。
    var meetingLimit = elem("meeting_limit").value;
    var negotiationLimit = elem("negotiation_limit").value;
    p.meetingEnabled =
      p.parentalAuthorityEnabled &&
      meetingLimit !== "" &&
      negotiationLimit !== "";
    // 面接交渉権が有効な場合の処理。
    if (p.meetingEnabled) {
      // 面接制限をオブジェクトに設定する。
      p.meetingLimit = meetingLimit;
      // 面接交渉条件をオブジェクトに設定する。
      p.negotiationLimit = negotiationLimit;
    }
    return p;
  }
  try {
    var hasband = "hasband";
    var wife = "wife";
    // 入力フォームを読み込み整えられたオブジェクトを取得する。
    var p = parseParameters();
    // オブジェクトをブラウザのコンソール(F12で開ける)に出力する。
    console.log(p);

    // pdfmake の content パラメータに設定する配列を作る。
    var content = [];

    // 以下、入力フォームから得られたオブジェクトから
    // pdfmake の content パラメータを設定するコード。

    content.push({ text: "離婚協議書", style: "title" });

    content.push({ text: "(離婚の合意)", style: "head" });
    content.push(article());

    var text = "夫 " + p.hasbandName + "(以下、「" + abbr(hasband) + "」)と";
    text += "妻 " + p.wifeName + "(以下、「" + abbr(wife) + "」)は、";
    text += "協議離婚することに合意し、下記の通り離婚協議書を取り交わした。";
    content.push(text);

    content.push({ text: "(離婚届)", style: "head" });
    content.push(article());

    text =
      abbr(p.submitter) +
      "は各自署名捺印した離婚届を" +
      formatDate(p.submissionDate) +
      "までに、";
    text += p.submissionDestination + "に提出するものとする。";
    content.push(text);

    // 親権者が有効(子供の数が1人以上)である場合実行する処理。
    if (p.parentalAuthorityEnabled) {
      content.push({ text: "(親権者及び監護権者)", style: "head" });
      content.push(article());

      text = abbr(hasband) + abbr(wife) + "間に生まれた未成年の子である";
      text += formatJoin(
        p.children.map(function (child) {
          return (
            child.relation +
            " " +
            child.name +
            "(" +
            formatDate(child.birthday) +
            "生、以下「" +
            child.abbrev +
            "」)"
          );
        })
      );
      text += "の親権者を" + abbr(p.parentalAuthority) + "と定める。";
      content.push(text);

      text =
        "2 " +
        abbr(p.supportCreditor) +
        "は" +
        formatJoin(
          p.children.map(function (child) {
            return child.abbrev;
          })
        ) +
        "の監護権者となり、";
      text += "それぞれが成年に達するまで、これを引き取り養育する。";
      content.push(text);
    }

    // 養育費がある(養育費合計が1以上である)場合実行する処理。
    if (p.supportEnabled) {
      content.push({ text: "(養育費)", style: "head" });
      content.push(article());

      text = abbr(p.supportDebtor) + "は" + abbr(p.supportCreditor) + "に対し";
      text += p.children
        .filter(function (child) {
          return child.supportAmount > 0;
        })
        .map(function (child) {
          var t =
            child.abbrev +
            "の養育費として" +
            formatMonth(p.supportStartMonth) +
            "から";
          t += child.supportEndMonth
            ? formatMonth(child.supportEndMonth)
            : child.abbrev + "が成年に達する日の属する月";
          t +=
            "まで、毎月末日限り、金" + formatAmount(child.supportAmount) + "円";
          return t;
        })
        .join("を、");
      text += "の合計金" + formatAmount(p.supportTotalAmount) + "円を";
      text +=
        abbr(p.supportCreditor) +
        "の指定する口座へ振込送金の方法により支払う。";
      content.push(text);

      text = "2 振込み手数料は" + abbr(p.supportDebtor) + "の負担とする。";
      content.push(text);

      text =
        "3 " +
        abbr(hasband) +
        abbr(wife) +
        "は、上記に定めるほか、" +
        formatJoin(
          p.children.map(function (child) {
            return child.abbrev;
          })
        );
      text +=
        "に関し、入学や入院等、特別な費用を要する場合は、互いに誠実に協議して分担額を定める。";
      content.push(text);

      text =
        "4 上記養育費は、物価の変動その他の事情の変更に応じて" +
        abbr(hasband) +
        abbr(wife) +
        "協議のうえ増減できる。";
      content.push(text);
    }

    // 慰謝料が有効である場合実行する処理。
    if (p.solatiumEnabled) {
      content.push({ text: "(慰謝料)", style: "head" });
      content.push(article());

      text =
        abbr(p.solatiumDebtor) +
        "は、" +
        abbr(p.solatiumCreditor) +
        "に対し、慰謝料として";
      text +=
        "金" +
        formatAmount(p.solatiumTotalAmount) +
        "円の支払義務があることを認め、これを";
      if (p.solatiumCount === 1) {
        text += formatMonth(p.solatiumStartMonth) + "末日までに";
      } else {
        text +=
          p.solatiumCount +
          "回に分割して、" +
          formatMonth(p.solatiumStartMonth) +
          "から";
        text +=
          formatMonth(p.solatiumEndMonth) +
          "まで、毎月末日限り金" +
          formatAmount(p.solatiumAmount) +
          "円を";
      }
      text +=
        abbr(p.solatiumCreditor) +
        "の指定する金融機関の預貯金口座に振り込んで支払う。";
      content.push(text);

      text = "2 振込み手数料は" + abbr(p.solatiumDebtor) + "の負担とする。";
      content.push(text);

      text =
        "3 " +
        abbr(p.solatiumDebtor) +
        "について、下記の事由が生じた場合は、" +
        abbr(p.solatiumDebtor) +
        "の通知催促を要さず、";
      text +=
        abbr(p.solatiumDebtor) +
        "は、当然に期限の利益を失い、" +
        abbr(p.solatiumCreditor) +
        "に対して残金を直ちに支払う。";
      content.push(text);

      var i = 0;
      if (p.solatiumCount > 1) {
        text = "(" + ++i + ") 分割金の支払いを1回でも怠ったとき。";
        content.push(text);
      }

      text =
        "(" +
        ++i +
        ") 他の債務につき、強制執行、競売、執行保全処分を受け、或いは公租公課の滞納処分を受けたとき。";
      content.push(text);

      text = "(" + ++i + ") 破産、民事再生手続開始の申立てがあったとき。";
      content.push(text);

      text = "(" + ++i + ") 手形交換所の取引停止処分を受けたとき。";
      content.push(text);

      text =
        "(" +
        ++i +
        ") " +
        abbr(p.solatiumCreditor) +
        "の責めに帰することができない事由によって、所在が不明となったとき。";
      content.push(text);
    }

    // 親権者が有効(子供の数が1人以上)である場合実行する処理。
    if (p.parentalAuthorityEnabled) {
      content.push({ text: "(特別の費用)", style: "head" });
      content.push(article());

      text =
        abbr(p.supportCreditor) +
        "が、病気及び怪我のために" +
        formatJoin(
          p.children.map(function (child) {
            return child.abbrev;
          })
        );
      text +=
        "に特別出費したときは、" +
        abbr(p.supportDebtor) +
        "は" +
        abbr(p.supportCreditor) +
        "の請求により、その費用を直ちに支払うものとする。";
      content.push(text);
    }

    // 財産分与が有効である場合実行する処理。
    if (p.divisionEnabled) {
      content.push({ text: "(財産分与)", style: "head" });
      content.push(article());

      text =
        abbr(p.divisionDebtor) +
        "は" +
        abbr(p.divisionCreditor) +
        "に対し、財産分与として金";
      text +=
        formatAmount(p.divisionAmount) +
        "円を" +
        formatDate(p.divisionPaymentDate) +
        "までに";
      text +=
        abbr(p.divisionCreditor) +
        "の指定する口座へ振込送金の方法により支払う。";
      content.push(text);

      text = "2 振込み手数料は" + abbr(p.divisionDebtor) + "の負担とする。";
      content.push(text);
    }

    // 面接交渉権が有効である場合実行する処理。
    if (p.meetingEnabled) {
      content.push({ text: "(面接交渉権)", style: "head" });
      content.push(article());

      text =
        abbr(p.supportDebtor) +
        "の" +
        formatJoin(
          p.children.map(function (child) {
            return child.abbrev;
          })
        );
      text += "に対する面接交渉については、以下の内容とする。";
      content.push(text);

      text =
        "1 面接は" +
        p.meetingLimit +
        "とし場所は" +
        abbr(hasband) +
        abbr(wife) +
        "協議の上決定する。";
      content.push(text);

      text =
        "2 " + abbr(p.supportCreditor) + "は、" + abbr(p.supportDebtor) + "が";
      text += formatJoin(
        p.children.map(function (child) {
          return child.abbrev;
        })
      );
      text += "と" + p.negotiationLimit + "面接交渉をすることを認める。";
      content.push(text);

      text =
        "3 面接時は事前に" +
        abbr(p.supportDebtor) +
        "は" +
        abbr(p.supportCreditor) +
        "に連絡するものとする。";
      content.push(text);
    }

    content.push({ text: "(通知)", style: "head" });
    content.push(article());

    text =
      abbr(hasband) +
      "及び" +
      abbr(wife) +
      "は、住所、居所、連絡先を変更したときは、遅延なく書面により相手方にこれを通知するものとする。";
    content.push(text);

    content.push({ text: "(裁判管轄)", style: "head" });
    content.push(article());

    text =
      "本契約から発生する一切の紛争の第一審の管轄裁判所を" +
      abbr(p.supportCreditor) +
      "の住所地を管轄する裁判所をもって合意管轄とする。";
    content.push(text);

    content.push({ text: "(清算条項)", style: "head" });
    content.push(article());

    text =
      abbr(hasband) +
      "と" +
      abbr(wife) +
      "は、各条項の外、名義の如何を問わず金銭その他の請求を相互にしないこと、及び";
    text +=
      abbr(hasband) +
      abbr(wife) +
      "以外のものが本件合意内容には一切干渉しないことを相互に確認した。";
    content.push(text);

    // 公正証書が有効である場合実行する処理。
    if (p.notarizedDoc) {
      content.push({ text: "(公正証書)", style: "head" });
      content.push(article());

      text =
        abbr(hasband) +
        "及び" +
        abbr(wife) +
        "は、本合意につき、強制執行認諾約款付公正証書を作成することを承諾した。";
      content.push(text);
    }

    text =
      "上記のとおり合意したので、本書二通作成し、" +
      abbr(hasband) +
      abbr(wife) +
      "各自署名押印の上、各自一通ずつ保有する。";
    content.push({ text: text, style: "head" });
    content.push({ text: formatDate(p.creationDate), style: "head" });

    content.push({ text: "(" + abbr(hasband) + ")", style: "abbrev" });
    content.push({ text: "住所", style: "sign" });
    content.push({ text: "(印)", style: "seal" });
    content.push({ text: "氏名", style: "sign" });

    content.push({ text: "(" + abbr(wife) + ")", style: "abbrev" });
    content.push({ text: "住所", style: "sign" });
    content.push({ text: "(印)", style: "seal" });
    content.push({ text: "氏名", style: "sign" });

    // pdfmake の各種設定。
    var pdf = pdfMake.createPdf({
      content: content,
      pageSize: "A4",
      pageOrientation: "portrait",
      pageMargins: [80, 40, 80, 40],
      info: {
        title: "離婚協議書"
      },
      styles: {
        title: {
          fontSize: 14,
          alignment: "center",
          margin: [0, 20]
        },
        head: {
          margin: [0, 14, 0, 0]
        },
        seal: {
          margin: [240, 0, 0, 0],
          lineHeight: 0
        },
        abbrev: {
          lineHeight: 0,
          margin: [0, 20, 0, 0]
        },
        sign: {
          margin: [40, 0, 0, 0]
        }
      },
      defaultStyle: {
        font: "GenShinGothic",
        fontSize: 12,
        lineHeight: 1.2
      }
    });

    // PDFを作成し開く処理。
    if (isInternetExplorer()) {
      // Internet ExplorerではPDFを開けないのでダウンロードする。
      pdf.download("離婚協議書.pdf");
    } else {
      // Internet Explorer以外ではそのまま開く。
      pdf.open();
    }
  } catch (e) {
    // 途中でエラーが発生したら、処理を中断してアラートメッセージを表示する。
    window.alert(e.message);
  }
}
