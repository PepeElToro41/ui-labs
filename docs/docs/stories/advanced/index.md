# Advanced Stories

Advanced Stories are table stories that get mounted internally by UI Labs. They allow UI Labs to have more control and info over how your stories are rendered.

These stories also allows you to add [Controls](/docs/controls/adding.md) to edit properties of your story in real-time.

::: details Flipbook support
In order to support [Flipbook Stories](https://flipbook-labs.github.io/flipbook/docs/story-format) and make migration easier, UI Labs uses a very similar format flipbook uses.

This has some key differences:

---

-   The story library (`React` / `Roact` / `Fusion`) cant be provided in a storybook, only in the story itself. This limitation can be solved in the future.
-   The story name cant be provided here, therefore, the module name will be always used.<br/>This is because UI Labs would need to perform a Hot-Reload operation on every single story and update changes acordingly. This can be very expensive and unnecessary.

::

## Creating an Advanced Story

All advanced stories share a base format table structure.

<table>
   <thead> 
      <tr>
         <th>Key</th>
         <th>Type</th>
         <th width="100%">Description</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><span class="nowrap"> name &nbsp; <span class="props-table-ignored">Ignored</span> </span></td>
         <td><code>string</code></td>
         <td>Module name will be always used.<br/>Included here for Flipbook compatibility</td>
      </tr>
      <tr>
         <td><span class="nowrap"> summary &nbsp; <span class="props-table-optional">Optional</span> </span></td>
         <td><code>string</code></td>
         <td>
            Summary of the story, this allows <a href="https://create.roblox.com/docs/ui/rich-text" target="_blank">Rich Text</a>.
            <br/> Will be shown in the story preview 
         </td>
      </tr>
      <tr>
         <td><span class="nowrap"> controls &nbsp; <span class="props-table-optional">Optional</span></span></td>
         <td><code><span class="nowrap">{ string: Control }</span></code></td>
         <td>Table of control objects to be used in your story</td>
      </tr>
      <tr>
         <td><span class="nowrap"> story &nbsp; <span class="props-table-required">Required</span></span></td>
         <td><code><span class="nowrap">(...args: any) => any</span></code></td>
         <td>	Function that will render your story.<br/>The implementation will vary</td>
      </tr>
   </tbody>
</table>

Let's see an example:

::: code-group

```lua [Luau]
local story = {
   summary = "This is a summary",
   controls = nil, -- We'll learn about controls later
   story = function()
      ...
   end
}

return story
```

```ts [Roblox-TS]
const story = {
   summary: "This is a summary",
   controls: undefined, // We'll learn about controls later
   story: () => {
      ...
   },
}

export = story
```

:::

## Story Types

You will need to add additional keys depending on the story type you are using.

UI Labs currently supports 3 different types of advanced stories:

-   [Roact / React Stories](./react.md)
-   [Fusion Stories](./fusion.md)
-   [Generic Stories](./generic.md) <span class="tiphelp">&nbsp; This story is generic and customizable, doesn't require a library</span>
