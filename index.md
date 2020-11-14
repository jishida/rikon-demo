# 離婚協議書作成デモの解説

## 前提

このアプリケーションはあくまでデモです。

こういったWEBサイトを作る際、データ通信を少なくするため必要なファイルサイズを小さくするものですが、このデモのファイルサイズ合計は10MB近く一般的なウェブサイトよりもかなり大きめになっています。

その理由はウェブブラウザだけでPDFを作成するために利用しているpdfmakeというライブラリで日本語を印刷するためには日本語フォントをスクリプトに埋め込む必要があるからです。

多数の漢字を含む日本語フォントは英数字100文字程度の英文フォントに比べて圧倒的にデータサイズが大きく、デフォルトの英文フォントが170KBであるのに対し、今回使用した"GenShinGothic-Monospace-Medium"は4800KBもあります。

ですから一般的にはウェブブラウザでPDF作成をするという処理はせず、数十～数百バイトの必要なパラメーターだけサーバーに送り、サーバーでPDFを作成してウェブブラウザに送り返すという処理をします。

しかし、今回のアプリケーションの目的がプログラミング初心者が触れるものということだったことから、サーバー側で処理をさせる実装はサーバーサイドの環境構築やアプリケーションの実装など理解に要する範囲が増大すると判断し、一般的に使われることの少ないクライアントサイドで完結する実装を優先しました。

## 仕様の検討

作ってるうちに仕様が変わることはまあよくあることですが、ある程度まとめておくと仕様変更があっても煩雑になりにくいです。

