This folder contains the high order functions that manipulate the state of the app.

- Dispatchers inside `src/store` should only change the state of their own atoms.

- Consumers inside `src/store` should only read the state of their own atoms.

- Consumers and Dispatchers should be pure, meaning they should not have any side effects or depend on/modify anything else.

- Dispatchers should instantly update the state and not return any value. There's an exception to this rule with utility functions that can be used by dispatchers and in other code.

---

Because of this, `src/system` will be the place where the entire app state is accessed/manipulated, allowing you to manipulate different atoms.

Quick example:
   "Keep View In Viewport" is a plugin setting, trying to read this state in `store/story-previews` dispatchers to know if it should keep the state is incorrect, and trying to save any "LastestViewOnViewport" state in there is also incorrect. These high order functions should be used