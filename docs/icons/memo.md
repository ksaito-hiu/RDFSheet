
アイコンはGeminiに作ってもらった。その画像を
以下のサイトで上手く調整してもらった。

* <https://realfavicongenerator.net/>

realfavicongeneratorのサイトに頼んだら
site.webmanifestというファイルの中にマニフェスト
ファイルまで作ってくれたけど、その中身は以下のJSON。

{
  "name": "RDFSheet",
  "short_name": "RDFSheet",
  "icons": [
    {
      "src": "/RDFSheet/icons/web-app-manifest-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/RDFSheet/icons/web-app-manifest-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "theme_color": "#efd996",
  "background_color": "#ffffff",
  "display": "standalone"
}


あと、生成した時に`<head>`に埋め込む要素も生成して
表示してくれた。それを以下にコピペ。

    <link rel="icon" type="image/png" href="/RDFSheet/icons/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/RDFSheet/icons/favicon.svg" />
    <link rel="shortcut icon" href="/RDFSheet/icons/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/RDFSheet/icons/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-title" content="RDFSheet" />
    <link rel="manifest" href="/RDFSheet/icons/site.webmanifest" />


