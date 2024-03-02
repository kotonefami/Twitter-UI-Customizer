// TUICで実装する関数のモック（割と実際に使えるようになっちゃった

export interface SettingRecord {
    /**
     * この設定のデフォルト値
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: any;

    /**
     * この設定のi18n キー。
     * `undefined` の場合は、設定キーをそのまま i18n キーとして使用します。
     */
    i18n?: string;
}

export interface ApiInit<S extends Record<string, SettingRecord>> {
    /** API が提供する設定 */
    settings: S;

    /** オブザーバーが実行される際のイベント */
    onObserve: (this: TuicApi<S>) => unknown;
}

class SettingsHost<S extends Record<string, SettingRecord>> {
    private _template: S;

    private constructor(init: S) {
        this._template = init;
    }

    /** 設定を読み込みます。 */
    public get<K extends keyof S>(key: K): S[K]["default"] {
        // TODO: ここは既存の設定ストアと接続
        return "" ?? this._template[key].default;
    }

    /** 設定を書き込みます。 */
    public set<K extends keyof S>(key: K, value: S[K]["default"]): this {
        // TODO: ここは既存の設定ストアと接続
        return this;
    }

    /** 設定キー一覧を取得します。 */
    public keys(): (keyof S)[] {
        return Object.keys(this._template);
    }
}

// NOTE: なんでこんなことをするかというと、ApiInit インターフェースが渡された時点ではobserverなどを取得できないため
// NOTE: 逆に取得できるようにしてしまうと、またimport地獄になるので非推奨
/**
 * API ホストによって生成された動作可能な TUIC API
 */
export class TuicApi<S extends Record<string, SettingRecord>> {

    /** API の設定 */
    public settings: SettingsHost<S>;

    private _settings: S;
    private _onObserve: (this: this) => unknown;

    public constructor(init: ApiInit<S>) {
        this._settings = init.settings;
        this._onObserve = init.onObserve;
    }

    /** オブザーバーが呼ばれたことを API に通知します。 */
    public observe(): void {
        this._onObserve.call(this);
    }

}

/**
 * TUIC API を追加します。
 */
export function registerApi<S extends Record<string, SettingRecord>>(init: ApiInit<S>) { }
