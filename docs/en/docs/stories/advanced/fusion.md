# Fusion


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
         <td><span class="nowrap"> fusion &nbsp; <span class="props-table-required">Required</span> </span></td>
         <td><code>Fusion</code></td>
         <td>Fusion library to be used</td>
      </tr>
   </tbody>
</table>


## Rendering your story

Fusion stories will be renderer by calling the `story` function *once*.<br></br><br></br>
When they are executed, Fusion components need to be created in the target frame that can be found in the `props` table.


::: code-group
 
```lua [Luau] {4-8}
local story = {
   fusion = Fusion,
   controls = controls,
   story = function(props)
      local component = Fusion.New "Frame" {
         Parent = props.target,
      }
   end
}

return story
```
 
```tsx [Roblox-TS] {4-8}
const story = {
   fusion: Fusion,
   controls: controls,
   story: (props: InferFusionProps<typeof controls>) => {
      const component = Fusion.New("Frame")({
         Parent: props.target,
      })
   }
}

export = story;
```

:::

## Using controls

UI Labs will create `Fusion.Value`'s for every control and it will update them when the control changes. These controls will be available in the `props` table.

::: code-group
 
```lua [Luau] {12}
local controls = {
   Visible = true
}

local story = {
   fusion = Fusion,
   controls = controls,
   story = function(props)
      local component = Fusion.New "Frame" {
         Parent = props.target,
         Size = UDim2.fromOffset(200, 100),
         Visible = props.controls.Visible -- This will be a Fusion.Value<boolean>
      }
   end
}

return story
```
 
```tsx [Roblox-TS] {12}
const controls = {
   Visible: true
}

const story = {
   fusion: Fusion,
   controls: controls,
   story: (props: InferFusionProps<typeof controls>) => {
      const component = Fusion.New("Frame")({
         Parent: props.target,
         Size: UDim2.fromOffset(200, 100),
         Visible: props.controls.Visible // This will be a Fusion.Value<boolean>
      })
   }
}

export = story;
```

:::

## Cleaning up
 
After the function is executed, it can return two things:

-   A Roblox instance that will be destroyed when the story is unmounted
-   A cleanup function that will be called when the story is unmounted


::: details Example
::: code-group
 
```lua [Luau] {9-11}
local story = {
   fusion = Fusion,
   controls = controls,
   story = function(props)
      local component = Fusion.New "Frame" {
         Parent = props.target,
      }
      
      return function()
         component:Destroy()
      end
   end
}

return story
```
 
```tsx [Roblox-TS] {9-11}
const story = {
   fusion: Fusion,
   controls: controls,
   story: (props: InferFusionProps<typeof controls>) => {
      const component = Fusion.New("Frame")({
         Parent: props.target,
      })
      
      return () => {
         component.Destroy()
      }
   }
}

export = story;
```

:::

## Using Fusion 0.3

Fusion 0.3 introduced scopes as a way to cleanup multiple objects. You can acccess the scope where the controls are created by using the `scope` key in the `props` table.

This scope will be destroyed with `Fusion.doCleanup` when the story is unmounted. This implies that the cleanup function is not needed in most cases, because of this, the cleanup function/instance can be optional.


::: warning Cleanup
Not returning a cleanup in <span class="item-description">Fusion 0.2</span> will result in a warning.
:::


::: details Example
::: code-group
 
```lua [Luau] {9}
local Fusion = require(...)

local controls = { ... }

local story = { 
   fusion = Fusion,
   controls = controls,
   story = function(props)
      local scope = props.scope

      local value = scope:Value("foo")
      local component = scope:New "Frame" {
         Parent = props.target,
      }
      -- cleanup function is not needed
   end,
}

return story
```
 
```tsx [Roblox-TS] {12-14}
// Waiting for Fusion 0.3 in roblox-ts
```
:::

## Using the Story Creator

You can use the Story Creator in the [Utility Package](/docs/installation.md#installing-the-utility-package) to create your story. These will infer the control types for Roblox-TS.

<span class="type-declaration"><span class="type-namespace">UILabs</span>
<span class="type-name">.</span><span class="type-function-name">CreateFusionStory</span>(<span class="type-name">info</span>,
<span class="type-name">story</span>)<span class="type-name">:</span><span class="type-highlight">FusionStory</span></span>

::: details Example

::: code-group
 
```lua [Luau]
local Fusion = require(...)

local UILabs = require(...)
local CreateFusionStory = UILabs.CreateFusionStory

local controls = { ... }

local story = CreateFusionStory({ 
   fusion = Fusion,
   controls = controls,
}, function(props)
   local component = Fusion.New "Frame" {
      Parent = props.target,
   }
   
   return function()
      component:Destroy()
   end
end)

return story
```
 
```tsx [Roblox-TS]
import Fusion from "@rbxts/fusion"
import { CreateFusionStory } from "@rbxts/ui-labs"

const controls = { ... }

const story = CreateFusionStory({
   fusion: Fusion,
   controls: controls,
}, (props: InferFusionProps<typeof controls>) => {
   const component = Fusion.New("Frame")({
      Parent: props.target,
   })
   
   return () => {
      component.Destroy()
   }
})

export = story;
```

:::
