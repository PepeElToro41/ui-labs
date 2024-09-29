# Vide


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
         <td><span class="nowrap"> vide &nbsp; <span class="props-table-required">Required</span> </span></td>
         <td><code>Vide</code></td>
         <td>Vide library to be used</td>
      </tr>
   </tbody>
</table>


## Rendering your story

Vide stories will be renderer by calling the `story` function *once*. The story function will be called inside a stable scope that will be destroyed when the story is unmounted.

You can return an instance that will be applied as children on the target frame.


::: code-group

```lua [Luau]
local story = {
   vide = Vide,
   story = function(props)
      return Vide.create "Frame" {
         Size = UDim2.fromOffset(200, 100),
      }
   end
}

```

```tsx [Roblox-TS]
const story = {
   vide: Vide,
   story: (props: {}) => {
      return <frame Size={UDim2.fromOffset(200, 100)} />
   }
}

```

:::


Additionally, you can use the `target` key inside the `props` table to get the target frame.

This way you can set the parent of the component to the target frame and return `nil`.


::: details Example

::: code-group

```lua [Luau]
local story = {
   vide = Vide,
   story = function(props)
      local frame = Vide.create "Frame" {
         Size = UDim2.fromOffset(200, 100),
         Parent = props.target
      }

      return nil
   end
}
```

```tsx [Roblox-TS]
const story = {
   vide: Vide,
   story: (props: {}) => {
      const frame = (
         <frame
            Size={UDim2.fromOffset(200, 100)} 
            Parent={props.target}
         />
      );

      return undefined
   }
}
```

:::

## Using controls

UI Labs will create `Vide.Source`'s for every control and it will update them when the control changes. These controls will be available in the `props` table.

::: code-group
 
```lua [Luau] {11}
local controls = {
   Visible = true
}

local story = {
   vide = Vide,
   controls = controls,
   story = function(props)
      return Vide.create "Frame" {
         Size = UDim2.fromOffset(200, 100),
         Visible = props.controls.Visible -- This will be a Vide.Source<boolean>
      }
   end
}
```
 
```tsx [Roblox-TS] {11}
const controls = {
   Visible: true
}

const story = {
   vide: Vide,
   controls: controls,
   story: (props: InferVideProps<typeof controls>) => {
      return (<frame
         Size={UDim2.fromOffset(200, 100)}
         Visible={props.controls.Visible} // This will be a Vide.Source<boolean>
      />)
   }
}
```

:::

## Cleaning up
 
The story function is called inside a stable, this means that you can use `Vide.effect` or `Vide.cleanup` to detect when the story is getting unmounted.

::: details Example
::: code-group
 
```lua [Luau] {6-8}
local story = {
   vide = Vide,
   controls = controls,
   story = function(props)

      Vide.cleanup(function()
         print("Story is getting unmounted")
      end)

      return ...
   end
}
```
 
```tsx [Roblox-TS] {6-8}
const story = {
   vide: Vide,
   controls: controls,
   story: (props: InferVideProps<typeof controls>) => {

      Vide.cleanup(() => {
         print("Story is getting unmounted")
      })

      return ...
   }
}
```

:::


## Using the Story Creator

You can use the Story Creator in the [Utility Package](/docs/installation.md#installing-the-utility-package) to create your story. These will infer the control types for Roblox-TS.

<span class="type-declaration"><span class="type-namespace">UILabs</span>
<span class="type-name">.</span><span class="type-function-name">CreateVideStory</span>(<span class="type-name">info</span>,
<span class="type-name">story</span>)<span class="type-name">:</span><span class="type-highlight">VideStory</span></span>

::: details Example

::: code-group
 
```lua [Luau]
local Vide = require(...)

local UILabs = require(...)
local CreateVideStory = UILabs.CreateVideStory

local controls = { ... }

local story = CreateVideStory({ 
   vide = Vide,
   controls = controls,
}, function(props)

   return Vide.create "Frame" {
      Size = UDim2.fromOffset(200, 100),
   }
end)
```
 
```tsx [Roblox-TS]
import Vide from "@rbxts/vide"
import { CreateVideStory } from "@rbxts/ui-labs"

const controls = { ... }

const story = CreateVideStory({
   vide: Vide,
   controls: controls,
}, (props: InferVideProps<typeof controls>) => {

   return <frame 
      Size={UDim2.fromOffset(200, 100)}
   />
})

```

:::
