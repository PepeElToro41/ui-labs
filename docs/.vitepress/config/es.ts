import { defineConfig } from "vitepress";

export default defineConfig({
	description: "Plugin de Storybook para Roblox",
	lang: "es-CO",

	themeConfig: {
		nav: [
			{ text: "Inicio", link: "/es/" },
			{ text: "Comenzar", link: "/es/docs/getstarted" },
			{ text: "API", link: "/es/api/home" },
		],
		
		docFooter: {
			prev: 'Anterior',
			next: 'Siguiente'
		},
	  
		outline: {
			label: 'En esta página'
		},

		sidebar: {
			"/es/docs/": [
				{
					text: "Comenzar",
					items: [
						{ text: "Introducción", link: "/es/docs/getstarted" },
						{ text: "Instalación", link: "/es/docs/installation" },
					],
				},
				{
					text: "Historias",
					collapsed: false,
					items: [
						{ text: "Crear Historias", link: "/es/docs/stories/create" },
						{ text: "Historias Funcionales", link: "/es/docs/stories/function" },
						{
							text: "Historias Avanzadas",
							link: "/es/docs/stories/advanced/index",
							items: [
								{ text: "Historias de React / Roact", link: "/es/docs/stories/advanced/react" },
								{ text: "Historias de Fusion", link: "/es/docs/stories/advanced/fusion" },
                        		{ text: "Historias de Vide", link: "/es/docs/stories/advanced/vide" },
                        		{ text: "Historias de Iris", link: "/es/docs/stories/advanced/iris" },
								{ text: "Historias Genéricas", link: "/es/docs/stories/advanced/generic" },
							],
						},
					],
				},
				{
					text: "Cómo usar UI Labs",
					collapsed: false,
					items: [
						{ text: "Visualización de Historias", link: "/es/docs/plugin/visualizing" },
						{ text: "Montaje Múltiple", link: "/es/docs/plugin/multimounting" },
                  		{ text: "Herramientas para Historias", link: "/es/docs/plugin/tools" },
						{ text: "Características Adicionales", link: "/es/docs/plugin/extras" },
					],
				},
				{
					text: "Controles",
					collapsed: false,
					items: [
						{ text: "Agregar Controles", link: "/es/docs/controls/adding" },
						{ text: "Controlers Primitivos", link: "/es/docs/controls/primitive" },
						{ text: "Controles Avanzados", link: "/es/docs/controls/advanced" },
						{ text: "Uso de Controles", link: "/es/docs/controls/using" },
					],
				},
				{
					text: "Storybooks",
					link: "/es/docs/storybooks",
				},
				{
					text: "Entorno",
					link: "/es/docs/environment",
				},
			],
			"/es/api/": [
				{ text: "Referencia de la API", items: [] },
				{
					text: "Stories",
					collapsed: false,
					items: [
						{ text: "Historias Funcionales", link: "/es/api/stories/function" },
						{ text: "Historias Avanzadas", link: "/es/api/stories/advanced" },
					],
				},
				{
					text: "Controles Primitivos",
					link: "/es/api/primitives",
				},
				{
					text: "Bibliotecas de UI",
					link: "/es/api/uilibraries",
				},
				{
					text: "Storybook",
					link: "/es/api/storybook",
				},
				{
					text: "Paquete de Utilidades",
					collapsed: false,
					items: [
						{ text: "Story Creators", link: "/es/api/utility/storycreators" },
						{
							text: "Constructores de Controles",
							items: [
								{ text: "Primitivos", link: "/es/api/utility/controls/primitives" },
								{ text: "Avanzados", link: "/es/api/utility/controls/advanced" },
							],
						},
						{ text: "Utilidades", link: "/es/api/utility/utils" },
						{ text: "Entorno", link: "/es/api/utility/environment" },
						{ text: "Tipos", link: "/es/api/utility/types" },
					],
				},
			],
		},
	},
});
