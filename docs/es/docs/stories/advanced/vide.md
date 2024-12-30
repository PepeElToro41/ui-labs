# Vide

## Cómo Proporcionar la Biblioteca

Para proporcionar tu biblioteca, necesitarás agregar las siguientes entradas a la tabla de tu historia:

<table>
   <thead> 
      <tr>
         <th>Indice</th>
         <th>Tipo</th>
         <th width="100%">Descripción</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><span class="nowrap"> vide &nbsp; <span class="props-table-required">Obligatorio</span> </span></td>
         <td><code>Vide</code></td>
         <td>La biblioteca de Vide que será utilizada</td>
      </tr>
   </tbody>
</table>

## Cómo Renderizar Historias

Las historias de Vide ejecutaran la función `story` _una única vez_.

La función de la historia será ejecutada dentro de un _scope_ estable que será destruido cuando la historia sea desmontada.

Puedes regresar una instancia que será ubicada dentro del `target` automaticamente

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
		return <frame Size={UDim2.fromOffset(200, 100)} />;
	},
};
```

:::

Además puedes hacer uso de `target` que se encuentra en la tabla `props` para obtener el Frame `target`.

De esta manera, puedes ubicar la historia dentro de `target` y regresar `nil`.

::: details Ejemplo

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
		const frame = <frame Size={UDim2.fromOffset(200, 100)} Parent={props.target} />;

		return undefined;
	},
};
```

:::

## Cómo Usar Controles

UI Labs creará un `Vide.Source` para cada control y lo actualizará cuando el control cambie. Estos controles estarán disponibles en la tabla `props`.

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
         Visible = props.controls.Visible -- Este será un Vide.Source<boolean>
      }
   end
}
```

```tsx [Roblox-TS] {11}
const controls = {
	Visible: true,
};

const story = {
	vide: Vide,
	controls: controls,
	story: (props: InferVideProps<typeof controls>) => {
		return (
			<frame
				Size={UDim2.fromOffset(200, 100)}
				Visible={props.controls.Visible} // Este será un Vide.Source<boolean>
			/>
		);
	},
};
```

:::

## Limpieza

La función de la historia es ejecutada dentro de un `scope` estable, lo que significa que puedes usar `Vide.effect` o `Vide.cleanup` para detectar cuándo la historia este siendo desmontada.

::: details Ejemplo
::: code-group

```lua [Luau] {6-8}
local story = {
   vide = Vide,
   controls = controls,
   story = function(props)

      Vide.cleanup(function()
         print("La historia está siendo desmontada")
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
         print("La historia está siendo desmontada")
      })

      return ...
   }
}
```

:::

## Cómo Usar el Creador de Historias

Puedes usar el Creador de Historias del [Paquete de Utilidades](/es/docs/installation.md#instalacion-del-paquete-de-utilidades) para crear tu historia. Estos inferirán los tipos de controles para Roblox-TS.

<span class="type-declaration"><span class="type-namespace">UILabs</span>
<span class="type-name">.</span><span class="type-function-name">CreateVideStory</span>(<span class="type-name">info</span>,
<span class="type-name">story</span>)<span class="type-name">:</span><span class="type-highlight">VideStory</span></span>

::: details Ejemplo

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
