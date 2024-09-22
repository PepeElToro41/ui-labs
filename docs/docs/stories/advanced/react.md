# React / Roact
   
## Providing your library
   
To provide your library you will need to add the following keys to your story table:
   
### Using React

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
         <td><span class="nowrap"> react &nbsp; <span class="props-table-required">Required</span> </span></td>
         <td><code>ReactRoblox</code></td>
         <td>React library to be used</td>
      </tr>
      <tr>
         <td><span class="nowrap"> reactRoblox &nbsp; <span class="props-table-required">Required</span> </span></td>
         <td><code>ReactRoblox</code></td>
         <td>ReactRoblox library to be used</td>
      </tr>
      <tr>
         <td valign="top"><span class="nowrap"> renderer &nbsp; <span class="props-table-optional">Optional</span> </span></td>
         <td valign="top"><span class="nowrap"><code>"deferred" | "legacy"</code></span></td>
         <td>
            The type of renderer that will be used. <br/><br/>
            <div class="item-description">
               <b>deferred</b>: <code> ReactRoblox.createRoot()`</code><br/> will be used <span class="tiphelp">&nbsp;(default)</span>    
            </div>
            <br/>
             <div class="item-description">
               <b>legacy</b>: <code> ReactRoblox.createLegacyRoot()`</code><br/> will be used  
            </div>
         </td>
      </tr>
   </tbody>
</table>
   
### Using Roact

<table style="width: fit-content;">
   <thead> 
      <tr>
         <th>Key</th>
         <th>Type</th>
         <th width="100%">Description</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><span class="nowrap"> roact &nbsp; <span class="props-table-required">Required</span> </span></td>
         <td><code>Roact</code></td>
         <td>Roact library to be used</td>
      </tr>
   </tbody>
</table>


## Rendering your story


React and Roact stories will be rendered by calling the `story` function everytime the story [Controls]() change.
This function will receive a `props` table that will contain the Controls values.

The function will return a `React.Element` to be rendered.


::: code-group

```lua [Luau]
local story = {
   react = React,
   reactRoblox = ReactRoblox,
   controls = controls,
   story = function(props)
      local component = React.createElement("Frame", {})
      return component
   end
}
```
 
```tsx [Roblox-TS]
const story = {
   react: React,
   reactRoblox: ReactRoblox,
   controls: controls,
   story: (props: InferProps<typeof controls>) => {
      const component = <frame />
      return component
   }, 
}
``` 
 
:::

## Using Controls

UI Labs will pass the control values in the `controls` key of the <span class="item-description">props</span> table to your story.

::: code-group
 
```lua [Luau] {7}
local controls = {
   Visible = true,
}

local story = {
   react = react,
   reactRoblox = reactRoblox,
   controls = controls,
   story = function(props)
      local component = React.createElement("Frame", {
         Visible = props.controls.Visible
      })

      return component
   end
}
```
 
```tsx [Roblox-TS] {7}
const controls = {
   Visible: true,
}

const story = {
   react: React,
   reactRoblox: ReactRoblox,
   controls: controls,
   story: (props: InferFusionProps<typeof controls>) => {
      const component = <frame Visible={props.controls.Visible} />

      return component
   }
}
```

:::


## Examples


::: details React

::: code-group

```lua [Luau]
local React = require(...)
local ReactRoblox = require(...)

local controls = { ... }

local story = {
   react = React,
   reactRoblox = ReactRoblox,
   controls = controls,
   story = function(props)
      local component = React.createElement("Frame", {})
      return component
   end 
}
```
 
```tsx [Roblox-TS]
import React from "@rbxts/react"
import ReactRoblox from "@rbxts/react-roblox"

const controls = { ... }

const story = {
   react: React, 
   reactRoblox: ReactRoblox,
   controls: controls,
   story: (props: InferProps<typeof controls>) => {
      const component = <frame />
      return component
   },
}
```
:::

::: details Roact

::: code-group

```lua [Luau]
local Roact = require(...)

local controls = { ... }

local story = {
   roact = Roact,
   controls = controls,
   story = function(props)
      local component = Roact.createElement("Frame", {})
      return component
   end 
}
```
 
```tsx [Roblox-TS]
import Roact from "@rbxts/roact"

const controls = { ... }

const story = {
   roact: Roact, 
   controls: controls,
   story: (props: InferProps<typeof controls>) => {
      const component = <frame />
      return component
   },
}
```
:::


## Using the Story Creator

You can use the Story Creator in the [Utility Package](/docs/installation.md#installing-the-utility-package) to create your story. These will infer the control types for Roblox-TS.

<span class="type-declaration"><span class="type-namespace">UILabs</span>
<span class="type-name">.</span><span class="type-function-name">CreateReactStory</span>(<span class="type-name">info</span>,
<span class="type-name">story</span>)<span class="type-name">:</span><span class="type-highlight">StoryTable</span></span>

<span class="type-declaration"><span class="type-namespace">UILabs</span>
<span class="type-name">.</span><span class="type-function-name">CreateRoactStory</span>(<span class="type-name">info</span>,
<span class="type-name">story</span>)<span class="type-name">:</span><span class="type-highlight">StoryTable</span></span>

### Examples
::: details React
::: code-group

```lua [Luau]
local React = require(...)
local ReactRoblox = require(...)

local UILabs = require(...)
local CreateReactStory = UILabs.CreateReactStory

local story = CreateReactStory({ 
   react = React,
   reactRoblox = ReactRoblox,
   controls = {},
}, function(props)
   local component = React.createElement("Frame", {})
   return component
end)
```
 
```tsx [Roblox-TS]
import React from "@rbxts/react"
import ReactRoblox from "@rbxts/react-roblox"

import { CreateReactStory } from "@rbxts/ui-labs"

const story = CreateReactStory({
   react: React,
   reactRoblox: ReactRoblox,
   controls: {},
}, (props) => {
   const component = <frame />
   return component
})
```

:::


::: details Roact
::: code-group

```lua [Luau]
local Roact = require(...)

local UILabs = require(...)
local CreateRoactStory = UILabs.CreateRoactStory

local story = CreateRoactStory({ 
   roact = Roact,
   controls = {},
}, function(props)
   local component = Roact.createElement("Frame", {})
   return component
end)
```
 
```tsx [Roblox-TS]
import Roact from "@rbxts/roact"

import { CreateRoactStory } from "@rbxts/ui-labs"

const story = CreateRoactStory({
   roact: roact,
   controls: {},
}, (props) => {
   const component = <frame />
   return component
})

```

:::