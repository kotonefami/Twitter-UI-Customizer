import { TUICI18N } from "@content/modules/i18n";
import { getPref } from "@content/modules/pref";
import { processElement, waitForElement } from "@content/modules/utils/controlElements";
import { placeToastMessage } from "@content/modules/utils/toastMessage";
import { ProcessedClass } from "@shared/sharedData";

export function composetweet() {
    const composeTweetButtons = document.querySelectorAll<HTMLButtonElement>(`:is([data-testid="tweetButton"], [data-testid="tweetButtonInline"]):not(.${ProcessedClass})`)
    if (composeTweetButtons.length > 0) {
        for(const composeTweetButton of composeTweetButtons){
            composeTweetButton.addEventListener("click", () => {
                if (composeTweetButton.disabled) return;
                if (getPref("composetweet.copyHashtag")) {
                    const hashs = [];
                    const tweetTextElement = document.querySelector(`[data-testid="tweetTextarea_0"]`)
                    for (const sentence of tweetTextElement.querySelectorAll(`span[data-text="true"]`)) {
                        if (sentence?.textContent && (sentence.textContent.startsWith("#") || sentence.textContent.startsWith("$"))) hashs.push(sentence.textContent);
                    }
                    if (hashs.length > 0) {
                        navigator.clipboard.writeText(hashs.join(" "));
                        placeToastMessage(TUICI18N.get("bottomTweetButtons-urlCopy-layer"));
                    }
                }
                if (location.pathname === "/compose/post" && composeTweetButton.dataset.testid === "tweetButton" && getPref("composetweet.remainOpened")) {
                    waitForElement(`[data-testid="toast"]`).then(() => {
                        window.setTimeout(() => document.querySelector<HTMLButtonElement>(`[data-testid="SideNav_NewTweet_Button"]`)?.click(), 500);
                    });
                }
            });
            processElement(composeTweetButton);
        }
    }
}
