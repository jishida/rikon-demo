# 文書に関わる変数の定義

## 夫と妻を表す文字列の定義
夫を表す文字列を'hasband'、妻を表す文字列を'wife'と定義しその2つの文字列を表すデータ型をcoupleとする。

## 略称を格納する配列
配列の要素である文字列をデータ型abbrevとする。
```javascript
var abbrevs = [
  '甲',
  '乙',
  '丙',
  '丁',
  '戌',
  '己',
  '庚',
  '辛',
  '壬',
  '癸',
];
```

## 各変数
下記の表に準ずる。
表の項目の意味は以下の通り。

- KEYWORD: 変数名やHTML ElementのIDとして用いる識別名。
- INPUT: trueなら入力を必要とする。falseなら入力不要で求められる。
- DESCRIPTION: 日本語の説明。
- DATA TYPE: データ型。stringは文字列。intは整数。booleanは真偽値。dateは日付。monthは年+月。objectはハッシュマップ型。coupleは上述の通り「hasband」または「wife」。abbrevは上述の通り「甲」「乙」など。
- REQUIREMENT: 必須か否か。requiredは必須。optionalはオプション。required if ~は条件付で必須。
- LIMIT: 変数の制限。
- MISC: その他の補足。

| KEYWORD                     | INPUT | DESCRIPTION          | DATA TYPE | REQUIREMENT                         | LIMIT            | MISC                      |
|-----------------------------|-------|----------------------|-----------|-------------------------------------|------------------|---------------------------|
| hasbandName                 | true  | 夫名前               | string    | required                            | non empty        |                           |
| wifeName                    | true  | 妻名前               | string    | required                            | non empty        |                           |
| children                    | false | 子供リスト           | array     | required                            | length: 0~abbrs.length-2 |                   |
| children[i]                 | true  | 子供オブジェクト     | object    | optional                            | i: 0~abbrevs.length-2    |                   |
| children[i].name            | true  | 子供名前             | string    | required                            | non empty        |                           |
| children[i].abbrev          | false | 子供略称             | abbrev    | required if children[i] exists      |                  |                           |
| children[i].relation        | true  | 子供続柄             | string    | required if children[i] exists      | non empty        |                           |
| children[i].birthday        | true  | 子供生年月日         | date      | required if children[i] exists      | past             |                           |
| children[i].supportAmount   | true  | 子供養育費           | int       | optional                            | 0~999999999999   |                           |
| children[i].supportEndMonth | true  | 子供養育費支払終了月 | month     | optional                            | future           |                           |
| parentalAuthorityEnabled    | false | 親権者有無           | boolean   | required                            |                  | children.length > 0       |
| parentalAuthority           | true  | 親権者               | couple    | required if parentalAuthorityEnabled is true |         |                           |
| supportCreditor             | true  | 監護権者             | couple    | required if parentalAuthorityEnabled is true |         |                           |
| supportDebtor               | false | 非監護権者           | couple    | required if parentalAuthorityEnabled is true |         | opponent(supportCreditor) |
| supportEnabled              | false | 養育費有無           | boolean   | required                 | | parentalAuthorityEnabled && supportTotalAmount > 0    |
| supportStartMonth           | true  | 養育費支払開始月     | month     | optional                            | future           |                           |
| supportTotalAmount          | false | 養育費合計           | int       | required if parentalAuthorityEnabled is true |         |                           |
| solatiumEnabled             | true  | 慰謝料有無           | boolean   | required                            |                  |                           |
| solatiumCreditor            | false | 慰謝料債権者         | couple    | required if solatiumEnabled is true |                  | opponent(solatiumDebtor)  |
| solatiumDebtor              | true  | 慰謝料債務者         | couple    | required if solatiumEnabled is true |                  |                           |
| solatiumAmount              | true  | 慰謝料               | int       | required if solatiumEnabled is true | 1~999999999999   |                           |
| solatiumCount               | true  | 慰謝料支払回数       | int       | required if solatiumEnabled is true | 1~999            |                           |
| solatiumStartMonth          | true  | 慰謝料支払開始月     | month     | optional                            | future           |                           |
| solatiumEndMonth            | false | 慰謝料支払終了月     | month     | required if solatiumEnabled is true |                  |                           |
| solatiumTotalAmount         | false | 慰謝料合計           | int       | required if solatiumEnabled is true |                  |                           |
| divisionEnabled             | true  | 財産分与有無         | boolean   | required                            |                  |                           |
| divisionCreditor            | false | 財産分与債権者       | couple    | required if divisionEnabled is true |                  | opponent(divisionDebtor)  |
| divisionDebtor              | true  | 財産分与債務者       | couple    | required if divisionEnabled is true |                  |                           |
| divisionAmount              | true  | 財産分与金額         | int       | required if divisionEnabled is true | 1~999999999999   |                           |
| divisionPaymentDate         | true  | 財産分与支払日       | date      | optional                            | future           |                           |
| creationDate                | true  | 離婚協議書作成日     | date      | required                            | future           |                           |
| submitter                   | true  | 離婚届提出者         | couple    | required                            |                  |                           |
| submissionDate              | true  | 離婚届提出日         | date      | required                            | future           |                           |
| submissionDestination       | true  | 離婚届提出先         | string    | required                            | non empty        |                           |
| notarizedDoc                | true  | 公正証書             | boolean   | required                            |                  |                           |
| meetingEnabled              | true  | 面接交渉権有無       | boolean   | required                            |                  |                           |
| meetingLimit                | true  | 面接制限             | string    | required if meetingEnabled is true  | non empty        |                           |
| negotiationLimit            | true  | 面接交渉条件         | string    | required if meetingEnabled is true  | non empty        |                           |

## 主なユーザー定義関数

### opponent(couple) -> couple
引数が'hasband'の場合'wife'を、引数が'wife'の場合'hasband'を返す。

### abbr(couple) -> abbrev
引数で与えられたcoupleに対応するabbrevを返す。

### formatMonth(month) -> string
引数で与えたれたmonthを文書に表示する形式の文字列に変換する。

### formatDate(date) -> string
引数で与えたれたdateを文書に表示する形式の文字列に変換する。

### formatAmount(int) -> string
引数で与えたれたintを文書に表示する形式の文字列(漢数字)に変換する。

### formatJoin(string[]) -> string
引数で与えられたstring配列を"、"で結合するが最後の結合のみ"、及び"で結合する。
(例)
```javascript
// 最後にだけ"及び"が付く。
console.log(formatJoin(["AAA", "BBB", "CCC"])); // "AAA、BBB、及びCCC"

// 結合文字列がすべて同じで良ければ
// javascriptの標準組込メソッドjoinを使えばよい。
console.log(["AAA", "BBB", "CCC"].join("、")); // "AAA、BBB、CCC"
```
