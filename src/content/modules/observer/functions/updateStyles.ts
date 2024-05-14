import { applySystemCss } from "@content/applyCSS";
import { FAVORITE_ICON, HOME_ICON, SIDEBAR_BUTTON_ICON } from "@content/icons";
import { TUICPref } from "@content/modules";
import { ProcessedClass } from "@shared/sharedData";
import { SidebarButtonSelectors } from "./sidebarBtn";
import { ButtonUnderTweetSelectors } from "./tweetSettings/_data";

let fontSize1: string = "";
let fontSize2: boolean | null = null;

export function updateStyles() {
    sidebarButtons();
    likeToFavo();

    //* apply CSS
    if (document.querySelector("html").style.fontSize.toString() != fontSize1 || document.querySelector(`h1[role="heading"] > a[href="/home"]`)?.className.includes("r-116um31") !== fontSize2) {
        applySystemCss();
        fontSize1 = document.querySelector("html").style.fontSize.toString();
        fontSize2 = document.querySelector(`h1[role="heading"] > a[href="/home"]`)?.className.includes("r-116um31");
    }

    if (document.querySelector(`.TUICSidebarButton .r-mbgqwd`) != null) document.querySelector(`.TUICSidebarButton .r-mbgqwd`)?.classList?.remove("r-mbgqwd");
}

const tuicButtonUrl = {
    topics: `/topics`,
    lists: `/lists`,
    communities: "/communities",
    connect: "/i/connect_people",
    drafts: "/compose/tweet/unsent/",
    display: ["/i/display", "/settings/display"],
    muteAndBlock: "/settings/mute_and_block",
    bookmarks: "/i/bookmarks",
    settings: ["/settings", "/settings/"],
    jobs: "/jobs",
    spaces: "/i/spaces/start",
};
function sidebarButtons() {
    // TUIC独自のサイドバーボタン(太線かどうかを変更)
    for (const i of document.querySelectorAll(".TUICSidebarButton")) {
        const itemId = i.id.replace("TUICSidebar_", "");

        let locationBool = false;
        const includesCheck = (buttonUrl: string) => {
            if (buttonUrl.endsWith("/")) {
                locationBool = location.pathname.includes(buttonUrl) ? true : locationBool;
            } else {
                locationBool = location.pathname.endsWith(buttonUrl) ? true : locationBool;
            }
        };
        if (typeof tuicButtonUrl[itemId] == "object") {
            for (const elem of tuicButtonUrl[itemId]) includesCheck(elem);
        } else {
            includesCheck(tuicButtonUrl[itemId]);
        }

        const svg_path = i.querySelector("svg path");
        if (locationBool && !i.classList.value.includes("TUICSidebarSelected")) {
            svg_path.setAttribute("d", SIDEBAR_BUTTON_ICON[itemId].selected);
            i.classList.add("TUICSidebarSelected");
        } else if (!locationBool && i.classList.value.includes("TUICSidebarSelected")) {
            svg_path.setAttribute("d", SIDEBAR_BUTTON_ICON[itemId].unselected);
            i.classList.remove("TUICSidebarSelected");
        }
        if (document.querySelector(SidebarButtonSelectors.moremenu) != null) i.querySelector<HTMLElement>("[dir]").style.display = document.querySelector(SidebarButtonSelectors.moremenu).children[0].childNodes.length == 2 ? "" : "none";
    }

    // ホームボタン
    const elem = document.querySelector(`.gt2-nav [data-testid="AppTabBar_Home_Link"]`) ?? document.querySelector("[role=banner] > div > div > div > div > div > nav " + SidebarButtonSelectors.home);
    if (elem) {
        const isHome = location.pathname === "/home";
        const SVGElem = elem.querySelector("svg path");
        SVGElem.setAttribute("d", HOME_ICON[TUICPref.getPref("sidebarSetting.homeIcon")][isHome ? "selected" : "unselected"]);
    }
}

// いいねをふぁぼに
function likeToFavo() {
    if (TUICPref.getPref("tweetDisplaySetting.option.likeToFavo")) {
        for (const elem of document.querySelectorAll(`${ButtonUnderTweetSelectors["like-button"]} svg:not(.${ProcessedClass})`)) {
            const selected = elem.closest(ButtonUnderTweetSelectors["like-button"]).getAttribute("data-testid") == "unlike" ? "selected" : "unselected";
            elem.querySelector("path").setAttribute("d", FAVORITE_ICON.favorite[selected]);
            if (TUICPref.getPref("visibleButtons").includes("likeAndRT")) {
                elem.hasClosest(ButtonUnderTweetSelectors["retweet-button"]).querySelector(`${ButtonUnderTweetSelectors.likeAndRT} path`)?.setAttribute("d", FAVORITE_ICON.favoriteRT.unselected);
            }

            elem.process();
        }
    }
}
