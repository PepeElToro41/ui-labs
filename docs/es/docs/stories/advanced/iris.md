# Iris

## Cómo Proporcionar la Biblioteca

Para proporcionar tu biblioteca, necesitarás agregar las siguientes claves a tu tabla de historias:

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
         <td><span class="nowrap"> iris &nbsp; <span class="props-table-required">Obligatorio</span> </span></td>
         <td><code>Iris</code></td>
         <td>La biblioteca de Iris que será utilizada</td>
      </tr>
   </tbody>
</table>


## Cómo Renderizar Historias

UI Labs configurará Iris para que funcione en las historias y creará una simulación de `UserInputService`. La configuración que seguirá UI Labs está basada en [Este Ejemplo](https://github.com/Michael-48/Iris/blob/main/stories/exampleStory.story.lua)

Después de esto, la función `story` será ejecutada una vez, dentro de esta debes conectar a Iris.

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

## Cómo Usar Controles

UI Labs creará un `Iris.State` para cada control y los actualizará cuando el control cambie. Estos controles estarán disponibles en la tabla `props`.

::: code-group
 
```lua [Luau] {10}
local controls = {
   Title = "Ventana",
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
   Title: "Ventana",
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

## Limpieza
 
UI Labs apagará automáticamente a Iris cuando la historia sea desmontada y destruirá la simulación de `UserInputService`.

Además, si necesitas hacer limpieza adicional, puedes regresar una función que se ejecutará cuando la historia sea desmontada.

::: details Ejemplo

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
         print("La historia está siendo desmontada")
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
         print("La historia está siendo desmontada")
      }
   }
}
```
:::

## Cómo Usar el Generador de Historias

Puedes usar el Generador de Historias del [Paquete de Utilidades](/es/docs/installation.md#instalacion-del-paquete-de-utilidades) para crear tu historia. Estos inferirán los tipos de controles para Roblox-TS.

<span class="type-declaration"><span class="type-namespace">UILabs</span>
<span class="type-name">.</span><span class="type-function-name">CreateIrisStory</span>(<span class="type-name">info</span>,
<span class="type-name">story</span>)<span class="type-name">:</span><span class="type-highlight">IrisStory</span></span>

::: details Ejemplo

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
