# Historias Genéricas

Las historias genéricas son historias que se pueden usar en casi cualquier caso. No están vinculadas a una biblioteca específica y son lo suficientemente flexibles como para adaptarse a casi cualquier situación

## Cómo Renderizar Historias

Las historias genéricas necesitarán un nuevo indice llamado `render` en lugar de `story`. Esta diferencia de nombres le indicará a UI Labs que se trata de una historia genérica y no se esperará ninguna biblioteca específica.

Esta función se ejecutará una sola vez y recibirá una tabla `props` que contendrá los siguientes indices:

<div class="prop-description-holder">
   <span class="prop-description-title"><span class="prop-description-entry">target</span> <code>Frame</code><br/></span>
   <span class="prop-description-contents">Dónde debe ser montada la historia.</span>
</div>
<div class="prop-description-holder">
   <span class="prop-description-title"><span class="prop-description-entry">controls</span> <code>ControlValues</code><br/></span>
   <span class="prop-description-contents">Los valores de los controles con los que comenzó la historia.</span>
</div>
<div class="prop-description-holder">
   <span class="prop-description-title"><span class="prop-description-entry">converted</span> <code>ConvertedControls</code><br/></span>
   <span class="prop-description-contents">Objetos de control que UI Labs está utilizando internamente. No deben ser manipulados, pero son útiles para obtener información sobre estos.</span><br/><br/>
</div>
<div class="prop-description-holder">
   <span class="prop-description-title"><span class="prop-description-entry">subscribe</span> <code>(listener: Listener) => disconnect</code><br/></span>
   <span class="prop-description-contents">Se usa para suscribirse a los cambios en los controles. Esta es la manera en que puedes mantenerte al tanto de los cambios en los controles y actualizar tu historia en consecuencia.</span><br/><br/>
</div>

::: details Ejemplo

::: code-group

```lua [Luau]
local story = {
   controls = controls,
   render = function(props)
      local component = Instance.new("Frame")
      component.Size = UDim2.fromOffset(200, 100)
      component.Parent = props.target
   end
}

return story
```

```tsx [Roblox-TS]
const story = {
	controls: controls,
	render: (props: InferGenericProps<typeof controls>) => {
		const component = new Instance("Frame");
		component.Size = UDim2.fromOffset(200, 100);
		component.Parent = props.target;
	},
};
```

:::

## Limpieza

Luego de ejecutar la función, esta debe regresar una función de limpieza que será ejecutada al desmontar la historia.

::: code-group

```lua [Luau]
local story = {
   controls = controls,
   render = function(props)
      local component = Instance.new("Frame")

      return function() -- Limpia tu historia aquí
         component:Destroy()
      end
   end
}
```

```tsx [Roblox-TS]
const story = {
	controls: controls,
	render: (props: InferFusionProps<typeof controls>) => {
		const component = new Instance("Frame");

		return () => {
			// Limpia tu historia aquí
			component.Destroy();
		};
	},
};

export = story;
```

:::

## Como Detectar Cambios en los Controles

La función `subscribe` se puede utilizar para conectar un _callback_ que se ejecutará cada vez que los controles cambien. Este _callback_ recibirá dos argumentos:

-   values: `ControlValues`: Los valores actuales de los controles.
-   infos: `ControlInfos`: La información de lo actualizado, esto te dará los valores nuevos y antiguos de los controles.

Cuando `subscribe` se ejecuta, esta devolverá una función que se puede usar para desconectar el callback.

---

Puedes usar los valores de control para actualizar tu historia.

La información de los controles (`ControlInfos`) te dará los valores antiguos y nuevos de los controles, y puedes usarla para verificar cambios específicos en los controles.

<table>
   <thead> 
      <tr>
         <th>Clave</th>
         <th width="100%">Descripción</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><span class="nowrap"> __new </span></td>
         <td>el valor actual del control</td>
      </tr>
      <tr>
         <td><span class="nowrap"> __old </span></td>
         <td>el valor antiguo del control</td>
      </tr>
   </tbody>
</table>

::: code-group

```lua [Luau] {16-18}
local controls = {
   Visible = true,
}

local story = {
   controls = controls,
   render = function(props)
      local component = Instance.new("Frame")
      component.Size = UDim2.fromOffset(200, 100)
      component.Visible = props.controls.Visible -- primera actualización
      component.Parent = props.target

      local unsubscribe = props.subscribe(function(values, infos) -- // [!code focus:7]
         local info = infos.Visible -- Este será un GenericInfo<boolean>

         if (info.__new ~= info.__old) then
            component.Visible = info.__new
         end
      end)

      return function()
         component:Destroy()
      end
   end
}

return story
```

