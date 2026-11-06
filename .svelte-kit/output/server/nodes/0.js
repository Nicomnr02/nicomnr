

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.DVD9KCsS.js","_app/immutable/chunks/Cx0vpSIh.js","_app/immutable/chunks/CKJIiNU9.js","_app/immutable/chunks/DV9Xp6jy.js","_app/immutable/chunks/BCqQQ_df.js","_app/immutable/chunks/BakrROSK.js","_app/immutable/chunks/CrAJBr8m.js","_app/immutable/chunks/CAwcADLf.js"];
export const stylesheets = ["_app/immutable/assets/0.qy4H7f2c.css"];
export const fonts = [];
