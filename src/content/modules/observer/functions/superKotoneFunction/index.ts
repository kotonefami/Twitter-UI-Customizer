import { registerApi } from "./tuic";

/*
変更点
設定キーは tuic.(機能id).(設定id).(細かい設定id) とかにする
i18nキーはほぼ廃止、設定キーと同一のものを使用

利点
今説明しているこのファイル1つで設定一つ、結構わかりやすくなる（当社比）
インポート地獄に悩まなくなる（おそらく。thisと型システムのおかげ）

ただこれってほぼtuic丸ごと作り直しになっちゃうよね、どうしよう
→ある程度共存させて、段階的な以降でもいいかも。設定キーは変わっちゃうけど、それ以外は別にアップデートで変えられる部分だし
*/

registerApi({
    settings: {
        "tuic.kotone-function.color": {
            // NOTE: default プロパティは重要です。型補完の判断材料になります。
            default: "#ffcc00"
        },
        "tuic.kotone-function.mode": {
            // NOTE: default プロパティを使用してこのように値を制限することができます。
            // NOTE: ただ、制限しているのは型システムだけなので、JavaScript ではこの値を読み取れません。
            default: <"kotone-mode" | "fami-mode" | "rii-mode">"kotone-mode"
        }
    },
    onObserve() {
        // NOTE: Observer が動くとここが動くよ
        console.log("observer function");

        // NOTE: 型補完が効きます。すごい！
        this.settings.set("tuic.kotone-function.mode", "kotone-mode");
        // NOTE: しかも勝手に上に書いたデフォルトまで取得してくれるよ！すごい！
        const mode = this.settings.get("tuic.kotone-function.mode");

        // NOTE: 従来の設定キーが必要だった（つまり、allが必要な）状況も、ほら！すごいでしょ！（設定キーが）パンパンですよパンパン！
        const keys = this.settings.keys();
        // TODO: この状況だと、 (".color" | ".mode")[] になっちゃうのは申し訳ない。
        //       TypeScript において、 union to array をするのは難しいらしいんだ。
        //       有識者がいたら勝手に直してくれ。 SettingsHost.keys 関数だ。よろしく。

        // TODO: tweetSettings/index.ts にあるようなセレクタ一覧は自分で何とかしてくれ。たぶん、型推論が走るからだいぶ書きやすいはず。

        // TODO: まだ追加してないけど、this.i18n(参考:replacePostWithTweet)とかも便利そう
    },

    // TODO: onStart とか、いろんな関数を生やしてもいいかも。例えばページ遷移イベントとか…？
});
