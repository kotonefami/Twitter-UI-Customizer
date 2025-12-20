import { getPref } from "@content/modules/pref";

// PC版の場合ユーザーID、スマホ版の場合アカウント切り替えボタンのaria-labelを格納
// (Delegate機能に対応するため)
const pinnedTab: string[] = [];

export function pinningTab() {
    if (location.pathname !== "/home" || getPref("timeline.pinningTab") === "none") return;
    {
        const userIcon = document.querySelector(`[data-testid="DashButton_ProfileIcon_Link"]`);
        if (userIcon) {
            clickTab(userIcon.ariaLabel);
            return;
        }
    }
    {
        const userIcon = document.querySelector<HTMLElement>(`header [data-testid="SideNav_AccountSwitcher_Button"] [data-testid^="UserAvatar-Container-"]`);
        if (userIcon) {
            clickTab(userIcon.dataset.testid)
            return;
        }
    }
}

function getTabSelector(nth: number) {
    return `:is([data-testid="TopNavBar"], [data-testid="primaryColumn"]) [role="navigation"] [data-testid="ScrollSnap-SwipeableList"] [data-testid="ScrollSnap-List"] > div[role="presentation"]:nth-child(${nth}) > [role="tab"]`
}

const orderOfTab = ["foryou", "following"];

// まだタブ固定処理をしていないアカウントのみ動かす
function clickTab(userID: string): boolean {
    if (pinnedTab.includes(userID)) return;
    const prefValue = getPref("timeline.pinningTab");
    switch (prefValue) {
        case "following":
        case "foryou": {
            const tabElement = document.querySelector<HTMLButtonElement>(getTabSelector(orderOfTab.indexOf(prefValue) + 1))
            if (tabElement){
                tabElement.click?.()
                pinnedTab.push(userID);
            }
            break;
        }
        default: break;
    }

}