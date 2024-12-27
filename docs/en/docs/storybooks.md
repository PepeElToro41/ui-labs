# Storybooks

UI Labs lets you create <span class="item-description">Storybooks</span> to group your stories together. They are a great way to organize your stories and make them easier to find.

By default, stories will be in the inside of <span class="item-description">Unknown Stories</span> if they haven't been assigned to a storybook.<br/>
While you can use them like that, it's recommended to eventually group them in storybooks.


::: details Flipbook support

In order to support [Flipbook Storybooks](https://flipbook-labs.github.io/flipbook/docs/writing-stories#storybook) and make migration easier, UI Labs uses a very similar format flipbook uses.

This has some key differences:

---

- You can't provide your UI Library in a storybook, only in the story itself. This limitation can be solved in the future.
- A `groupRoots`key is added.

:::

## Creating a Storybook

Similar to stories, storybooks are `ModuleScript`'s that ends with `.storybook` in their name. UI Labs will search for these modules in your game tree.

A storybook module should return a table with the following structure:

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
         <td><span class="nowrap"> name &nbsp; <span class="props-table-optional">Optional</span></span></td>
         <td><code>string</code></td>
         <td>Display name of the storybook. If not provided, the module name will be used</td>
      </tr>
      <tr>
         <td><span class="nowrap"> storyRoots &nbsp; <span class="props-table-required">Required</span> </span></td>
         <td><code>Instance[]</code></td>
         <td>
            Array of Instances where UI Labs will search for stories. Any subfolder will create a subfolder in
            UI Labs too.
         </td>
      </tr>
      <tr>
         <td><span class="nowrap"> groupRoots &nbsp; <span class="props-table-optional">Optional</span></span></td>
         <td><code><span class="nowrap">boolean</span></code></td>
         <td>If true, UI Labs will create subfolders for every entry in <span class="item-description">storyRoots</span></td>
      </tr>
      <tr>
         <td><span class="nowrap"> roact &nbsp; <span class="props-table-ignored">Ignored</span></span></td>
         <td><code><span class="nowrap">Roact</span></code></td>
         <td> You can't provide your UI Library here, Included here for Flipbook compatibility</td>
      </tr>
      <tr>
         <td><span class="nowrap"> react &nbsp; <span class="props-table-ignored">Ignored</span></span></td>
         <td><code><span class="nowrap">React</span></code></td>
         <td> You can't provide your UI Library here, Included here for Flipbook compatibility</td>
      </tr>
      <tr>
         <td><span class="nowrap"> reactRoblox &nbsp; <span class="props-table-ignored">Ignored</span></span></td>
         <td><code><span class="nowrap">ReactRoblox</span></code></td>
         <td> You can't provide your UI Library here, Included here for Flipbook compatibility</td>
      </tr>
   </tbody>
</table>

## Finding Stories


Let's suppose we have this folder structure:

::: info File Structure

<p style="line-height: 15px;"></p>

<div class="hierarchy-holder">
   <span class="hierarchy-tip">Icons: <a href="https://elttob.itch.io/vanilla-3-for-roblox-studio" target="_blank">Vainilla 3</a></span>

   <div class="hierarchy-item">
      <div class="custom-instance-serverscript"/>
      <span>ServerScriptService</span>
   </div>
      <div class="child-holder">
         <div class="hierarchy-item">
            <div class="custom-instance-folder"/>
            <span>GameStories</span>
         </div>
            <div class="child-holder">
               <div class="hierarchy-item">
                  <div class="custom-instance-module"/>
                  <span>GameStory1.story</span>
               </div>
               <div class="hierarchy-item">
                  <div class="custom-instance-module"/>
                  <span>GameStory2.story</span>
               </div>
            </div>
      </div>
   <div class="hierarchy-item">
      <div class="custom-instance-replicated"/>
      <span>ReplicatedStorage</span>
   </div>
      <div class="child-holder">
         <div class="hierarchy-item">
            <div class="custom-instance-folder"/>
            <span>OtherStories</span>
         </div>
            <div class="child-holder">
               <div class="hierarchy-item">
                  <div class="custom-instance-module"/>
                  <span>OtherStory1.story</span>
               </div>
               <div class="hierarchy-item">
                  <div class="custom-instance-module"/>
                  <span>OtherStory2.story</span>
               </div>
            </div>
      </div>
</div>

:::
 

Let's create a Storybook for this hierarchy:


::: code-group
```lua [Luau]
local storybook = {
   name = "Stories",
   storyRoots = {
      game.ServerScriptService.GameStories,
      game.ReplicatedStorage.OtherStories,
   },
}

return storybook
```

```ts [Roblox-TS]
const storybook: Storybook = {
   name: "Stories",
   storyRoots: [
      game.ServerScriptService.GameStories,
      game.ReplicatedStorage.OtherStories,
   ],
};

export = storybook;
```
:::


Now we can see our Stories organized in the UI Labs explorer:

<img class="image-label" src="/docs/storybook/storybookstories.png" alt="storybookstories" width="500"/>

## Grouping Story Roots

IF you want to group every `storyRoots` entry in a separated folder, you can set the `groupRoots` key to `true`.
This can allow you to organize different stories with a single storybook.

::: code-group
```lua [Luau] {7}
local storybook = {
   name = "Stories",
   storyRoots = {
      game.ServerScriptService.GameStories,
      game.ReplicatedStorage.OtherStories,
   },
   groupRoots = true,
}
```
```ts [Roblox-TS] {7}
const storybook: Storybook = {
   name: "Stories",
   storyRoots: [
      game.ServerScriptService.GameStories,
      game.ReplicatedStorage.OtherStories,
   ],
   groupRoots: true,
};
```

:::

Now we can see that every `storyRoots` entry is grouped in a separated folder:

<img class="image-label" src="/docs/storybook/groupedstories.png" alt="groupedstories.png" width="500"/>


Setting `groupRoots` to `true` will also add stories that are directly added in the `storyRoots` array.

This allows you to provide the stories directly in the array.

::: code-group
```lua [Luau] {7}
local storybook = {
   name = "Stories",
   storyRoots = game.ServerScriptService.GameStories:GetChildren(),
   groupRoots = true
}
```
```ts [Roblox-TS] {7}
const storybook: Storybook = {
   name: "Stories",
   storyRoots: game.ServerScriptService.GameStories.GetChildren(),
   groupRoots: true
};
```
:::

<img class="image-label" src="/docs/storybook/storyinroots.png" alt="groupedstories.png" width="500"/>