```tsx [Roblox-TS] {16-18}
const controls = {
	Visible: true,
};

const story = {
	controls: controls,
	render: (props: InferGenericProps<typeof controls>) => {
		const component = new Instance("Frame");
		component.Size = UDim2.fromOffset(200, 100);
		component.Visible = props.controls.Visible; // primera actualización
		component.Parent = props.target;

		const unsubscribe = props.subscribe((values, infos) => {
			// [!code focus:7]
			const info = infos.Visible; // Este será un GenericInfo<boolean>

			if (info.__new !== info.__old) {
				component.Visible = info.__new;
			}
		});

		return () => {
			component.Destroy();
		};
	},
};

export = story;
```

:::

### Utilidad `ListenControl`

UI Labs tiene una función de utilidad llamada `ListenControl(info, callback)` que realiza la comparación de valores antiguos y nuevos por ti. Simplemente ejecuta eta funcion dentro del _callback_ de `subscribe`y verificará si el control ha cambiado.

::: details Ejemplo
::: code-group

```lua [Luau]
local UILabs = require(...)
local ListenControl = UILabs.ListenControl

local controls = {
   Visible = true,
}

local story = {
   controls = controls,
   render = function(props)
      local component = Instance.new("Frame")
      component.Size = UDim2.fromOffset(200, 100)
      component.Visible = props.controls.Visible  -- primera actualización
      component.Parent = props.target

      props.subscribe(function(values, infos) -- // [!code focus:5]
         ListenControl(infos.Visible, function(newValue)
            component.Visible = newValue
         end)
      end)

      return function()
         component:Destroy()
      end
   end
}

return story
```

```tsx [Roblox-TS]
import { ListenControl, InferGenericProps } from "@rbxts/ui-labs";

const controls = {
	Visible: true,
};

const story = {
	controls: controls,
	render: (props: InferGenericProps<typeof controls>) => {
		const component = new Instance("Frame");
		component.Size = UDim2.fromOffset(200, 100);
		component.Visible = props.controls.Visible; // primera actualización
		component.Parent = props.target;

		props.subscribe((values, infos) => {
			// [!code focus:5]
			ListenControl(infos.Visible, (newValue) => {
				component.Visible = newValue;
			});
		});

		return () => {
			component.Destroy();
		};
	},
};

export = story;
```

:::

::: details Implementación
Así es como esta implementada la utilidad `ListenControl`, en caso de que la desees reimplementar tú mismo:

```lua [Luau]
local function ListenControl(info, callback)
   local oldValue = info.__old
   local newValue = info.__new

   if oldValue ~= newValue then
      callback(newValue)
   end
end
```

:::

## Cómo usar una Biblioteca Personalizada

Este tipo de historia no está vinculada a una biblioteca específica. Puedes usar cualquier biblioteca.

Hay algunas herramientas que UI Labs proporciona para ayudarte con esto.

### CreateControlStates

<span class="type-declaration"><span class="type-function-name">CreateControlStates</span>(<span class="type-name">converted</span>,
<span class="type-name">controls</span>,
<span class="type-name">creator</span>)</span>

Esta función utilizará el valor dentro de `converted` para crear estados (similares a `Fusion.Value`) que tu biblioteca usará.

---

::: code-group

```lua [Luau]
local UILabs = require(...)
local CreateControlStates = UILabs.CreateControlStates

-- Usaremos una biblioteca imaginaria llamada Lib para este ejemplo

local controls = { ... }

local story = {
   controls = controls,
   render = function(props)
      local states = CreateControlStates(props.converted, props.controls, function(value) -- // [!code focus:3]
         return Lib.State(value) -- Así es como la biblioteca crearía un estado
      end)

      return function()
         -- Limpieza
      end
   end
}

return story
```

```tsx [Roblox-TS]
import { CreateControlStates, InferGenericProps } from "@rbxts/ui-labs"

// Usaremos una biblioteca imaginaria llamada Lib para este ejemplo

const controls = { ... }

const story = {
   controls: controls,
   render: (props: InferGenericProps<typeof controls>) => {
      const states = CreateControlStates(props.converted, props.controls, (value) => { // [!code focus:3]
         return Lib.State(value) // Así es como la biblioteca crearía un estado
      })

      return () => {
         // Limpieza
      }
   }
}

export = story;
```

