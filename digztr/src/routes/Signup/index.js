module.exports = {
  path: '/signup',

  /**
     * getComponent
     * @param location
     * @param cb {Function} callback
     */
	getComponent(location, cb) {
		cb(null, require('./Signup').default);
	},
}
