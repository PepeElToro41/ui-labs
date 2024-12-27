# Entorno

UI Labs crea un entorno virtual para cada historia, lo que reemplaza la función `require`, el global `script` y la tabla `_G`.

Esto es necesario para permitir el aislamiento *(sandboxing)* y evitar el almacenamiento en caché de las funciones `require`. Además, UI Labs inyecta valores y funciones adicionales que pueden ser útiles dentro del entorno.

Dado que la historia se ejecuta dentro del mismo entorno, puedes usar cualquiera de estas utilidades desde cualquier parte de la historia. El [Paquete de Utilidades](/es/docs/installation.md#instalacion-del-paquete-de-utilidades) proporcionará una forma de acceder a estas variables.

## Environment.IsStory

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-function-name">IsStory</span>( )<span class="type-name">:</span><span class="type-highlight">boolean</span></span>

Devuelve `true` si la historia actual se está ejecutando dentro de UI Labs

## Environment.Unmount

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-function-name">Unmount</span>( )</span>

Desmonta la historia. Esto es útil cuando la historia no se debe continuar ejecutando.

<span class="tiphelp">Por defecto, es una función vacía en entornos fuera de las historias</span>

## Environment.Reload

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-function-name">Reload</span>( )</span>

Recarga la historia. Puedes usar esto si quieres forzar una recarga cuando algo externo haya cambiado, o como una alternativa a `Environment.Unmount`.

::: danger
Tiene el potencial de causar un bucle infinito.
:::

<span class="tiphelp">Por defecto, es una función vacía en entornos fuera de las historias</span>

## Environment.CreateSnapshot

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-function-name">CreateSnapshot</span>(<span class="type-name-opt">name</span>?<span class="type-name">:</span><span class="type-highlight">string</span>)</span>

Hace lo mismo que el botón [Guardar Versiones / Create Snapshot](/docs/plugin/extras.md#guardar-versiones). Es útil para clonar la interfaz automáticamente. Se puede proporcionar un argumento adicional `name` para el `ScreenGui` creado.

<span class="tiphelp">Por defecto, es una función vacía en entornos fuera de las historias</span>

## Environment.SetStoryHolder

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-function-name">SetStoryHolder</span>(<span class="type-name-opt">target</span>?<span class="type-name">:</span><span class="type-highlight">Instance</span>)</span>

Cambia lo que selecciona el botón [Ver en el Explorador / View On Explorer](/docs/plugin/extras.md#ver-en-el-explorador-nbsp-e) cuando se hace clic. Es útil cuando la historia no usa el Frame de destino proporcionado (por ejemplo, usando <span class="item-description">React Portals</span>), o cuando la historia no es una interfaz de usuario.

Llamar a esta función sin un valor restablecerá el contenedor de la historia al Frame de destino.

<span class="tiphelp">Por defecto, es una función vacía en entornos fuera de las historias</span>

## Environment.GetJanitor

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-function-name">GetJanitor</span>( )<span class="type-name">:</span><span class="type-highlight">Janitor</span></span>

Proporciona un objeto de tipo [Janitor](https://howmanysmall.github.io/Janitor/) que se destruye cuando la historia se desmonta. Esto es útil para limpiar recursos sin necesidad de acceder manualmente a las funciones de limpieza.

<span class="tiphelp">Regresa `nil` en entornos fuera de las historias</span>

## Environment.InputListener

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-var">InputListener</span><span class="type-name">:</span><span class="type-highlight">InputSignals</span></span>

Te proporciona un *input listener*. Esto es útil porque `UserInputService` no funcionará dentro de <span class="item-description">Plugin Widgets</span>.

El tipo del *listener* es:

```ts
type InputSignals = {
   InputBegan: UserInputService.InputBegan;
   InputChanged: UserInputService.InputChanged;
   InputEnded: UserInputService.InputEnded;
   MouseMoved: Signal<(mousePos: Vector2)>;
}
```

<span class="tiphelp">Regresa `nil` en entornos fuera de las historias</span>

## Environment.UserInput

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-var">UserInput</span><span class="type-name">:</span><span class="type-highlight">UserInputService</span></span>

Es igual a `Environment.InputListener`, pero la diferencia es que este usa el tipo de `UserInputService` y lo utiliza por defecto. Además, recurrirá a `UserInputService` para cualquier método que falte.

<span class="tiphelp">Regresa `UserInputService` en entornos fuera de las historias</span>

## Environment.EnvironmentUID

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-var">EnvironmentUID</span><span class="type-name">:</span><span class="type-highlight">string</span></span>

Regresa el GUID del entorno. Este cambia cada vez que la historia es recargada.

<span class="tiphelp">Regresa `nil` en entornos fuera de las historias</span>

## Environment.PreviewUID

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-var">PreviewUID</span><span class="type-name">:</span><span class="type-highlight">string</span></span>

Regresa el GUID de la previsualizacion. Cambia cada vez que la historia se monta, pero permanece igual cuando es recargada.

<span class="tiphelp">Regresa `nil` en entornos fuera de las historias</span>

## Environment.OriginalG

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-var">OriginalG</span><span class="type-name">:</span><span class="type-highlight">\_G</span></span>

Contiene la tabla original `_G`. Puede ser usado para salir del entorno aislado.

<span class="tiphelp">Regresa la tabla `_G` en entornos fuera de las historias</span>

## Environment.Plugin

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-var">Plugin</span><span class="type-name">:</span><span class="type-highlight">Plugin</span></span>

Regresa la variable global `plugin`. Esto es útil para poder acceder a la API de plugin.

<span class="tiphelp">Regresa `nil` en entornos fuera de las historias</span>

## Environment.PluginWidget

<span class="type-declaration"><span class="type-namespace">Environment</span>
<span class="type-name">.</span><span class="type-var">PluginWidget</span><span class="type-name">:</span><span class="type-highlight">DockWidgetPluginGui</span></span>

Regresa donde el plugin está montado. Esto es útil porque los `Sounds` solo pueden ser reproducidos dentro de un `DockWidgetPluginGui` en el <span class="item-description">Edit Mode</span> <span class="tiphelp">(Modo de Edición)</span>.

::: warning ADVERTENCIA
Solo debes ubicar instancias directamente dentro del widget del plugin. Manipular elementos del plugin de UI Labs puede romper el plugin.
:::

<span class="tiphelp">Regresa `nil` en entornos fuera de las historias</span>

##

::: details Resumen

::: code-group

```lua [Luau]
local UILabs = require(ReplicatedStorage.UILabs)
local Environment = UILabs.Environment

print(Environment.IsStory())

---- [[ Variables ]] ----
print(Environment.EnvironmentUID)
print(Environment.PreviewUID)
print(Environment.OriginalG)
print(Environment.PluginWidget)


---- [[ Funciones ]] ----
Environment.Reload()
Environment.Unmount()
Environment.CreateSnapshot("MySnapshot")
Environment.SetStoryHolder(game.Workspace.Baseplate)


---- [[ Janitor ]] ----
local janitor = Environment.GetJanitor()
janitor:Add(Instance.new("Part"))
janitor:Add(function()
   print("Cleanup")
end)


---- [[ InputListener ]] ----
local inputListener = Environment.InputListener

inputListener.InputBegan:Connect(function(input, gameProcessed)
   print(input.UserInputType)
end)
inputListener.InputEnded:Connect(function(input, gameProcessed)
   print(input.UserInputType)
end)
inputListener.InputChanged:Connect(function(input, gameProcessed)
   print(input.UserInputType)
end)
inputListener.MouseMoved:Connect(function(mousePos)
   print(mousePos)
end)

```

```ts [Roblox-TS]
import { Environment } from "@rbxts/ui-labs";

print(Environment.IsStory());

/* ------- Variables ------ */
print(Environment.EnvironmentUID);
print(Environment.PreviewUID);
print(Environment.OriginalG);
print(Environment.PluginWidget);

/* ------- Funciones ------ */
Environment.Reload();
Environment.Unmount();
Environment.CreateSnapshot("MySnapshot");
Environment.SetStoryHolder(game.Workspace.Baseplate);

/* ------- Janitor ------ */
const janitor = Environment.GetJanitor();
janitor.Add(new Instance("Part"));
janitor.Add(() => {
	print("Cleanup");
});

/* ------- InputListener ------ */
const inputListener = Environment.InputListener;

inputListener.InputBegan.Connect((input, gameProcessed) => {
	print(input.UserInputType);
});
inputListener.InputEnded.Connect((input, gameProcessed) => {
	print(input.UserInputType);
});
inputListener.InputChanged.Connect((input, gameProcessed) => {
	print(input.UserInputType);
});
inputListener.MouseMoved.Connect((mousePos) => {
	print(mousePos);
});
```

:::
