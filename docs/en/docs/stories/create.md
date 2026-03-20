# Creating Stories

## Creating a Story

Stories are `ModuleScript`s that ends with `.story` in their name. These modules will tell <br/>UI Labs how to render your stories.

<img class="image-label" src="/docs/stories/storyname.png" alt="storyname" />

---

</br>Story modules should return the story you want to render. We will learn how stories are written in the next section.

::: code-group

```lua [Luau]
local story = ...
return story
```

```ts [Roblox-TS]
const story = ...
export = story;
```

:::

---

## Finding Stories

Once you have created your story, it will appear in UI Labs story explorer.

<img class="image-label" src="/docs/plugin/visualize/storyinexplorer.png" alt="storyinexplorer" />

::: tip Unknown Stories
Any story that hasnt been assigned to a [Storybook](/docs/storybooks.md) will be inside of <span class="item-description">Unknown Stories</span><br/>
You can use this story right now, but it's recommended to eventually group it in a **Storybook**.
:::