:::

::: details Implementación

Así es como esta implementada la utilidad `CreateControlStates`, en caso de que la desees reimplementar tú mismo:

```lua [Luau]
local function CreateControlStates(converted, controls, creator)
   local states = {}

   for key, control in pairs(converted) do
      local controlValue = controls[key]

      if control.EntryType == "ControlGroup" then -- "control" es un grupo de controles
         states[key] = CreateControlStates(control.Controls, controlValue, creator)
         continue
      end
      states[key] = creator(controlValue)
   end

   return states
end
```

:::

::: danger Tipos en Roblox-TS
El tipo para `CreateControlStates` no es posible en TypeScript ya que esto requiere Tipos de Mayor Orden (HKT) para inferirlo correctamente, lo cual TypeScript no soporta.
Sin embargo, hay una solución alternativa para esto.

::: details Solución alternativa

La función no podrá inferir el tipo de los estados, pero devolverá `any`, por lo que puedes convertirlo al tipo correcto.

UI Labs exporta un tipo `HKT` para hacer esto posible. Mas información en este [Blog Post](https://code.lol/post/programming/higher-kinded-types/)

La sintaxis es extraña, pero sigue los ejemplos a continuación.

---

::: code-group

```ts [Fusion Value]
import Fusion from "@rbxts/fusion";
import { HKT, InferCreatedControls } from "@rbxts/ui-labs";

const controls = {
	Visible: true,
	Value: "foo",
};

// utilizaremos la función "new" como la que lo crea, tendrá x como el tipo del control
interface FusionValueCreator extends HKT {
	new: (x: this["T"]) => Fusion.Value<typeof x>; // usa typeof x para obtener el tipo del control
}

// Este tendrá los tipos correctos, solo necesitamos convertirlo
type FusionValues = InferCreatedControls<typeof controls, FusionValueCreator>;

const states: FusionValues = CreateControlStates(props.converted, props.controls, (value) => {
	return Fusion.Value(value);
});

states.Visible; // Fusion.Value<boolean>
states.Value; // Fusion.Value<string>
```

```ts [Iris State]
import { State } from "@rbxts/iris/out/IrisDeclaration";
import { HKT, InferCreatedControls } from "@rbxts/ui-labs";

const controls = {
	Visible: true,
	Value: "foo",
};

// utilizaremos la función "new" para crear el tipo, tendrá x como el tipo del control
interface IrisStateCreator extends HKT {
	new: (x: this["T"]) => State<typeof x>; // usa typeof x para obtener el tipo del control
}

// Este tendrá los tipos correctos, solo necesitamos convertirlo
type IrisStates = InferCreatedControls<typeof controls, IrisStateCreator>;

const states: IrisStates = CreateControlStates(props.converted, props.controls, (value) => {
	return Iris.State(value);
});

states.Visible; // Iris.State<boolean>
states.Value; // Iris.State<string>
```

```ts [Vide Source]
import Vide from "@rbxts/vide";
import { HKT, InferCreatedControls } from "@rbxts/ui-labs";

const controls = {
	Visible: true,
	Value: "foo",
};

// utilizaremos la función "new" para crear el tipo, tendrá x como el tipo del control
interface VideSourceCreator extends HKT {
	new: (x: this["T"]) => Vide.Source<typeof x>; // usa typeof x para obtener el tipo del control
}

// Este tendrá los tipos correctos, solo necesitamos convertirlo
type VideSources = InferCreatedControls<typeof controls, VideSourceCreator>;

const states: VideSources = CreateControlStates(props.converted, props.controls, (value) => {
	return Vide.source(value);
});

states.Visible; // Vide.Source<boolean>
states.Value; // Vide.Source<string>
```

:::

### UpdateControlStates

<span class="type-declaration"><span class="type-function-name">UpdateControlStates</span>(<span class="type-name">states</span>,
<span class="type-name">converted</span>,
<span class="type-name">controls</span>,
<span class="type-name">updater</span>)</span>

Esta función actualizará los estados dados por `CreateControlStates` con los nuevos valores. Debe ser ejecutada dentro del callback `subscribe`.

---

::: code-group

```lua [Luau]
local UILabs = require(...)
local CreateControlStates = UILabs.CreateControlStates
local UpdateControlStates = UILabs.UpdateControlStates

-- Usaremos una biblioteca imaginaria llamada Lib para este ejemplo

local controls = { ... }

local story = {
    controls = controls,
    render = function(props)
        local states = CreateControlStates(props.converted, props.controls, function(value)
            return Lib.State(value) -- Así es como la biblioteca crearía un estado
        end)

        props.subscribe(function(values) -- // [!code focus:5]
            UpdateControlStates(states, props.converted, values, function(state, value)
                return state:set(value) -- Así es como la biblioteca actualizaría un estado
            end)
        end)

        return function()
            -- Limpieza
        end
   end
}

return story
```

```tsx [Roblox-TS]
import { CreateControlStates, UpdateControlStates, InferGenericProps } from "@rbxts/ui-labs"

// Usaremos una biblioteca imaginaria llamada Lib para este ejemplo

const controls = { ... }

const story = {
   controls: controls,
   render: (props: InferGenericProps<typeof controls>) => {
      const states = CreateControlStates(props.converted, props.controls, (value) => {
         return Lib.State(value) // Así es como la biblioteca crearía un estado
      })

      props.subscribe((values) => { // [!code focus:6]
         // el tipo de "state" es any, sin embargo, lo debes actualizar con el tipo que uses
         UpdateControlStates(states, props.converted, values, (state: Lib.State<any>, value) => {
            return state.set(value) // Así es como la biblioteca actualizaría un estado
         })
      })

      return () => {
         // Limpieza
      }
   }
}

export = story;
```

:::

::: details Implementación

Así es como esta implementada la utilidad `UpdateControlStates`, en caso de que la desees reimplementar tú mismo:

```lua [Luau]
local function UpdateControlStates(states, converted, controls, updater)
   for key, control in pairs(converted) do
      local controlValue = controls[key]

      if control.EntryType == "ControlGroup" then -- "control" es un grupo de controles
         UpdateControlStates(states[key], control.Controls, controlValue, updater)
         continue
      end
      updater(states[key], controlValue)
   end
end
```

:::

## Ejemplos

Veamos cómo podemos reimplementar las bibliotecas ya compatibles usando Historias Genéricas para familiarizarnos con su uso.

::: tip Consejo
Si vas a usar una biblioteca para tus historias, se recomienda abstraerla con tu propia utilidad para no tener que repetitir el mismo código una y otra vez.
:::

---

::: details React
::: code-group

```lua [Luau]
local React = require(...)
local ReactRoblox = require(...)

local controls = {
   Visible = true,
}

-- Esta sería el indice de la función `story`
local function RenderComponent(controls)
   return React.createElement("Frame", {
      Size = UDim2.fromOffset(200, 100),
      Visible = controls.Visible
   })
end

local story = {
   controls = controls,
   render = function(props)
      local component = RenderComponent(props.controls)
      local root = ReactRoblox.createRoot(props.target)
      root:render(component)

      props.subscribe(function(values)
         local newComponent = RenderComponent(values)
         root:render(newComponent)
      end)

      return function()
         root:unmount()
      end
   end
}

return story
```

```tsx [Roblox-TS]
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { InferGenericProps, InferControls } from "@rbxts/ui-labs";

const controls = {
	Visible: true,
};

// Esta sería el indice de la función `story`
function RenderComponent(controlList: InferControls<typeof controls>) {
	return <frame Size={UDim2.fromOffset(200, 100)} Visible={controlList.Visible} />;
}

const story = {
	controls: controls,
	render: (props: InferGenericProps<typeof controls>) => {
		const component = RenderComponent(props.controls);
		const root = ReactRoblox.createRoot(props.target);
		root.render(component);

		props.subscribe((values) => {
			const newComponent = RenderComponent(values);
			root.render(newComponent);
		});

		return () => {
			root.unmount();
		};
	},
};

export = story;
```

:::

::: details Roact
::: code-group

```lua [Luau]
local Roact = require(...)

local controls = {
   Visible = true,
}

-- Esta sería el indice de la función `story`
function RenderComponent(controlList)
    return Roact.createElement("Frame", {
        Size = UDim2.fromOffset(200, 100),
        Visible = controlList.Visible
    })
end

local story = {
    controls = controls,
    render = function(props)
        local component = RenderComponent(props.controls)
        local tree = Roact.mount(component, props.target)

        props.subscribe(function(values)
            local newComponent = RenderComponent(values)
            Roact.update(tree, newComponent)
        end)

        return function()
            React.unmount(tree)
        end
   end
}

return story
```

```tsx [Roblox-TS]
import Roact from "@rbxts/roact";
import { InferGenericProps, InferControls } from "@rbxts/ui-labs";

const controls = {
	Visible: true,
};

// Esta sería el indice de la función `story`
function RenderComponent(controlList: InferControls<typeof controls>) {
	return <frame Size={UDim2.fromOffset(200, 100)} Visible={controlList.Visible} />;
}

const story = {
	controls: controls,
	render: (props: InferGenericProps<typeof controls>) => {
		const component = RenderComponent(props.controls);
		const tree = Roact.mount(component, props.target);

		props.subscribe((values) => {
			const newComponent = RenderComponent(values);
			Roact.update(tree, newComponent);
		});

		return () => {
			React.unmount(tree);
		};
	},
};

export = story;
```

:::

::: details Fusion

Con Fusion, vamos a usar las utilidades de `CreateControlStates` y `UpdateControlStates`.

::: code-group

```lua [Luau]
local Fusion = require(...)

local UILabs = require(...)
local CreateControlStates = UILabs.CreateControlStates
local UpdateControlStates = UILabs.UpdateControlStates

local controls = {
   Visible = true,
}

local story = {
   controls = controls,
   render = function(props)
      local states = CreateControlStates(props.converted, props.controls, function(value)
         return Fusion.Value(value)
      end)

      local component = Fusion.New "Frame" {
         Parent = props.target,
         Size = UDim2.fromOffset(200, 100),
         Visible = states.Visible, -- Este será un Fusion.Value<boolean>
      }

      props.subscribe(function(values)
         UpdateControlStates(states, props.converted, values, function(state, value)
            state:set(value)
         end)
      end)

      return function()
         component:Destroy()
      end
   end
}

return story
```

```tsx [Roblox-TS]
import Fusion from "@rbxts/fusion";
import { InferGenericProps, InferCreatedControls, CreateControlStates, UpdateControlStates, HKT } from "@rbxts/ui-labs";

const controls = {
	Visible: true,
};

// Problema de tipos mencionado anteriormente, usaremos esto para poder establecer los tipos de los estados
interface FusionValueCreator extends HKT {
	new: (x: this["T"]) => Fusion.Value<typeof x>;
}
type FusionValues = InferCreatedControls<typeof controls, FusionValueCreator>;

const story = {
	controls: controls,
	render: (props: InferGenericProps<typeof controls>) => {
		const states: FusionValues = CreateControlStates(props.converted, props.controls, (value) => {
			return Fusion.Value(value);
		});

		const component = Fusion.New("Frame")({
			Parent: props.target,
			Size: UDim2.fromOffset(200, 100),
			Visible: states.Visible, // Este será un Fusion.Value<boolean>
		});

		props.subscribe((values) => {
			// Necesitamos convertir 'state' al tipo correcto
			UpdateControlStates(states, props.converted, values, (state: Fusion.Value<any>, value) => {
				state.set(value);
			});
		});

		return () => {
			component.Destroy();
		};
	},
};

export = story;
```

:::

## Cómo Usar el Generador de Historias

Puedes usar el Creador de Historias del [Paquete de Utilidades](/es/docs/installation.md#instalacion-del-paquete-de-utilidades) para crear tu historia. Estos inferirán los tipos de controles para Roblox-TS.

<span class="type-declaration"><span class="type-namespace">UILabs</span>
<span class="type-name">.</span><span class="type-function-name">CreateGenericStory</span>(<span class="type-name">info</span>,
<span class="type-name">render</span>)<span class="type-name">:</span><span class="type-highlight">StoryTable</span></span>

::: details Ejemplo

::: code-group

```lua [Luau]
local UILabs = require(...)
local CreateGenericStory = UILabs.CreateGenericStory

local story = CreateGenericStory({
   controls = {},
}, function(props)
   local component = Instance.new("Frame")
   component.Size = UDim2.fromOffset(200, 100)
   component.Parent = props.target

   props.subscribe(function(values)
      print("los controles cambiaron", values)
   end)

   return function()
      component:Destroy()
   end
end)

return story
```

```tsx [Roblox-TS]
import { CreateGenericStory } from "@rbxts/ui-labs";

const story = CreateGenericStory(
	{
		controls: {},
	},
	(props) => {
		const component = new Instance("Frame");
		component.Size = UDim2.fromOffset(200, 100);
		component.Parent = props.target;

		props.subscribe((values) => {
			print("los controles cambiaron", values);
		});

		return () => {
			component.Destroy();
		};
	},
);

export = story;
```
