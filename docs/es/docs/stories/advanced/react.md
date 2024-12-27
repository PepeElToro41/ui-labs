# React / Roact
   
## Cómo Proporcionar la Biblioteca
   
Para proporcionar tu biblioteca, necesitarás agregar las siguientes claves a tu tabla de historias:
   
### Al Usar React

<table>
   <thead> 
      <tr>
         <th>Clave</th>
         <th>Tipo</th>
         <th width="100%">Descripción</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><span class="nowrap"> react &nbsp; <span class="props-table-required">Obligatorio</span> </span></td>
         <td><code>ReactRoblox</code></td>
         <td>La biblioteca de React que será utilizada</td>
      </tr>
      <tr>
         <td><span class="nowrap"> reactRoblox &nbsp; <span class="props-table-required">Obligatorio</span> </span></td>
         <td><code>ReactRoblox</code></td>
         <td>La biblioteca de ReactRoblox que será utilizada</td>
      </tr>
      <tr>
         <td valign="top"><span class="nowrap"> renderer &nbsp; <span class="props-table-optional">Opcional</span> </span></td>
         <td valign="top"><span class="nowrap"><code>"deferred" | "legacy"</code></span></td>
         <td>
            El tipo de renderizador que se utilizará. <br/><br/>
            <div class="item-description">
               <b>deferred</b>: <code> ReactRoblox.createRoot()`</code><br/> será utilizado <span class="tiphelp">&nbsp;(por defecto)</span>    
            </div>
            <br/>
             <div class="item-description">
               <b>legacy</b>: <code> ReactRoblox.createLegacyRoot()`</code><br/> será utilizado  
            </div>
         </td>
      </tr>
   </tbody>
</table>
   
### Al Usar Roact

<table style="width: fit-content;">
   <thead> 
      <tr>
         <th>Clave</th>
         <th>Tipo</th>
         <th width="100%">Descripción</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><span class="nowrap"> roact &nbsp; <span class="props-table-required">Obligatorio</span> </span></td>
         <td><code>Roact</code></td>
         <td>La biblioteca de Roact que será utilizada</td>
      </tr>
   </tbody>
</table>


## Cómo Renderizar Historias

Las historias de React y Roact serán renderizadas al ejectuar la función `story` cada vez que los [Controles]() de la historia cambien.
Esta función recibirá una tabla de propiedades (`props`) que contiene los valores de los controles.

La función proporcionará un `React.Element` que será renderizado.

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

return story
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

export = story;
``` 
 
:::

## Cómo Usar Controles

UI Labs proporcionará a la historia los valores de los controles en la clave `controls` de la tabla <span class="item-description">props</span>.

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

return story
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

export = story;
```

:::


## Ejemplos


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

return story
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

export = story;
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

return story
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

export = story;
```
:::


## Cómo Usar el Generador de Historias

Puedes usar el Generador de Historias del [Paquete de Utilidades](/es/docs/installation.md#instalacion-del-paquete-de-utilidades) para crear tu historia. Estos inferirán los tipos de controles para Roblox-TS.

<span class="type-declaration"><span class="type-namespace">UILabs</span>
<span class="type-name">.</span><span class="type-function-name">CreateReactStory</span>(<span class="type-name">info</span>,
<span class="type-name">story</span>)<span class="type-name">:</span><span class="type-highlight">ReactStory</span></span>

<span class="type-declaration"><span class="type-namespace">UILabs</span>
<span class="type-name">.</span><span class="type-function-name">CreateRoactStory</span>(<span class="type-name">info</span>,
<span class="type-name">story</span>)<span class="type-name">:</span><span class="type-highlight">RoactStory</span></span>

### Ejemplos
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

return story
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

export = story;
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

return story
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

export = story;
```

:::