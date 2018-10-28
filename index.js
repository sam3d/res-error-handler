const defaultOpts = {
	name: "error", // The function name to bind to the response object
	status: 400, // The global status code to return
};

function parseArgs(args, opts) {
	if (!opts) opts = { ...defaultOpts };

	for (arg of args) {
		if (typeof arg === "string" || arg instanceof String) opts.name = arg;
		else if (typeof arg === "number") opts.status = arg;
		else if (arg instanceof Array) throw "You cannot use an array for options";
		else opts = { ...opts, ...arg };
	}

	return opts;
}

function createHandler(req, res, opts) {
	return function(status = opts.status) {
		return function(err) {
			if (typeof err === "string" || err instanceof String) handleString();
			else if (typeof err === "number") handleNumber();
			else if (err instanceof Array) handleArray();
			else handleObject();

			function handleString() {
				
			}

			function handleNumber() {

			}

			function handleArray() {

			}

			function handleObject() {

			}
		};
	};
}

module.exports = function(...args) {
	opts = parseArgs(args);

	return function(req, res, next) {
		if (res[opts.name] !== undefined) throw new Error(`"res.${opts.name}" is already bound to another ${typeof res[opts.name]}`);
		res[opts.name] = createHandler(req, res, opts); // Create and bind the handler
		next();
	};
};
