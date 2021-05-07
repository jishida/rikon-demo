# 離婚協議書作成デモの解説

## 1. 前提

このアプリケーションはあくまでデモです。

こういったWEBサイトを作る際、データ通信を少なくするため必要なファイルサイズを小さくするものですが、このデモのファイルサイズ合計は10MB近くあり一般的なウェブサイトよりもかなり大きめになっています。

その理由はウェブブラウザだけでPDFファイルを作成するために必要なpdfmakeというライブラリを用いて日本語を含むPDFファイルを作成する際、pdfmakeを改変して日本語フォントをスクリプトに埋め込む必要があるからです。

多数の漢字を含む日本語フォントは英数字100文字程度の英文フォントに比べて圧倒的にデータサイズが大きく、デフォルトの英文フォントが170KBほどであるのに対し、今回使用した"GenShinGothic-Monospace-Medium"は4839KBもあります。さらにスクリプトに埋め込むためにフォントデータを符号化する必要がありそれによりデータサイズが33%ほど大きくなります。

ですから一般的にはウェブブラウザでPDFを作成をするという処理はせず、数十～数百Bの必要なパラメーターだけサーバーに送り、サーバーで数十KBほどのPDFを作成してウェブブラウザに送り返すという処理をします。

しかし、今回のデモの目的がプログラミング初心者が触れるものということだったため、サーバー側で処理をさせる実装はサーバーサイドの環境構築やアプリケーションの実装など理解に要する範囲が増大すると判断し、一般的に使われることの少ないクライアントサイドで完結する実装を優先しました。

## 2. 仕様の検討

作ってるうちに仕様が変わることはままあることですが、ある程度仕様を見やすい形でまとめておくと仕様変更があっても煩雑になりにくいです。

