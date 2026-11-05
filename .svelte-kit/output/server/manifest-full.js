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
		client: {start:"_app/immutable/entry/start.BemYDXcz.js",app:"_app/immutable/entry/app.CVDDSF_B.js",imports:["_app/immutable/entry/start.BemYDXcz.js","_app/immutable/chunks/BBtnPHMu.js","_app/immutable/chunks/CCILAeYm.js","_app/immutable/entry/app.CVDDSF_B.js","_app/immutable/chunks/BBtnPHMu.js","_app/immutable/chunks/BNALA6Fr.js","_app/immutable/chunks/CuAJVdsQ.js","_app/immutable/chunks/BMh70ckA.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
