import { a7 as head, e as escape_html, a8 as ensure_array_like, a9 as attr, aa as attr_class, ab as slot } from "../../chunks/index.js";
import { N as NAV_LINKS, P as PERSON } from "../../chunks/data.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let themeLabel, navTag;
    let clock = "UT::--:--";
    const MODES = ["system", "light", "dark"];
    let mi = 0;
    let menuOpen = false;
    let currentSec = "me";
    themeLabel = "Theme: " + MODES[mi];
    navTag = currentSec[0].toUpperCase() + currentSec.slice(1);
    head("12qhfyh", $$renderer2, ($$renderer3) => {
      $$renderer3.push(`<link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&amp;family=IBM+Plex+Mono:wght@400;500&amp;display=swap"/> <meta name="description" content="Backend-leaning software engineer in Jakarta. Notification pipelines, approval flows and payment services in Go."/>`);
    });
    $$renderer2.push(`<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="rough"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" result="n"></feTurbulence><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.75" result="m"></feColorMatrix><feComposite in="SourceGraphic" in2="m" operator="in"></feComposite></filter></svg> <div class="bar mono"><span id="clock">${escape_html(clock)}</span> <span>${escape_html(PERSON.locationShort)}</span> <span>${escape_html(PERSON.status)}</span></div> <nav><a class="logo" href="#me">${escape_html(PERSON.initials)}<small class="mono mut" style="margin-left:.5rem;font-weight:400">${escape_html(navTag)}</small></a> <ul class="nav-desktop"><!--[-->`);
    const each_array = ensure_array_like(NAV_LINKS);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let link = each_array[$$index];
      $$renderer2.push(`<li><a${attr("href", link.href)}${attr("aria-current", currentSec === link.href.replace(/^#/, "") ? "page" : void 0)}>${escape_html(link.label)}</a></li>`);
    }
    $$renderer2.push(`<!--]--> <li><button class="mono theme-btn" aria-label="Change theme">${escape_html(themeLabel)}</button></li></ul> <button type="button"${attr_class("burger-btn", void 0, { "open": menuOpen })}${attr("aria-label", "Open navigation menu")}${attr("aria-expanded", menuOpen)}><span class="burger-line top"></span> <span class="burger-line mid"></span> <span class="burger-line bot"></span></button></nav> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <main><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></main>`);
  });
}
export {
  _layout as default
};
