<template>
  <div class="aside js-aside" @dblclick.stop v-if="playData">
        <div class="aside-list js-aside-template">
            <div
            v-for="($value) in menu"
            :key="$value.name"
            :class="{'unfold': $value.meta.unfold}"
            class="aside-item">
                <div
                class="title flexbox-h just-b js-toggle-class"
                :class="
                (activeClass && ($value.path === activeFindex || $value.meta.unfold)) && 'active '"
                @click.stop="onMenuClick($value)"
                :data-path="$value.path">
                    <p class="name line-one">{{$value.meta.title}}</p>
                    <span class="icon" v-if="$value.meta.rightIcon" :class="`icon-music-${$value.meta.rightIcon}`"></span>
                </div>
                <ul
                class="list"
                v-if="$value.children && $value.children.length"
                :class="{'active': activeClass && ($value.path === activeFindex || $value.meta.unfold)}">
                    <li
                    v-for="(item) in $value.children"
                    :key="item.name"
                    @click.stop="() => activeRoute = item.path"
                    :class="{'active': activeRoute === item.path }"
                    class="list-item js-list-item flexbox-h">
                        <router-link :to="{path: item.path, query: { tabName: item.path === '/index' ? 'home': undefined, ...item.query || {} }}">
                            <span class="icon" :class="`icon-music-${item.meta.icon}`"></span>
                            <span class="name line-one">{{item.meta.title}}</span>
                            <span class="icon flex-1 tr" :class="`icon-music-${item.meta.rightIcon}`"></span>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
        <div class="music-info flexbox-h" data-id="">
            <div class="mask" @click="onInfoMaskClick">
                <i class="icon icon-music-down"></i>
            </div>
            <div class="img tl">
                <img :src="playData.picUrl" alt="">
            </div>
            <div class="text flex-3">
                <div class="top flexbox-h just-b">
                    <p class="name line-one">{{playData.name}}</p>
                    <span
                    :class="{'icon-music-love-full': isStar}"
                    class="js-love-icon star-icon icon-music-love"
                    @click="onStar"></span>
                </div>
                <div class="bottom flexbox-h just-b">
                    <p class="singer line-one">{{playData.singer}}</p>
                    <span class="share-icon icon-music-share"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
// ref,
    computed,
    watch,
    reactive, toRefs
// getCurrentInstance
// toRefs
} from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
    setup (props, { emit }) {
        const router = useRouter()
        const store = useStore()
        let { activePath } = router.currentRoute.value.query
        if (!activePath) activePath = router.currentRoute.value.meta.activePath
        if (!activePath) activePath = router.currentRoute.value.path
        const state = reactive({
            activeFindex: activePath,
            activeRoute: activePath,
            activeClass: activePath === router.currentRoute.value.path,
            isStar: false,
            menu: store.state.menu,
            playData: {
                ...computed(() => store.state.playData)
            }
        })
        watch(() => store.state.menu, (value) => {
            state.menu = value
        })
        watch(() => store.state.playData, (value) => {
            for (const key in value) {
                state.playData[key] = value[key]
            }
        })
        watch(() => router.currentRoute.value.path, (value) => {
            if (router.currentRoute.value.meta.hideInMenu) return
            state.activeFindex = value
            state.activeRoute = value
        })
        /* eslint-disable */
        const onStar = (e) => {
            state.isStar = !state.isStar
        }
        const onInfoMaskClick = () => {
            emit('hideMenu', true)
        }
        const onMenuClick = (route) => {
            if (route.path === state.activeFindex) {
               state.activeClass = !state.activeClass
            }
            if (route.path !== state.activeFindex) {
               state.activeClass = true
            }
            state.activeFindex = route.path
        }
        return {
            ...toRefs(state),
            onStar,
            onMenuClick,
            onInfoMaskClick
        }
    }
}
</script>

<style>

</style>
