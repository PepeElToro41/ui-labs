# Fusion

## Cómo Proporcionar la Librería

Para proporcionar tu librería, necesitarás agregar las siguientes entradas a la tabla de tu historia:

<table>
   <thead> 
      <tr>
         <th>Indice</th>
         <th>Tipo</th>
         <th width="100%">Descripión</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><span class="nowrap"> fusion &nbsp; <span class="props-table-required">Obligatorio</span> </span></td>
         <td><code>Fusion</code></td>
         <td>La librería de Fusion que será utilizada</td>
      </tr>
   </tbody>
</table>

## Cómo Renderizar Historias

Las historias de Fusion ejecutaran la función `story` _una única vez_.

Cuando se ejecute, los componentes de Fusion deben ser creados dentro del objetivo (`target`) que se encuentra en la tabla `props`.

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
		});
	},
};

export = story;
```

:::

## Cómo Usar Controles

UI Labs creará un `Fusion.Value` para cada control y los actualizará cuando el control cambie. Estos controles estarán disponibles en la tabla `props`.

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
         Visible = props.controls.Visible -- Este será un Fusion.Value<boolean>
      }
   end
}

return story
```

```tsx [Roblox-TS] {12}
const controls = {
	Visible: true,
};

const story = {
	fusion: Fusion,
	controls: controls,
	story: (props: InferFusionProps<typeof controls>) => {
		const component = Fusion.New("Frame")({
			Parent: props.target,
			Size: UDim2.fromOffset(200, 100),
			Visible: props.controls.Visible, // Este será un Fusion.Value<boolean>
		});
	},
};

export = story;
```

:::

## Limpieza

Luego de ejecutar la función, esta puede regresar 2 tipos de valores:

-   Una instancia de Roblox que será destruida al desmontar la historia
-   Una función de limpieza que será ejecutada al desmontar la historia

::: details Ejemplo
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
		});

		return () => {
			component.Destroy();
		};
	},
};

export = story;
```

:::

## Al Usar Fusion 0.3

Fusion 0.3 introdujo los _scopes_ como una manera de limpiar múltiples objetos. Puedes acceder al _scope_ usando el indice `scope` en la tabla `props`.

Este _scope_ será destruido con `Fusion.doCleanup` cuando la historia sea desmontada. Esto implica que la función de limpieza no es necesaria en la mayoría de los casos, por lo que la función/instancia de limpieza puede ser opcional.

::: warning Limpieza
Si no se proporciona una función de limpieza en <span class="item-description">Fusion 0.2</span> UI Labs arrojará una advertencia.
:::

::: details Ejemplo
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
      -- No es necesaria una función para limpiar
   end,
}

return story
```

```tsx [Roblox-TS] {12-14}
// Aún no se encuentra disponible Fusion 0.3 en roblox-ts
```

:::

## Cómo Usar el Creador de Historias

Puedes usar el Creador de Historias del [Paquete de Utilidades](/es/docs/installation.md#instalacion-del-paquete-de-utilidades) para crear tu historia. Estos inferirán los tipos de controles para Roblox-TS.

<span class="type-declaration"><span class="type-namespace">UILabs</span>
<span class="type-name">.</span><span class="type-function-name">CreateFusionStory</span>(<span class="type-name">info</span>,
<span class="type-name">story</span>)<span class="type-name">:</span><span class="type-highlight">FusionStory</span></span>

::: details Ejemplo

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
