const defaultOpts = {
	name: "error", // The function name to bind to the response object
	status: 400, // The global status code to return
	logger: console.log, // The logging function to use for errors
	logging: false // Whether or not to log to the logger
};

function parseArgs(args) {
	let opts = { ...defaultOpts }; // Prepare the options to be populated

	for (let arg of args) {
		if (typeof arg === "string" || arg instanceof String) opts.name = arg;
		else if (typeof arg === "number") opts.status = arg;
		else if (typeof arg === "boolean") opts.logging = arg;
		else if (typeof arg === "function") opts.logger = arg;
		else if (arg instanceof Array) throw new TypeError("You cannot use an array for options");
		else opts = { ...opts, ...arg }; // Opts must be an object, so merge it with the default options
	}

	return opts;
}

/**
 * Returns the function that is bound to the configured handler. It is responsible
 * for implementing the function that decides how to handle errors.
 */
function createHandler(res, opts) {
	return function(defaultStatus = opts.status) {
		return function(err) {
			if (opts.logger && opts.logging) opts.logger(err);

			if (typeof err === "string" || err instanceof String) handleString();
			else if (typeof err === "number") handleNumber();
			else if (err instanceof Array) handleArray();
			else if (err instanceof Error) handleError();
			else handleObject();

			function handleString() {
				res.status(defaultStatus).send(err);
			}

			function handleNumber() {
				res.sendStatus(err);
			}

			function handleError() {
				res.sendStatus(500);
				throw err; // This is an actual error that we didn't throw ourselves
			}

			function handleArray() {
				let status = defaultStatus;
				let body = null;

				for (let opt of err) {
					if (typeof opt === "number") status = opt;
					else if (typeof opt === "string" || opt instanceof String) body = opt;
				}

				if (body) res.status(status).send(body);
				else res.sendStatus(status);
			}

			function handleObject() {
				let body = err.body || err.message || err.b || err.m || err.r;
				let status = err.status || err.code || err.s || err.c || defaultStatus;

				if (body) res.status(status).send(body);
				else res.sendStatus(status);
			}
		};
	};
}

/**
 * Creates a new instance of the response catcher middleware and binds it to the
 * specified method on the express `res` object.
 *
 * Multiple options can be supplied, either in the form of an options object
 * that includes the listed options below, or as individual elements such as string
 * for changing the `name` to bind, or as a number for changing the default `status`.
 *
 * Options:
 * - `name` The function name to bind to the `res` object
 * - `status` The default status code to return
 * - `logger` The logging function to use for errors
 * - `logging` Whether or not to enable logging
 */
module.exports = function(...args) {
	opts = parseArgs(args);

	return function(req, res, next) {
		if (res[opts.name] !== undefined) throw new Error(`"res.${opts.name}" is already bound to another ${typeof res[opts.name]}`);
		res[opts.name] = createHandler(res, opts); // Create and bind the handler
		next();
	};
};
