# Iris


## Providing your library

To provide your library you will need to add the following keys to your story table:

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
         <td><span class="nowrap"> iris &nbsp; <span class="props-table-required">Required</span> </span></td>
         <td><code>Iris</code></td>
         <td>Iris library to be used</td>
      </tr>
   </tbody>
</table>


## Rendering your story

UI Labs will setup Iris to work in Stories and will create a `UserInputService` mock for you. The setup UI Labs will follow is based on [This Example](https://github.com/Michael-48/Iris/blob/main/stories/exampleStory.story.lua)

After this, the `story` function will be called once, here, you will connect Iris.

::: code-group
 
```lua [Luau] {5-7}
local story = {
   iris = Iris,
   story = function(props)

      Iris:Connect(function()
         Iris.ShowDemoWindow()
      end)
   end,
}
```

```ts [Roblox-TS] {5-7}
const story = {
   iris: Iris,
   story: (props: InferIrisProps<typeof controls>) => {

      Iris.Connect(() => {
         Iris.ShowDemoWindow()
      })
   },
}
```

:::

## Using controls

UI Labs will create `Iris.State`'s for every control and it will update them when the control changes. These controls will be available in the `props` table.

::: code-group
 
```lua [Luau] {10}
local controls = {
   Title = "Window",
   IsUncollapsed = false,
}

local story = {
   iris = Iris,
   controls = controls,
   story = function(props)
      local controls = props.controls

      Iris:Connect(function()
         Iris.Window({ controls.Title:get() }, { isUncollapsed = controls.IsUncollapsed })
            --- 
         Iris.End()
      end)
   end
}
```
 
```tsx [Roblox-TS] {10}
const controls = {
   Title: "Window",
   IsUncollapsed: false,
}

const story = {
   iris: Iris,
   controls: controls,
   story: (props: InferIrisProps<typeof controls>) => {
      const controls = props.controls

      Iris.Connect(() => {
         Iris.Window([ controls.Title.get() ], { isUncollapsed: controls.IsUncollapsed })
            ///
         Iris.End()
      })
   }
}
```

:::

## Cleaning up
 
UI Labs will automatically Shutdown Iris when the story is unmounted and destroy the `UserInputService` mock.

Additionally, if you need to cleanup, you can return a function that will be called when the story is unmounted.


::: details Example

::: code-group
 
```lua [Luau] {10-12}
local story = {
   iris = Iris,
   controls = controls,
   story = function(props)
      
      Iris:Connect(function()
         Iris.ShowDemoWindow()
      end)

      return function()
         print("Story is getting unmounted")
      end
   end
}
```
 
```tsx [Roblox-TS] {10-12}
const story = {
   iris: Iris,
   controls: controls,
   story: (props: InferIrisProps<typeof controls>) => {

      Iris.Connect(() => {
         Iris.ShowDemoWindow()
      })

      return () => {
         print("Story is getting unmounted")
      }
   }
}
```
:::

## Using the Story Creator

You can use the Story Creator in the [Utility Package](/docs/installation.md#installing-the-utility-package) to create your story. These will infer the control types for Roblox-TS.

<span class="type-declaration"><span class="type-namespace">UILabs</span>
<span class="type-name">.</span><span class="type-function-name">CreateIrisStory</span>(<span class="type-name">info</span>,
<span class="type-name">story</span>)<span class="type-name">:</span><span class="type-highlight">IrisStory</span></span>

::: details Example

::: code-group
 
```lua [Luau]
local Iris = require(...)

local UILabs = require(...)
local CreateIrisStory = UILabs.CreateIrisStory

local controls = { ... }

local story = CreateIrisStory({ 
   iris = Iris,
   controls = controls,
}, function(props)

   Iris:Connect(function()
      Iris.ShowDemoWindow()
   end)
end)
```
 
```tsx [Roblox-TS]
import Iris from "@rbxts/iris"
import { CreateIrisStory } from "@rbxts/ui-labs"

const controls = { ... }

const story = CreateIrisStory({
   fusion: Fusion,
   controls: controls,
}, (props: InferIrisProps<typeof controls>) => {

   Iris.Connect(() => {
      Iris.ShowDemoWindow()
   })
})

```

:::
