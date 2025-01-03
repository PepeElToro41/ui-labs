# Historias de Funcion

Las historias de funcion son el tipo más básico de historias; son funciones que UI Labs ejecutará al montar la historia.

Estas son utilizadas en [Hoarcekat](https://github.com/Kampfkarren/hoarcekat)

## Cómo Montar una Historia

Estas funciones recibirán un `target` como un parametro, el cual es el *Frame* donde la historia se debe crear.

::: code-group

```lua [Luau]
function story(target: Frame)
   -- Crea tu historia aquí dentro de "target"
end

return story
```

```ts [Roblox-TS]
function story(target: Frame) {
	// Crea tu historia aquí dentro de "target"
}

export = story;
```

:::

## Limpieza

Después de ejecutar una función, esta debe regresar una función de limpieza que será ejecutada cuando la historia sea desmontada.

::: code-group

```lua [Luau] {4-6}
function story(target: Frame)
   -- Crea tu historia aquí dentro de "target"

   return function()
      -- Limpia tu historia aquí
   end
end

return story
```

```ts [Roblox-TS] {4-6}
function story(target: Frame) {
	// Crea tu historia aquí dentro de "target"

	return () => {
		// Limpia tu historia aquí
	};
}

export = story;
```

:::

::: danger Posibles Errores
La función de limpieza no puede ejecutarse si la función principal da errores. Si la historia necesita limpiar algo, es posible que sea necesario **Reiniciar Studio** para evitar fugas de memoria e instancas no destruidas.

<span class="dangertip">UI Labs te advertirá sobre esto</span>

```lua {5}
local function story(target)
   local newElement = Roact.createElement("TextLabel", {})
   local handle = Roact.mount(newElement, target) --Fue montado, necesita limpiar

   error("error") --Este error no permitirá que la función de limpieza sea regresada
   return function()
      --Jamás se desmontará
      Roact.unmount(handle)
   end
end

return story
```

:::

## Ejemplos

::: details React / Roact
::: code-group

```lua [Luau]
local function story(target)
   local component = Roact.createElement("Frame", {})
   local root = Roact.mount(component, target)

   return function()
      Roact.unmount(root)
   end
end

return story
```

```tsx [Roblox-TS]
function story(target: Frame) {
	const component = <frame />;
	Roact.mount(component, target);

	return () => {
		Roact.unmount(component);
	};
}

export = story;
```

:::

::: details Fusion
::: code-group

```lua [Luau]
local function story(target: Frame)
   local component = Fusion.New "Frame" {
      Parent = target,
   }

   return function()
      component:Destroy()
   end
end

return story
```

```ts [Roblox-TS]
function story(target: Frame) {
	const component = Fusion.New("Frame")({
		Parent: target,
	});

	return () => {
		component: Destroy();
	};
}

export = story;
```

:::

::: details Creando Instancias
::: code-group

```lua [Luau]
local function story(target: Frame)
   local component = Instance.new("Frame")
   component.Parent = target

   return function()
      component:Destroy()
   end
end

return story
```

```ts [Roblox-TS]
function story(target: Frame) {
	const component = new Instance("Frame");
	component.Parent = target;

	return () => {
		component.Destroy();
	};
}

export = story;
```
