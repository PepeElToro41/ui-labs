<script setup>
import { defineProps } from 'vue';
import { withBase } from 'vitepress';

const props = defineProps({
    ImgSrc: String,
    DivImg: {
        type: Boolean,
        default: false
    },
    MainString: String,
    SubString: String,
    DynamicLogo: {
        type: String,
        default: false
    },
    AdditionalImgClass: {
        type: String,
        default: ''
    },
    IncludeBaseURL: {
        type: Boolean,
        default: false
    },
    URL: String
});

const imgClass = ['card-img', props.DynamicLogo ? 'dynamic-logo' : '', props.AdditionalImgClass];
const fixedURL = props.IncludeBaseURL ? withBase(props.URL) : props.URL;
</script>

<template>
    <a class="card" :href="fixedURL" target="_blank">
        <div v-if="DivImg" :class="imgClass"></div>
        <img v-else :class="imgClass" :src="withBase(props.ImgSrc)" />
        
        <div v-if="SubString">
            <p><b>{{ MainString }}</b></p>
            <p class="card-detail">{{ SubString }}</p>
        </div>
        <p v-else><b>{{ MainString }}</b></p>
    </a>
</template>