私が今回のデモを作るにあたって大まかな仕様をまとめたものが[こちら](https://jishida.github.io/rikon-demo/specification)になります。

仕様策定の第一歩として、使用する固有名詞に対応した英語を調べておくと変数名を決定する際に悩みにくいです。大多数のプログラミング言語は変数名をアルファベットで書くことが一般的であるためです。英語よりローマ字読みのほうがわかりやすいならローマ字でも構いません。例を挙げると"債務者"を"debtor"とするか"saimusha"にするかということです。人に見せるものでないなら好きな方でいいと思います。

次に大事なことはデータ型を意識することです。javascriptを使うにあたってstring(文字列型)、number(数値型)、boolean(真偽値型)、Array(配列型)、Object(オブジェクト型)といった基本的なデータ型は押さえておきたいです。

javascriptはブラウザ内での動作を前提とした独特のAPIを持っており、コールバックによる非同期処理やプロトタイプなどわかりにくい仕様の多い言語です。
しかしながら、WEBサイトを作る際に必要な言語であるため利用者層が厚く玉石混淆ではありますが日本語の書籍や記事がありふれているので比較的日本人にとっては始めやすい言語なのかもしれません。
特に[MDN](https://developer.mozilla.org/ja/)には日本語の[チュートリアル](https://developer.mozilla.org/ja/docs/Learn/JavaScript/First_steps)や[リファレンス](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference)が揃っているためわからないことはひとまずこちらで確認して、それでもわからない場合はWeb検索を使うといったやり方がおすすめです。最近はWeb検索で上位に表示されるように工夫された低品質なサイトが検索上位に並ぶこともよくあるのでそういったサイトを覚えておけば無駄な記事を読む時間を節約することができるかもしれません。

## 3. 二種類の実装

今回、javascriptとtypescriptで２種類の実装をしました。

javascript版のデモは[こちら](https://jishida.github.io/rikon-demo/javascript-minimal-web/index.html) ソースコードは[こちら](https://github.com/jishida/rikon-demo/tree/master/javascript-minimal-web)

typescript版のデモは[こちら](https://jishida.github.io/rikon-demo/typescript-react-web/index.html) ソースコードは[こちら](https://github.com/jishida/rikon-demo/tree/master/typescript-react-web)

ソースコードは[github](https://github.com/jishida/rikon-demo)上で見ることができます。
vscodeで見たり書き換えたりブラウザで実際に動作を確認したりする場合は[こちら](https://github.com/jishida/rikon-demo/archive/master.zip)からソースコードをダウンロードしてください。

## 4. javascript版

javascript版の実装はHTML+javascriptで作る最小構成のウェブアプリケーションとなっており、使用している外部ライブラリはPDFを作成する [pdfmake](http://pdfmake.org/#/) のみとなっています。
一応Internet Explorer(以下、IE)でも動作する基本的ですがかなり古い書き方をしています。
IEは開発元のMicrosoftが開発を停止したためjavascriptの新しい機能が使えず最近ではIE非対応のWEBサイトも増えてきています。Windows標準搭載のウェブブラウザでありかつては圧倒的シェアがあったため現在でもわずかに利用者がいるようですが、Windows10ではIEではなくEdgeが標準ブラウザとして採用されているため無理にIEに対応させる必要もないでしょう。

HTMLとjavascriptを知るには [MDN](https://developer.mozilla.org/ja/) が内容が充実していてかつ日本語にも訳されているためおすすめです。

基本的に以下の3つの技術を組み合わせてウェブページは作成されます。リンク先に詳しい解説があるのでそちらを読めば学習できると思います。
- [HTML](https://developer.mozilla.org/ja/docs/Web/HTML): `<div>`のようなマークアップを用いてウェブページのコンテンツを記述します。
- [javascript](https://developer.mozilla.org/ja/docs/Web/JavaScript): ウェブページ上で実行することができるプログラミング言語です。
- [CSS](https://developer.mozilla.org/ja/docs/Web/CSS): HTMLに記述されたコンテンツをどのように表示するかを定義します。見た目の問題なので後回しでいいです。

#### 構成ファイルの説明

javascript版のデモを構成するデータはソースコードの [javascript-minimal-web](https://github.com/jishida/rikon-demo/tree/master/javascript-minimal-web) フォルダにあります。
画面に表示する入力フォームなどは [index.html](https://github.com/jishida/rikon-demo/blob/master/javascript-minimal-web/index.html) に、動作を制御するjavascriptは [index.js](https://github.com/jishida/rikon-demo/blob/master/javascript-minimal-web/index.js) にそれぞれ一つのファイルに収められています。

style.cssはhtmlの各要素のレイアウトや見え方を変更できるスタイルシートです。HTMLの各要素をクラス分けしてCSSを書き換えると見た目をがらりと変えることもできますが、私は詳しくないので適当です。

pdfmake.min.js と vfs_fonts.js はpdfmakeを日本語に対応させたpdfmakeの改造版になります。
pdfmakeは基本的な使い方であれば日本語の解説記事も見つかりますが、細かく調整したいなら英語ですが[公式のドキュメント](https://pdfmake.github.io/docs/0.1/)に詳しい使い方が書かれています。

#### 動作確認

html+javascriptの動作を確認したい場合はchromeやfirefoxなどのブラウザに搭載されている開発者ツールを使うと便利です。

このデモの場合ソースコードをダウンロードして展開した後、 [javascript-minimal-web](https://github.com/jishida/rikon-demo/tree/master/javascript-minimal-web) フォルダ内の [index.html](https://github.com/jishida/rikon-demo/blob/master/javascript-minimal-web/index.html)  をダブルクリックしてブラウザで開きます。画面が表示されたのち、F12キーを押したら開発者ツールが表示され様々な解析ができると思います。おそらく殆どのブラウザでF12キーが開発者ツールに割り当てられてると思います。

#### 文字列の組み立てについて

javascript版では古い環境でも動くように[このように](https://github.com/jishida/rikon-demo/blob/master/javascript-minimal-web/index.js#L457-L489)文字列を一つ一つ+演算子または+=演算子で結合しています。しかし、Internet Explorerを除く現在の主要なブラウザでは[テンプレートリテラル](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Template_literals)という機能がサポートされており、この機能を使ったほうが簡潔に書けます。後述のtypescript版ではこの[テンプレートリテラル](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Template_literals)を用いて[このように](https://github.com/jishida/rikon-demo/blob/master/typescript-react-web/src/templates/literal.ts#L51-L61)実装しており、記述が簡潔で読みやすくなっています。この部分のコードはtypescriptでもjavascriptでも変わらないので(変数名が違うので多少修正が必要ですが)ほとんどそのまま移植できます。

## 5. typescript版

近年のウェブ開発で人気のある[typescript](https://www.typescriptlang.org/)と[react](https://ja.reactjs.org/)を使用して作ったデモです。

typescriptとはjavascriptに変換可能なプログラミング言語です。
そのままではブラウザで実行できないのでブラウザで動作させるにはコーディングした後、typescriptのコンパイラーでコンパイルする必要があります。

この説明だけだと面倒なようですが、typescriptには補って余りある有用な機能がたくさんあります。

typescriptはjavascriptと違い各変数のデータ型を明確にする必要があり、対応したエディタ(vscodeなど)でコーディングすると、javascriptよりも厳格に間違えを指摘してくれたり、強力なコード補完機能を提供してくれたりします。

javascriptやpythonのようなデータ型の扱いが緩い言語を動的型付き言語、typescript、C言語やjavaのようなデータ型を厳格に扱う言語を静的型付き言語と呼びます。静的型付き言語は、(言語とエディタの機能の組み合わせによりますが)コードエディタで書きながら間違えを指摘してもらいやすくコード補完も効く場合が多いです。またデータ型を意識したコーディングを強いられることからも、個人的には初心者がはじめに触れる言語として適していると思います。

しかしながらtypescriptはブラウザでそのまま動かせるjavascriptと比べると少々導入の敷居が高く初心者に環境構築までさせるとなるとまあまあ難易度が高いです。
ですからここでは細かくは解説しません。さらっと概要だけ説明します。

#### typescriptでの開発に必要なもの

typescriptを使った開発ではコマンドラインの作業が発生します。
最低限必要なソフトウェアとして [nodejs](https://nodejs.org/ja/) が必要となります。
nodejsとは、ブラウザというサンドボックス内で限られた機能しか使えなかったjavascriptをPC上でファイル操作からサーバーの構築までなんでもできるようにしたソフトウェアです。
nodejsをインストールするとjsファイルを実行するnodeコマンドと外部パッケージを管理するnpmコマンドが使えるようになります。
これはpythonをインストールしたときに追加されたpythonコマンドとpipコマンドに似ています。
nodejsを利用したウェブ開発ではnpmコマンドを使って開発に必要なツールをインストールすることで開発を有利に進めることができます。

#### デモで使った外部パッケージ

このデモで使った外部パッケージは[こちら](https://github.com/jishida/rikon-demo/blob/master/typescript-react-web/package.json#L17-L37)の設定ファイルから確認できます。
主な外部パッケージは以下のようになります。
- [typescript](https://www.typescriptlang.org/): typescriptをjavascriptにコンパイルします。`tsc`コマンドでコンパイルができます。
- [webpack](https://webpack.js.org/): モジュールバンドラ。複数に分かれたファイルをひとまとめにして最適化してくれます。機能ごとにファイルを分けるモジュール化に必要です。`webpack`コマンドでコードのバンドルができます。似たような機能のパッケージがいくつかありますが機能が豊富なためおそらく最も使われています。反面バンドル処理の時間が決して短くなくコード修正してブラウザで動作確認する作業の効率が悪いというデメリットがあります。処理時間が短いことが売りの`esbuild`というパッケージもあるそうですがまだ使ったことがないため今回はこちらを採用しました。
- [ts-loader](https://github.com/TypeStrong/ts-loader): webpackからtypescriptを呼び出すローダーです。webpackの設定ファイルに[このように](https://github.com/jishida/rikon-demo/blob/master/typescript-react-web/webpack.config.js#L17-L20)ts-loaderの記述を書くだけでwebpackからtypescriptを自動で呼び出してくれます。つまり`webpack`コマンドからtypescriptコンパイラを呼び出すので`tsc`コマンドを使う必要がなくなります。
- [tslint](https://palantir.github.io/tslint/): ~~typescriptのコードチェックをしてくれます。連携できるコードエディタと組み合わせて使うと便利です。~~
最近非推奨になったため[eslint](https://eslint.org/)を使ったほうがいいようです。eslintは設定が多少複雑になるので今回はtslintのままにしておきます。
- [prettier](https://prettier.io/): コード整形をしてくれます。コードエディタと連携するとファイルの保存時に勝手にprettierのルールに沿ったきれいなコードに整えてくれます。
- [react](https://ja.reactjs.org/): [仮想DOM](https://ja.reactjs.org/docs/faq-internals.html) を用いて動的にHTMLの [DOM](https://developer.mozilla.org/ja/docs/Web/API/Document_Object_Model/Introduction) を操作してくれるライブラリ。似たような機能を有するライブラリでReactと共に人気のVue.jsというものがあります。日本ではVue.jsのほうが人気があり日本語の記事も多いようですが個人的な好みでReactを選択しました。5年くらい前までの仮想DOMが浸透していなかった時代は [jQuery](https://jquery.com/) というライブラリで直接 [DOM](https://developer.mozilla.org/ja/docs/Web/API/Document_Object_Model/Introduction) 操作をする実装が主流でした。
- [@material-ui](https://material-ui.com/): googleが推奨するマテリアルデザインをReactで使えるようにするコンポーネント群。
- [date-fns](https://date-fns.org/): 日付処理ライブラリ。
- [@types](https://definitelytyped.org/): typescriptの型定義が見つからないjavascriptライブラリの型定義を補完します。
- [@geolonia/japanese-numeral](https://blog.geolonia.com/2020/07/21/japanese-numeral.html): ちょうど数値を漢数字の文字列に変換するパッケージが公開されてたので使わせてもらいました。

npmの設定ファイル [package.json](https://github.com/jishida/rikon-demo/blob/master/typescript-react-web/package.json) には記述していませんが、javascript版と同様に日本語に対応させた [pdfmake](http://pdfmake.org/#/) を使用しています。こちらはHTMLから直接[このように](https://github.com/jishida/rikon-demo/blob/master/typescript-react-web/index.html#L9-L10) javascript-minimal-webフォルダ内のpdfmake.min.jsとvfs_fonts.jsを参照することで読み込んでいます。

#### 構成ファイルの説明

typescript版のデモを構成するデータはソースコードの [typescript-react-web](https://github.com/jishida/rikon-demo/tree/master/typescript-react-web) フォルダにあります。
[index.html](https://github.com/jishida/rikon-demo/blob/master/typescript-react-web/index.html) と [style.css](https://github.com/jishida/rikon-demo/blob/master/typescript-react-web/style.css) はjavascript版と同様の配置にしてあります。
typescript版の [index.html](https://github.com/jishida/rikon-demo/blob/master/typescript-react-web/index.html) はjavascript版の [index.html](https://github.com/jishida/rikon-demo/blob/master/javascript-minimal-web/index.html) と比べるとかなりシンプルな記述になっているのがわかると思います。これは、`<div id="content"></div>`タグ内の要素をReactが動的に生成してくれるためです。

コーディングが必要なtypescriptのコードは [src](https://github.com/jishida/rikon-demo/tree/master/typescript-react-web/src) フォルダ内にあります。typescriptの拡張子は.tsですが、Reactの拡張記法を使用する場合は拡張子を.tsxにする慣習があるのでそれに倣っています。
webpackとtypescriptを組み合わせて使うことにより機能ごとにフォルダやファイルを分けることが可能になりどこに何があるのか管理しやすくなっています。

以下にこのデモにおける機能の分け方を大まかに説明します。
- [index.tsx](https://github.com/jishida/rikon-demo/blob/master/typescript-react-web/src/index.tsx): プログラムのエントリポイント。
- [components](https://github.com/jishida/rikon-demo/tree/master/typescript-react-web/src/components) フォルダ: ブラウザに表示される要素をコンポーネントとして記述してあります。
- [models](https://github.com/jishida/rikon-demo/tree/master/typescript-react-web/src/models) フォルダ: ここらへんの作りはプロジェクトによってかなり差があるのですが、このデモではここで内部で使用するデータ構造やコンポーネントから呼び出せる関数を定義しています。これは[MVVM](https://ja.wikipedia.org/wiki/Model_View_ViewModel)パターンのViewModelに近い作りになっています。本来、[MVVM](https://ja.wikipedia.org/wiki/Model_View_ViewModel)パターンは前述した Vue.js が得意な手法なのですが、Reactはこの部分をどういう作りにするのか選択肢が広いところがいいところであり難しいところでもあります。
- [templates](https://github.com/jishida/rikon-demo/tree/master/typescript-react-web/src/templates) フォルダ: データモデルから文書を組み立てる処理を記述してあります。
- [utils](https://github.com/jishida/rikon-demo/tree/master/typescript-react-web/src/utils): その他このデモで使用する関数や定数を記述してあります。

その他のファイルやフォルダについては以下に簡単な説明を書いておきます。

- [package.json](https://github.com/jishida/rikon-demo/blob/master/typescript-react-web/package.json):
npmの設定ファイル。このファイルが有るフォルダに移動(`cd <フォルダのパス>`)して、`npm install`コマンドを実行するとpackage.jsonの["scripts" の部分](https://github.com/jishida/rikon-demo/blob/master/typescript-react-web/package.json#L6-L12)に`npm run`コマンドで実行できるコマンドを定義できます。例えば`npm install`コマンドで外部パッケージをインストールしている状態で`npm run build`コマンドを実行すると[ここに](https://github.com/jishida/rikon-demo/blob/master/typescript-react-web/package.json#L7)記述されているとおり`webpack -c webpack.config.prod.js`コマンドを呼び出して [dist](https://github.com/jishida/rikon-demo/tree/master/typescript-react-web/dist) フォルダに app.js を生成します。
公式の[ここ](https://docs.npmjs.com/cli/v6/configuring-npm/package-json)から仕様を確認できます。
- [webpack.config.js](https://github.com/jishida/rikon-demo/blob/master/typescript-react-web/webpack.config.js):
[webpack](https://webpack.js.org/) の設定をするスクリプト。このデモではこのファイルに開発用の設定を記述しています。公式の[ここ](https://webpack.js.org/configuration/)から仕様を確認できます。
- [webpack.config.prod.js](https://github.com/jishida/rikon-demo/blob/master/typescript-react-web/webpack.config.prod.js):
[webpack](https://webpack.js.org/) の設定をするスクリプト。このデモではこのファイルに本番用の設定を記述しています。公式の[ここ](https://webpack.js.org/configuration/)から仕様を確認できます。
- [tsconfig.json](https://github.com/jishida/rikon-demo/blob/master/typescript-react-web/tsconfig.json):
[typescript](https://www.typescriptlang.org/) の設定ファイル。公式の[ここ](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)や[ここのリファレンス](https://www.typescriptlang.org/tsconfig)から仕様を確認できます。
- [dist](https://github.com/jishida/rikon-demo/tree/master/typescript-react-web/dist) フォルダ:
webpack から出力されたファイルを格納するフォルダ。[src](https://github.com/jishida/rikon-demo/tree/master/typescript-react-web/src) フォルダ以下のファイルをまとめたのち最適化して app.js というファイルを出力するように設定してあります。
- [scripts](https://github.com/jishida/rikon-demo/tree/master/typescript-react-web/scripts) フォルダ:
package.jsonの["scripts" の部分](https://github.com/jishida/rikon-demo/blob/master/typescript-react-web/package.json#L6-L12)から呼び出すスクリプトなんかを置くフォルダ。package.jsonの[この部分](https://github.com/jishida/rikon-demo/blob/master/typescript-react-web/package.json#L9)の記述により`npm run predev`コマンドで [scripts/predev.js](https://github.com/jishida/rikon-demo/blob/master/typescript-react-web/scripts/predev.js) を実行できます。
- [.gitignore](https://github.com/jishida/rikon-demo/blob/master/typescript-react-web/.gitignore): githubを使うのに必要なバージョン管理ソフトウェア [git](https://git-scm.com/) で無視するファイルを指定するファイル。
- [.prettierignore](https://github.com/jishida/rikon-demo/blob/master/typescript-react-web/.prettierignore):
[prettier](https://prettier.io/) で無視するファイルを指定するファイル。
- [.prettierrc.yml](https://github.com/jishida/rikon-demo/blob/master/typescript-react-web/.prettierrc.yml):
[prettier](https://prettier.io/) の設定を記述するファイル。
[package-lock.json](https://github.com/jishida/rikon-demo/blob/master/typescript-react-web/package-lock.json):
npm が生成するファイル。`npm install`した際にインストールする外部パッケージのバージョンを固定する役割を持ちます。
- [tslint.json](https://github.com/jishida/rikon-demo/blob/master/typescript-react-web/tslint.json):
[tslint](https://palantir.github.io/tslint/) の設定ファイル。
