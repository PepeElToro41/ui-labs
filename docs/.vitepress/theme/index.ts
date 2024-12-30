// https://vitepress.dev/guide/custom-theme
import DefaultTheme from "vitepress/theme";
import NavCard from "./components/NavCard.vue";

import "./fix.css";
import "./vars.css";
import "./selectors.css";
import "./nav.css";

export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        app.component("NavCard", NavCard);
    },
}