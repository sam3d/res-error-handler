# res-error-handler
_Easy async error handling in Express_

```console
npm install --save res-error-handler
```

### Introduction
`res-error-handler` is an extremely flexible `.catch()` error handler for promise-based express request flows.

It should be used where you would have multiple `.then()` operations in a request and need to be able to throw and handle many kinds of errors.

By default it attaches itself to `res.error()` (though this can be configured).

### Most basic usage examples

```javascript
const express = require("express");
const app = express();

const resErrorHandler = require("res-error-handler");
app.use(resErrorHandler());

app.get("/", (req, res) => {
	findUser()
		.then(checkUser)
		.then(andThenThisThing)
		.catch(res.error());

	async function findUser() {
		let user = await db.users.find(req.body.id);
		if (!user) throw 404;

		return user;
	}

	async function checkUser(user) {
		if (!user.isAuthenticated) throw [401, "User is not authenticated"];
		else if (user.alreadyExists) throw ["User already exists", 409];
		else if (user.username.length > 8) throw "Username is too long";
		else if (serverErrorSomewhere) throw { status: 500, body: "Sorry, we had an error somewhere!" };
	}

	async function andThenThisThing() {
		// ...
	}
});
```

## Configuration

### Instantiation
On instantiation of the middleware function, you can set the name of the function on the `res` object (defaults to `res.error`) and the default status code response if one isn't provided (defaults to `400`).

```javascript
const resErrorHandler = require("res-error-handler");

// Different instantiation examples
app.use(resErrorHandler());
app.use(resErrorHandler(400));
app.use(resErrorHandler("errorHandler"));
app.use(resErrorHandler(400, "errorHandler"));
app.use(resErrorHandler("errorHandler", 400));
app.use(resErrorHandler(400, { name: "errorHandler" }));
app.use(resErrorHandler("errorHandler", { status: 400 }));
app.use(resErrorHandler({ name: "errorHandler", status: 400 }));
```

### Creating the error
_Coming soon..._

### Ways to throw an error
_Coming soon..._
