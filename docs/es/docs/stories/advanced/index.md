# Historias Avanzadas

Las historias avanzadas deben de ser proporcionadas en forma de tabla y se montan internamente por UI Labs. Estas permiten a UI Labs tener más control e información sobre cómo se renderizan tus historias.

Este tipo de historias también te permiten añadir [Controles](/es/docs/controls/adding.md) para editar las propiedades de tu historia en tiempo real.

::: details Soporte para Flipbook
Para agregar soporte de [Flipbook](https://flipbook-labs.github.io/flipbook/docs/story-format) y facilitar la migración, UI Labs utiliza un formato bastante similar al de flipbook.

Esto tiene algunas diferencias clave:

---

-   No se puede proporcionar una librería (`React` / `Roact` / `Fusion`) globalmente en un Storybook, solo individualmente en cada historia. Esta limitación podría solucionarse en el futuro.
-   En UI Labs el nombre de la historia no puede aqui, por lo que siempre se utilizará el nombre del script.<br/>Esto se debe a que UI Labs necesitaría realizar una operación de Hot-Reload en cada historia y actualizar los cambios. Esto puede ser muy costoso e innecesario.

:::

## Cómo Crear una Historia Avanzada

Todas las historias avanzadas comparten una estructura base.

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
         <td><span class="nowrap"> name &nbsp; <span class="props-table-ignored">Ignorado</span> </span></td>
         <td><code>string</code></td>
         <td>Siempre se utilizará el nombre del módulo.<br/>Se incluye aquí por compatibilidad con Flipbook.</td> 
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
         <td>Tabla de controles que se utilizarán en tu historia</td>
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

Necesitarás agregar entradas adicionales dependiendo del tipo de historia que estés utilizando.

UI Labs actualmente es compatible con los siguientes tipos de historias avanzadas:

<div class="card-container">
  <div class="cards">
   <a class="card" href="react">
      <div class="react-dynamic-logo card-img" alt="Logo de React" />
      <p><b>Historias de React</b></p>
   </a>
   <a class="card" href="fusion">
      <div class="fusion-dynamic-logo card-img" alt="Logo de Fusion" />
      <p><b>Historias de Fusion</b></p>
   </a>
   <a class="card" href="vide">
      <img class="card-img" src="/docs/logos/vide.svg" alt="Logo de Vide" />
      <p><b>Historias de Vide</b></p>
   </a>
   <a class="card" href="iris">
      <img class="card-img dynamic-logo" src="/docs/logos/package.svg" alt="Icono Paquete" />
      <p><b>Historias de Iris</b></p>
   </a>
   <a class="card" href="generic">
      <img class="card-img" src="/docs/logos/studio.svg" alt="Logo de Roblox Studio" />
      <div>
         <p><b>Historias Genéricas</b></p>
         <p class="card-detail">No requiere librería</p>
      </div>
   </a>
  </div>
</div>
