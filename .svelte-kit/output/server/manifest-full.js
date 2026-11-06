export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.BHt5K5-J.js",app:"_app/immutable/entry/app.BVNowF6m.js",imports:["_app/immutable/entry/start.BHt5K5-J.js","_app/immutable/chunks/CKJIiNU9.js","_app/immutable/chunks/-UyI9lYi.js","_app/immutable/chunks/DQwMRk8k.js","_app/immutable/chunks/BCqQQ_df.js","_app/immutable/chunks/B0XwC4Ot.js","_app/immutable/entry/app.BVNowF6m.js","_app/immutable/chunks/CKJIiNU9.js","_app/immutable/chunks/Cx0vpSIh.js","_app/immutable/chunks/BCqQQ_df.js","_app/immutable/chunks/BakrROSK.js","_app/immutable/chunks/D2SEVNi2.js","_app/immutable/chunks/CFB91JwL.js","_app/immutable/chunks/CQP9OykH.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/blog/[slug]",
				pattern: /^\/blog\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
