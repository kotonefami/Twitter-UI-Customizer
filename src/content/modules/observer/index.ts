import { tweetSettings, hideOsusumeTweets, replacePost, hideElements, updateStyles, profileInitialTab, sidebarButtons, dmPage, fixTwittersBugs, changeIcon } from "./functions.ts";
import { catchError } from "./errorDialog.ts";
import { placeDisplayButton } from "./functions/rightSidebarTexts.ts";

export const TUICObserver = new (class TUICObserver {
    /** 内部で使用される MutationObserver */
    public observer: MutationObserver = new MutationObserver(mutations => this.callback(mutations));
    /** 監視対象の要素 */
    public target: Element | null = null;

    /** オブザーバーを開始します。 */
    public bind(): void {
        if (!this.target) throw new TypeError("Target is null");
        this.observer.observe(this.target, {
            childList: true,
            subtree: true,
        });
    }

    /** オブザーバーを停止します。 */
    public unbind(): void {
        this.observer.disconnect();
    }

    /** オブザーバーのコールバック */
    public callback(mutations: MutationRecord[]): void {
        // NOTE: (パフォーマンス改善) 明らかに編集する必要性のない要素の変更の場合は、実行を中断
        const mutationElements = mutations.flatMap(m => Array.from(m.addedNodes) as Element[]);
        if (mutationElements.length === 0 || mutationElements.every(e =>
            e.nodeType === Node.TEXT_NODE ||
            e.nodeName === "SCRIPT"
        )) return;
        // mutationElements.forEach(e => console.log(e));

        // TODO: unbind の必要性
        this.unbind();
        try {
            // Twitterのアイコンに関する設定
            changeIcon();

            // サイドバーに関する設定
            sidebarButtons();

            // ツイート関連の設定
            if (mutationElements.some(e => (e as HTMLElement).dataset?.testid === "cellInnerDiv")) tweetSettings();

            // おすすめユーザーを非表示 (かなり処理が特殊なので他の非表示から分離)
            hideOsusumeTweets();

            // DMに関する設定
            dmPage();

            // ポストをツイートに修正
            replacePost();

            // 要素を非表示に
            hideElements();

            // 様々な要素のCSSを適切なものに変更
            updateStyles();

            // プロフィールページの初期タブの設定
            profileInitialTab();

            // 右サイドバーに「表示」を配置
            placeDisplayButton();

            // Twitterのバグを修正(現在はDMに関するもののみ)
            fixTwittersBugs();

            this.bind();
        } catch (e) {
            this.unbind();
            catchError(e, () => this.bind());
        }
    }
})();
