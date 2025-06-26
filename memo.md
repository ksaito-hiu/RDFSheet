title: memo

RDFSheetメモ
========================================

経緯: 一般の人でもRDF(Resource Description Framework)を
作れたり見れたりするようにスプレッドシートにRDFを出力
したり、表形式にして見れるようにする簡単な機能を実装する。

<https://github.com/dream-num/>のLuckysheetを使わせてもらう。
univerの方が良いのかもしれないけど、枯れた技術を使いたい。

* 「@comake/rmlmapper-js」あたりを使ってRML(RDF Mapping Language)を
  使おうと思ってたけど、テンプレートを用意してStringのreplaceでも
  いい気がしてきた。
* テンプレートリテラルはセキュリティ的に危険なのでダメ。
* デリミタは<<・・・>>とかが良い気がする。
* 空欄対応とか考えると面倒だけど、そのぐらいはアイデア出してやるべき。
* 保存形式だけど、LuckySheetのJSONをとそれ以外の必要な情報を含んだJSONが良いと思う。
* 新たな拡張子を創造してしまおう。
* それ以外の必要な情報はシートごとに設定できるようにしよう。
* それ以外の必要な情報とは・・・
    + シートの範囲を指定して行ごとに繰り返し処理するのか、
      単純な埋め込み(C12とかE20だけ使うなど)か
    + 繰り返し処理するならシートのどの範囲か
    + Turtleのテンプレート
    + テンプレートに埋め込む時に変換が必要な時のMAP
    + 空欄をどうするかの情報も必要かも

アプリ名RDFSheet、拡張子rdfsでよさそう。MIMEタイプも決めとこう。
`application/x-rdfsheet+json`。File Handling APIで、PWAと関連
付けできる。manifest.jsonの中に`"file_handlers": ・・・`と
設定するらしい。

2025,06/26: 以下を参考にLuckySheet入れてみた。

* <https://github.com/dream-num/luckysheet-react>

chatが動かないことが判明したのでUniverでも良い気が
してきたけど、UniverはUniverで良くわかんない。
ということで、とりあえずLuchySheetで行こう。
