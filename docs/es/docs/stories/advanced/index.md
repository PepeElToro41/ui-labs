# Historias Avanzadas

Las historias avanzadas son aquellas que deben ser proporcionadas en forma de tabla y se montan internamente por UI Labs. Estas permiten a UI Labs tener más control e información sobre cómo se renderizan tus historias.

Este tipo de historias también te permiten añadir [Controles](/es/docs/controls/adding.md) para editar las propiedades de tu historia en tiempo real.

::: details Soporte para Flipbook
Para agregar soporte a las [Historias de Flipbook](https://flipbook-labs.github.io/flipbook/docs/story-format) y facilitar la migración, UI Labs utiliza un formato bastante similar al de flipbook.

Esto tiene algunas diferencias clave:

---

-   No se puede proporcionar una biblioteca de interfaz (`React` / `Roact` / `Fusion`) a un storybook, en cambio, solo en cada historia. Esta limitación podría solucionarse en el futuro.
-   En UI Labs el nombre de la historia no puede proporcionarse en la tabla, por lo que siempre se utilizará el nombre del módulo.<br/>Esto se debe a que UI Labs necesitaría realizar una operación de *recarga en caliente* (Hot-Reload) en cada historia y actualizar los cambios en consecuencia. Esto puede ser muy costoso e innecesario.

:::

## Cómo Crear una Historia Avanzada

All advanced stories share a base format table structure.

<table>
   <thead> 
      <tr>
         <th>CLave</th>
         <th>Tipo</th>
         <th width="100%">Descripción</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><span class="nowrap"> name &nbsp; <span class="props-table-ignored">Ignorado</span> </span></td>
         <td><code>string</code></td>
         <td>Siempre se utilizará el nombre del módulo.<br/>Esta propiedad solo se incluye aquí por tener en cuenta la compatibilidad con Flipbook.</td>
      </tr>
      <tr>
         <td><span class="nowrap"> summary &nbsp; <span class="props-table-optional">Opcional</span> </span></td>
         <td><code>string</code></td>
         <td>
            Resumen de la historia, puede contener <a href="https://create.roblox.com/docs/ui/rich-text" target="_blank">Rich Text</a>.
            <br/> Se mostrará en la vista previa de la historia
         </td>
      </tr>
      <tr>
         <td><span class="nowrap"> controls &nbsp; <span class="props-table-optional">Opcional</span></span></td>
         <td><code><span class="nowrap">{ string: Control }</span></code></td>
         <td>Tabla de objetos de control que se utilizarán en tu historia</td>
      </tr>
      <tr>
         <td><span class="nowrap"> story &nbsp; <span class="props-table-required">Obligatorio</span></span></td>
         <td><code><span class="nowrap">(...args: any) => any</span></code></td>
         <td>La función encargada de renderizar tu historia.<br/>La implementación variará</td>
      </tr>
   </tbody>
</table>

Observemos un ejemplo:

::: code-group

```lua [Luau]
local story = {
   summary = "Esto es un resumen",
   controls = nil, -- Aprenderemos sobre los controles más adelante
   story = function()
      ...
   end
}

return story
```

```ts [Roblox-TS]
const story = {
   summary: "Esto es un resumen",
   controls: undefined, // Aprenderemos sobre los controles más adelante
   story: () => {
      ...
   },
}

export = story
```

:::

## Tipos de Historias

Necesitarás agregar claves adicionales dependiendo del tipo de historia que estés utilizando.

UI Labs actualmente es compatible con los siguientes tipos de historias avanzadas:

<div class="card-container">
  <div class="cards">
   <a class="card" href="react">
      <img class="card-img dynamic-logo" src="/docs/logos/roblox.svg" />
      <p><b>Historias de React</b></p>
   </a>
   <a class="card" href="fusion">
      <div class="fusion-dynamic-logo card-img" />
      <p><b>Historias de Fusion</b></p>
   </a>
   <a class="card" href="vide">
      <img class="card-img" src="/docs/logos/vide.svg" />
      <p><b>Historias de Vide</b></p>
   </a>
   <a class="card" href="iris">
      <img class="card-img dynamic-logo" src="/docs/logos/package.svg" />
      <p><b>Historias de Iris</b></p>
   </a>
   <a class="card" href="generic">
      <img class="card-img" src="/docs/logos/studio.svg" />
      <div>
         <p><b>Historias Genéricas</b></p>
         <p class="card-detail">No library required</p>
      </div>
   </a>
  </div>
</div>
