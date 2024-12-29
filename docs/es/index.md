---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
    name: UI Labs
    text: ""
    tagline: Plugin de <i>Storybook</i> para Roblox
    image:
        src: /home/pluginlogo.png
        alt: UI Labs
    actions:
        - theme: brand
          text: Comenzar
          link: /es/docs/getstarted
        - theme: alt
          text: Referencia de la API
          link: /es/api/home

features:
    - title: Retroalimentación Instantánea
      icon:
          src: /home/play.png
      details: UI Labs cuenta con un <i>Recargador en Caliente</i> (Hot-Reloader). Visualiza tus cambios en tiempo real.

    - title: Controles
      icon:
          src: /home/controls.png
      details: Establece controles para tus historias. Cambia las propiedades de tu interfaz al instante.

    - title: Entorno Aislado
      icon:
          src: /home/isolation.png
      details: Tu código se ejecuta virtualmente en un entorno aislado, sin conflictos ni efectos secundarios. No necesitas preocuparte por restablecer tu código.
---