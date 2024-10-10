This folder contains the high order functions that manipulate the state of the app.

- Dispatchers inside `src/store` should only change the state of their own atoms.

- Consumers inside `src/store` should only read the state of their own atoms.

- Consumers and Dispatchers should be pure, meaning they should not have any side effects or depend/modify states of other atoms.

- Dispatchers should instantly update the state, thus they should not return any value. There's an exception to this rule with utility functions that can be used by multiple dispatchers.

Because of this, `src/system` will be the place where the entire app state is accessed/manipulated, allowing you to manipulate different atoms.