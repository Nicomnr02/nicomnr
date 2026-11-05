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
		client: {start:"_app/immutable/entry/start.CY9z1ADv.js",app:"_app/immutable/entry/app.CkmbbMst.js",imports:["_app/immutable/entry/start.CY9z1ADv.js","_app/immutable/chunks/-cDUSoIF.js","_app/immutable/chunks/B9Txs8Sd.js","_app/immutable/entry/app.CkmbbMst.js","_app/immutable/chunks/-cDUSoIF.js","_app/immutable/chunks/CWSUXC_K.js","_app/immutable/chunks/C1i4QPFg.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
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
