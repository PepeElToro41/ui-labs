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
    URL: String
});

const imgClass = ['card-img', props.DynamicLogo ? 'dynamic-logo' : '', props.AdditionalImgClass];
</script>

<template>
    <a class="card" :href="URL" target="_blank">
        <div v-if="DivImg" :class="imgClass"></div>
        <img v-else :class="imgClass" :src="withBase(props.ImgSrc)" />
        
        <div v-if="SubString">
            <p><b>{{ MainString }}</b></p>
            <p class="card-detail">{{ SubString }}</p>
        </div>
        <p v-else><b>{{ MainString }}</b></p>
    </a>
</template>
