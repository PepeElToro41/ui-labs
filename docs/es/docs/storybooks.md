# Storybooks

UI Labs te permite crear <span class="item-description">Storybooks</span> para agrupar tus historias. Son una excelente manera de organizar tus historias y hacer que sea más fácil encontrarlas.

Por defecto, las historias estarán dentro de <span class="item-description">Unknown Stories</span> <span class="tiphelp">(Historias Desconocidas)</span> si no han sido asignadas a un storybook. Aunque puedes usarlas de esa manera, se recomienda eventualmente agruparlas en storybooks.

::: details Compatibilidad con Flipbook

Para agregar soporte a los [Storybooks de Flipbook](https://flipbook-labs.github.io/flipbook/docs/writing-stories#storybook) y facilitar la migración, UI Labs utiliza un formato bastante similar al de flipbook.

Esto tiene algunas diferencias clave:

---

-   No se puede proporcionar una librería de interfaz a un storybook, en cambio, solo en cada historia. Esta limitación podría solucionarse en el futuro.
-   Se agrega la clave `groupRoots`.

:::

## Cómo Crear un Storybook

De manera similar a las historias, los storybooks son `ModuleScript` que terminan con `.storybook` en su nombre. UI Labs filtrará la estructura de tu juego para encontrar estos módulos.

Un módulo de storybook debe regresar una tabla con la siguiente estructura:

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
         <td><span class="nowrap"> name &nbsp; <span class="props-table-optional">Opcional</span></span></td>
         <td><code>string</code></td>
         <td>Nombre del storybook. Si no se proporciona, se utilizará el nombre del módulo</td>
      </tr>
      <tr>
         <td><span class="nowrap"> storyRoots &nbsp; <span class="props-table-required">Obligatorio</span> </span></td>
         <td><code>Instance[]</code></td>
         <td>
            Matriz de Instancias donde UI Labs buscará historias. Cualquier subcarpeta creará una subcarpeta en UI Labs también
         </td>
      </tr>
      <tr>
         <td><span class="nowrap"> groupRoots &nbsp; <span class="props-table-optional">Opcional</span></span></td>
         <td><code><span class="nowrap">boolean</span></code></td>
         <td>Si es verdadero, UI Labs creará subcarpetas para cada entrada en <span class="item-description">storyRoots</span></td>
      </tr>
      <tr>
         <td><span class="nowrap"> roact &nbsp; <span class="props-table-ignored">Ignorado</span></span></td>
         <td><code><span class="nowrap">Roact</span></code></td>
         <td>No puedes proporcionar tu librería de UI aquí, se incluye aquí solo por compatibilidad con Flipbook</td>
      </tr>
      <tr>
         <td><span class="nowrap"> react &nbsp; <span class="props-table-ignored">Ignorado</span></span></td>
         <td><code><span class="nowrap">React</span></code></td>
         <td> No puedes proporcionar tu librería de UI aquí, se incluye aquí solo por compatibilidad con Flipbook</td>
      </tr>
      <tr>
         <td><span class="nowrap"> reactRoblox &nbsp; <span class="props-table-ignored">Ignorado</span></span></td>
         <td><code><span class="nowrap">ReactRoblox</span></code></td>
         <td> No puedes proporcionar tu librería de UI aquí, se incluye aquí solo por compatibilidad con Flipbook</td>
      </tr>
   </tbody>
</table>

## Encontrar Historias

Supongamos que tenemos la siguiente estructura:

::: info Estructura de Archivos

<p style="line-height: 15px;"></p>

<div class="hierarchy-holder">
   <span class="hierarchy-tip">Icons: <a href="https://elttob.itch.io/vanilla-3-for-roblox-studio" target="_blank">Vainilla 3</a></span>

   <div class="hierarchy-item">
      <div class="custom-instance-serverscript"/>
      <span>ServerScriptService</span>
   </div>
      <div class="child-holder">
         <div class="hierarchy-item">
            <div class="custom-instance-folder"/>
            <span>GameStories</span>
         </div>
            <div class="child-holder">
               <div class="hierarchy-item">
                  <div class="custom-instance-module"/>
                  <span>GameStory1.story</span>
               </div>
               <div class="hierarchy-item">
                  <div class="custom-instance-module"/>
                  <span>GameStory2.story</span>
               </div>
            </div>
      </div>
   <div class="hierarchy-item">
      <div class="custom-instance-replicated"/>
      <span>ReplicatedStorage</span>
   </div>
      <div class="child-holder">
         <div class="hierarchy-item">
            <div class="custom-instance-folder"/>
            <span>OtherStories</span>
         </div>
            <div class="child-holder">
               <div class="hierarchy-item">
                  <div class="custom-instance-module"/>
                  <span>OtherStory1.story</span>
               </div>
               <div class="hierarchy-item">
                  <div class="custom-instance-module"/>
                  <span>OtherStory2.story</span>
               </div>
            </div>
      </div>
</div>

:::

Ahora, crearemos un Storybook para la estructura anterior:

::: code-group

```lua [Luau]
local storybook = {
   name = "Stories",
   storyRoots = {
      game.ServerScriptService.GameStories,
      game.ReplicatedStorage.OtherStories,
   },
}

return storybook
```

```ts [Roblox-TS]
const storybook: Storybook = {
	name: "Stories",
	storyRoots: [game.ServerScriptService.GameStories, game.ReplicatedStorage.OtherStories],
};

export = storybook;
```

:::

Finalmente, podemos observar que nuestras historias están organizadas en el explorador de UI Labs:

<img class="image-label" src="/docs/storybook/storybookstories.png" alt="storybookstories" width="500"/>

## Agrupar Historias por Origen

Si deseas agrupar cada entrada de `storyRoots` en una carpeta separada dentro del storybook, puedes establecer la clave `groupRoots` en `true`. Esto te permitirá organizar diferentes historias dentro de un único storybook, manteniendo una estructura más clara y organizada.

::: code-group

```lua [Luau] {7}
local storybook = {
   name = "Stories",
   storyRoots = {
      game.ServerScriptService.GameStories,
      game.ReplicatedStorage.OtherStories,
   },
   groupRoots = true,
}
```

```ts [Roblox-TS] {7}
const storybook: Storybook = {
	name: "Stories",
	storyRoots: [game.ServerScriptService.GameStories, game.ReplicatedStorage.OtherStories],
	groupRoots: true,
};
```

:::

Ahora podemos ver que cada entrada de `storyRoots` está agrupada en una carpeta separada:

<img class="image-label" src="/docs/storybook/groupedstories.png" alt="groupedstories.png" width="500"/>

Establecer `groupRoots` en `true` también agregará las historias que se añadan directamente en la matriz `storyRoots`.

Esto te permite proporcionar las historias directamente en la matriz.

::: code-group

```lua [Luau] {7}
local storybook = {
   name = "Stories",
   storyRoots = game.ServerScriptService.GameStories:GetChildren(),
   groupRoots = true
}
```

```ts [Roblox-TS] {7}
const storybook: Storybook = {
	name: "Stories",
	storyRoots: game.ServerScriptService.GameStories.GetChildren(),
	groupRoots: true,
};
```

:::

<img class="image-label" src="/docs/storybook/storyinroots.png" alt="groupedstories.png" width="500"/>
