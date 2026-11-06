import { e as escape_html, a8 as ensure_array_like, aa as attr_class, a9 as attr, ac as attr_style, ad as stringify, ae as store_get, af as unsubscribe_stores } from "../../chunks/index.js";
import { D as DB_TABLES, P as PERSON, E as EXPERIENCES, a as EDUCATION, C as CONTACT } from "../../chunks/data.js";
import { w as writable } from "../../chunks/index2.js";
import { g as getAllBlogs } from "../../chunks/blogs.js";
const activeSection = writable("me");
function SectionMe($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<section id="me" class="page-section emerged"><h1>${escape_html(PERSON.shortName)}, ${escape_html(PERSON.title)}</h1> <p class="lede">${escape_html(PERSON.lede)}</p> <div class="wrap"><div class="cv" id="cv"><svg id="lines" width="1020" height="660"></svg> <!--[-->`);
    const each_array = ensure_array_like(DB_TABLES);
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let tb = each_array[$$index_1];
      $$renderer2.push(`<div${attr_class("tb", void 0, { "wide": tb.wide })}${attr("id", tb.id)}${attr_style(`--c:${stringify(tb.color)}`)}><h3>${escape_html(tb.label)}</h3> <!--[-->`);
      const each_array_1 = ensure_array_like(tb.rows);
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let row = each_array_1[$$index];
        $$renderer2.push(`<div class="r"${attr("id", row.id ?? void 0)}><b>${escape_html(row.key)} `);
        if (row.tag) {
          $$renderer2.push(`<!--[0--><em>${escape_html(row.tag)}</em>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></b> <i>`);
        if (row.isEmail) {
          $$renderer2.push(`<!--[0--><a${attr("href", `mailto:${stringify(row.value)}`)}>${escape_html(row.value)}</a>`);
        } else if (row.isLink) {
          $$renderer2.push(`<!--[1--><a${attr("href", row.href)}>${escape_html(row.value)}</a>`);
        } else {
          $$renderer2.push(`<!--[-1-->${escape_html(row.value)}`);
        }
        $$renderer2.push(`<!--]--></i></div>`);
      }
      $$renderer2.push(`<!--]--> `);
      if (tb.note) {
        $$renderer2.push(`<!--[0--><div class="note">${escape_html(tb.note)}</div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> <p class="hint mono mut"><span class="desktop-hint">experience.person_id, education.person_id and skill.person_id all reference person.id</span> <span class="mobile-hint">Scroll diagram horizontally to explore • Drag headers to rearrange</span></p></section>`);
  });
}
function SectionLab($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let view = "slider";
    let currentIndex = 2;
    const TOTAL_ITEMS = EXPERIENCES.length;
    $$renderer2.push(`<section id="lab" class="page-section"><h1>Lab, work experience</h1> <div class="tools" role="group" aria-label="View"><!--[-->`);
    const each_array = ensure_array_like(["list", "slider", "grid"]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let v = each_array[$$index];
      $$renderer2.push(`<button${attr("data-v", v)}${attr("aria-pressed", view === v)}>${escape_html(v[0].toUpperCase() + v.slice(1))}</button>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push(`<!--[0--><div class="slider-view" role="region" aria-label="Work experience slider"><div class="slider-track"><!--[-->`);
      const each_array_1 = ensure_array_like(EXPERIENCES);
      for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
        let x = each_array_1[i];
        const offset = i - currentIndex;
        $$renderer2.push(`<button type="button" class="slider-card"${attr("data-offset", offset)}${attr_style(`--h:${stringify(x.h)};`)}${attr("aria-label", `${stringify(x.t)} - Card ${stringify(i + 1)}`)}><div class="p"><span class="card-abbr">${escape_html(x.ab)}</span> <span class="card-seq">0${escape_html(i + 1)}</span></div> <div class="t"><div class="title-row"><strong>${escape_html(x.t)}</strong> `);
        if (x.now) {
          $$renderer2.push(`<!--[0--><span class="badge">Now</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <small>${escape_html(x.tag)} • ${escape_html(x.when)}</small></div></button>`);
      }
      $$renderer2.push(`<!--]--></div></div> <div class="slider-dots" role="tablist" aria-label="Slider navigation dots"><!--[-->`);
      const each_array_2 = ensure_array_like(EXPERIENCES);
      for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
        each_array_2[i];
        $$renderer2.push(`<button type="button"${attr_class("slider-dot", void 0, { "active": i === currentIndex })} role="tab"${attr("aria-selected", i === currentIndex)}${attr("aria-label", `Go to card ${stringify(i + 1)}`)}></button>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="tools" id="wh"><button aria-label="Previous card"${attr("disabled", currentIndex === 0, true)}>Prev</button> <button aria-label="Next card"${attr("disabled", currentIndex >= TOTAL_ITEMS - 1, true)}>Next</button> <span class="mono mut" style="align-self:center;margin-left:.6rem">Card ${escape_html(currentIndex + 1)} of ${escape_html(TOTAL_ITEMS)} • Click card for details</span></div>`);
    }
    $$renderer2.push(`<!--]--> <dialog>`);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></dialog></section>`);
  });
}
function SectionEducation($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    store_get($$store_subs ??= {}, "$activeSection", activeSection) === "education";
    $$renderer2.push(`<section id="education" class="page-section"><h1>Education</h1> <div class="edu"><!--[-->`);
    const each_array = ensure_array_like(EDUCATION);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let edu = each_array[i];
      $$renderer2.push(`<a class="pass"${attr("href", edu.url)} target="_blank" rel="noopener"${attr("title", edu.title)}><i class="lan"></i> <i class="clip"></i> <div class="frame"><div class="card"><div class="top"><span>Education pass</span> <span>${escape_html(edu.year)}</span></div> <div class="tile" aria-hidden="true">${escape_html(edu.abbr)}</div> <div class="who"><strong>${escape_html(edu.name)}</strong> <em>${escape_html(edu.degree)}</em></div> <div class="foot"><span>${escape_html(edu.score)}</span> <span>${escape_html(edu.period)}</span></div></div></div></a>`);
    }
    $$renderer2.push(`<!--]--></div></section>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function SectionBlog($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const blogs = getAllBlogs();
    function formatDate(dStr) {
      try {
        const d = new Date(dStr);
        return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
      } catch (_) {
        return dStr;
      }
    }
    $$renderer2.push(`<section id="blog" class="page-section"><h1>Blog &amp; Writing</h1> <p class="lede">Architectural notes, engineering trade-offs, and lessons learned from building backend pipelines and scalable systems.</p> <div class="blog-list svelte-1a6drrn"><!--[-->`);
    const each_array = ensure_array_like(blogs);
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let post = each_array[$$index_1];
      $$renderer2.push(`<a class="blog-card svelte-1a6drrn"${attr("href", `/blog/${stringify(post.slug)}`)}><div class="card-meta mono mut svelte-1a6drrn"><span>${escape_html(formatDate(post.date))}</span> <span class="meta-dot svelte-1a6drrn">•</span> <span>${escape_html(post.readTime)}</span></div> <h2 class="card-title svelte-1a6drrn"><span>${escape_html(post.title)}</span> <span class="title-arrow svelte-1a6drrn">→</span></h2> <p class="card-excerpt svelte-1a6drrn">${escape_html(post.excerpt)}</p> <div class="blog-chips svelte-1a6drrn"><!--[-->`);
      const each_array_1 = ensure_array_like(post.tags);
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let tag = each_array_1[$$index];
        $$renderer2.push(`<span class="chip-item mono svelte-1a6drrn">${escape_html(tag)}</span>`);
      }
      $$renderer2.push(`<!--]--></div></a>`);
    }
    $$renderer2.push(`<!--]--></div></section>`);
  });
}
function SectionContact($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let dateStr = "";
    let topic = CONTACT.defaultTopic;
    let fuStr = CONTACT.defaultTopic;
    let statusMsg = CONTACT.statusUnsigned;
    let stStr = "Being written";
    let sdStr = "";
    let stampHit = false;
    let sendDisabled = false;
    let msgReadOnly = false;
    let fromReadOnly = false;
    let msgVal = "";
    let fromVal = "";
    store_get($$store_subs ??= {}, "$activeSection", activeSection) === "contact";
    $$renderer2.push(`<section id="contact" class="page-section"><h1>Contact</h1> <div class="ct"><div class="letter"><div class="mono">${escape_html(dateStr)}</div> <p style="font-size:22px;margin:.8rem 0 0">${escape_html(CONTACT.greeting)}</p> <span class="re">RE ::</span> <div id="re"><!--[-->`);
    const each_array = ensure_array_like(CONTACT.topics);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let t = each_array[$$index];
      $$renderer2.push(`<span class="chip"><button type="button"${attr("aria-pressed", topic === t)}>${escape_html(t)}</button></span>`);
    }
    $$renderer2.push(`<!--]--></div> <label for="from">FROM ::</label> <input id="from" type="text"${attr("placeholder", CONTACT.fromPlaceholder)}${attr("value", fromVal)}${attr("readonly", fromReadOnly, true)}/> <label for="msg">MESSAGE ::</label> <textarea id="msg"${attr("placeholder", CONTACT.msgPlaceholder)}${attr("readonly", msgReadOnly, true)}>`);
    const $$body = escape_html(msgVal);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea> <p style="margin:1.2rem 0 0">Sincerely,</p> <label for="sig">${escape_html(CONTACT.signLabel)}</label> <canvas id="sig" aria-label="Signature pad"${attr_style("")}></canvas> <div${attr_class("stamp", void 0, { "hit": stampHit })} id="stamp" aria-hidden="true"><b>RECEIVED</b> <span>${escape_html(sdStr)}</span></div> <div class="row"><span class="mono" id="state">${escape_html(statusMsg)}</span> <div class="row-actions">`);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push(`<!--[0--><button type="button">Clear</button> `);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push(`<!--[0--><button type="button" class="go"${attr("disabled", sendDisabled, true)}>Send it</button>`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <aside class="ticket" aria-label="Intake ticket"><div>${escape_html(CONTACT.ticketHeader)}</div> <dl><dt>JOB</dt> <dd>${escape_html("--")}</dd> <dt>RECEIVED</dt><dd>${escape_html("--")}</dd> <dt>REPLY BY</dt><dd>${escape_html("--")}</dd> <dt>STATUS</dt> <dd>${escape_html(stStr)}</dd> <dt>FILE UNDER</dt><dd>${escape_html(fuStr)}</dd></dl> <p class="mut" style="margin-top:1.4rem">Email: <a${attr("href", `mailto:${stringify(CONTACT.email)}`)}>${escape_html(CONTACT.email)}</a><br/> Web: <a href="https://nicomnr.my.id">nicomnr.my.id</a></p></aside></div></section>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    SectionMe($$renderer2);
    $$renderer2.push(`<!----> `);
    SectionLab($$renderer2);
    $$renderer2.push(`<!----> `);
    SectionEducation($$renderer2);
    $$renderer2.push(`<!----> `);
    SectionBlog($$renderer2);
    $$renderer2.push(`<!----> `);
    SectionContact($$renderer2);
    $$renderer2.push(`<!----> <footer class="site-footer mono mut svelte-1uha8ag"><span>© ${escape_html(year)} ${escape_html(PERSON.shortName)}</span> <span class="footer-dot svelte-1uha8ag">•</span> <span>${escape_html(PERSON.title)}</span> <span class="footer-dot svelte-1uha8ag">•</span> <a${attr("href", `mailto:${stringify(PERSON.email)}`)} class="footer-link svelte-1uha8ag">${escape_html(PERSON.email)}</a></footer>`);
  });
}
export {
  _page as default
};