私が今回のデモを作るにあたって大まかな仕様をまとめたものが[こちら](https://jishida.github.com/rikon-demo/specification)になります。

仕様策定の導入として、プログラミングは変数名をアルファベットで書くことが一般的なので使用する固有名詞に対応した英語なんかを調べておくと変数名で悩みにくいです。英語よりローマ字読みのほうがわかりやすいならローマ字でも構いません。例を挙げると"債務者"を"debtor"とするか"saimusha"にするかということです。人に見せるものでないなら好きな方でいいと思います。

あと大事なのはデータ型を意識することです。javascriptを使うにあたってstring(文字列型)、number(数値型)、boolean(真偽値型)、Array(配列型)、Object(オブジェクト型)といった基本的なデータ型は押さえておきたいです。

javascriptはブラウザ内での動作を前提とした独特のAPIを持っており、非同期処理などわかりにくい部分も多いですが、[MDN](https://developer.mozilla.org/ja/)の[リファレンス](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference)を見ると日本語で仕様を確認できるので比較的日本人にも優しいかもしれません。

## ２種類の実装

今回、javascriptとtypescriptで２種類の実装をしました。

javascript版のデモは[こちら](https://jishida.github.io/rikon-demo/javascript-minimal-web/index.html) ソースコードは[こちら](https://github.com/jishida/rikon-demo/tree/master/javascript-minimal-web)

typescript版のデモは[こちら](https://jishida.github.io/rikon-demo/typescript-react-web/index.html) ソースコードは[こちら](https://github.com/jishida/rikon-demo/tree/master/typescript-react-web)

ソースコードは[github](https://github.com/jishida/rikon-demo)上で見ることができます。
vscodeで見たり書き換えたりブラウザで実際に動作を確認したりする場合は[こちら](https://github.com/jishida/rikon-demo/archive/master.zip)からソースコードをダウンロードしてください。

## javascript版

javascriptでの実装はHTML+javascriptで作る最小構成のウェブアプリケーションとなっており、使用している外部ライブラリはPDFを作成する [pdfmake](http://pdfmake.org/#/) のみとなっています。

すでに更新が止まっていて新しい機能が使えないInternet Explorerでも動作する。基本的ですがかなり古い書き方です。

javascript版のデモを構成するデータはソースコードの"javascript-minimal-web"フォルダにあります。
画面に表示する入力フォームなどは [index.html](https://github.com/jishida/rikon-demo/blob/master/javascript-minimal-web/index.html) に、動作を制御するjavascriptは [index.js](https://github.com/jishida/rikon-demo/blob/master/javascript-minimal-web/index.js) にそれぞれ一つのファイルに収められています。

style.cssはhtmlの各要素のレイアウトや見え方を変更できるスタイルシートです。これを書き換えるだけで見た目をがらりと変えることもできますが、私は詳しくないので適当です。

pdfmake.min.js と vfs_fonts.js はpdfmakeを日本語に対応させた改造版のスクリプトになります。
pdfmakeは基本的な使い方であれば日本語の解説記事も見つかりますが、細かく調整したいなら英語ですが[公式のドキュメント](https://pdfmake.github.io/docs/0.1/)に詳しい使い方が書かれています。

html+javascriptの動作を確認したい場合はchromeやfirefoxなどのブラウザに搭載されている開発者ツールを使うと便利です。

このデモの場合 "javascript-minimal-web" フォルダ内の index.html をダブルクリックしてブラウザで開いた後、F12キーを押したら開発者ツールで様々な解析ができると思います。おそらく殆どのブラウザがF12キーだと思います。

## typescript版

近年のウェブ開発で人気のtypescriptとreactを使用して作ったデモです。

typescriptとはjavascriptに変換可能なプログラミング言語です。
そのままではブラウザで実行できないのでブラウザで動作させるにはコーディングした後、typescriptのコンパイラーでコンパイルする必要があります。

これだけだと面倒なようですが、typescriptには補って余りある有用な機能がたくさんあります。

typescriptはjavascriptと違い各変数のデータ型を明確にする必要があり、対応したエディタ(vscodeなど)でコーディングすると、javascriptよりも厳格に間違えを指摘してくれたり、強力なコード補完機能を提供してくれたりします。

javascriptやpythonのようなデータ型の扱いが緩い言語を動的型付き言語、typescript、C言語やjavaのようなデータ型を厳格に扱う言語を静的型付き言語と呼びます。個人的には静的型付き言語は、エディタから間違えを指摘してもらいやすくコード補完も効きデータ型を意識したコーディングを強いられることから初心者に適していると思います。

しかしながらtypescriptはブラウザでそのまま動かせるjavascriptと比べると少々導入の敷居が高く初心者に環境構築までさせるとなるとまあまあ難易度が高いです。

ここでは細かくは解説しませんが概要をさらっと説明します。
typescriptを使った開発ではコマンドラインの作業が発生します。
最低限必要なソフトウェアとして[nodejs](https://nodejs.org/ja/)が必要となります。
nodejsとは、ブラウザというサンドボックス内で限られた機能しか使えなかったjavascriptをPC上でファイル操作からデバイス操作までなんでもできるようにしたソフトウェアです。
nodejsをインストールするとjsファイルを実行するnodeコマンドと外部パッケージを管理するnpmコマンドが使えるようになります。
これはpythonをインストールしたときに追加されたpythonコマンドとpipコマンドに似ています。
nodejsを使った開発ではnpmコマンドを使って開発に必要なツールをインストールすることで開発を有利に進めることができます。

例としてこのデモで使った外部パッケージは[こちら](https://github.com/jishida/rikon-demo/blob/master/typescript-react-web/package.json#L18-#L38)の設定ファイルから確認できます。
主な外部パッケージは以下のようになります。
- typescript: typescriptをjavascriptにコンパイルする。
- webpack: 複数に分かれたファイルをひとまとめにして最適化してくれる。機能ごとにファイルを分けるモジュール化に必須。
- tslint: typescriptのコードチェックをしてくれる。
- prettier: コード整形をしてくれる。
- react: HTMLエレメントの動的な生成をしてくれるライブラリ。似たような機能を有するライブラリでReactと共に人気のVue.jsというものがある。そちらのほうが簡単との噂を聞くが個人的な好みでReactを選択。
- @material-ui: googleが推奨するマテリアルデザインをReactで使える使えるようにするコンポーネント群。
- date-fns: 日付処理ライブラリ。
- @types: typescriptの型定義が見つからないjavascriptライブラリの型定義を補完する。

眠たい...目が冷めたら整理するかも。