Contexts should be used to store state that will be shared across the entire app.

Deciding between a context or a store depends on this:

### Context

- The state is "alive", meaning that it changes by itself (by the provider really), You can use the Provider component to connect and control what is needed for this, and share a source containing the final data, an example of this is the module list or the story nodes. The module list requires constant searching for new modules, and the story nodes are generated from the module list and storybooks.

- The state creates something that needs to be cleaned up, for example, the user-input context that connects to user input, and creates signals for it

- The state can be overwritten, this means that the context can be re-provided, for example, the overlay context that is used to show overlays, and can be re-provided to re-define where the overlays should be rendered to, as when a new DockWidget is mounted.

### Store

- The state needs to be persistent/saved in plugin settings.

- The state is complex to edit by hand. Using the `dispatch` predefined functions will give you a way to manipulate the state in a predictable way. Trying to modify a context state is unreliable due to the lack of these dispatchers.
