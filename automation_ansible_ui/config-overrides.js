const { injectBabelPlugin } = require('react-app-rewired');

module.exports = function override(config, env) {
	config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
	config = rewireLess.withLoaderOptions({
		modifyVars: { "@primary-color": "#1DA57A" },
		 })(config, env);
	return config;
	  };

