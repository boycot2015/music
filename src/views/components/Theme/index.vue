<template>
    <div class="byt-theme theme-dialog" @click.stop>
        <div class="theme-dialog-title">
            <div class="icon-close" @click="toggleModal">×</div>
            选择主题
        </div>
        <div class="theme-dialog-body">
            <div class="sub-title">主题颜色<span>&nbsp;&nbsp;|&nbsp;&nbsp;夜间模式</span><span class="icon-night" :class="{'active': isNight}" @click="changeNight"></span></div>
            <div class="colors-list">
                <div class="colors-list-item"
                :style="{
                    backgroundColor: color.primary
                }"
                :class="{active: colorIndex === index}"
                @click="() => {colorIndex = index;changeTheme('', {themeColor: color, colorIndex: index}).then($store.dispatch('themeChanged', !$store.state.themeChanged))}" v-for="(color, index) in colors" :key="color">
                </div>
            </div>
            <div class="sub-title">在线壁纸</div>
            <ul class="cate-list flexbox-h" v-if="cateList && cateList.length">
                <li class="cate-list-item"
                :class="{active: cateIndex === item.old_id}"
                @click="onCateChange(item)"
                v-for="item in cateList"
                :key="item.old_id">
                    {{item.show_name}}
                </li>
            </ul>
            <div class="pic-list" v-loading="loading">
                <div class="pic-list-item"
                :class="{active: picIndex === pic.id}"
                @click="() => {picIndex = pic.id;changeTheme('', {bgUrl: pic.url, bgUrlIndex: pic.id})}"
                v-for="pic in picData" :key="pic.id">
                    <img :src="pic.url" alt="">
                </div>
            </div>
            <div class="more-btn" v-if="total > picData.length && !loading" @click="loadingMore">加载更多 ></div>
            <div class="sub-title">精选壁纸</div>
            <div class="pic-list">
                <div class="pic-list-item"
                :class="{active: picIndex === index}"
                @click="() => {picIndex = index;changeTheme('', {bgUrl: pic, bgUrlIndex: index})}" v-for="(pic, index) in localBgUrls" :key="pic">
                <img :src="pic" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable no-unused-vars */

import {
    // ref,
    computed,
    watch,
    reactive,
    onMounted,
    // onUpdated,
    toRefs,
    onBeforeMount
} from 'vue'
import {
    useStore
} from 'vuex'
import {
    // drag,
    changeTheme
} from '@/utils'
import useVirtualList from '@/hooks/useVirtualList'
export default {
    setup (props, context) {
        const store = useStore()
        const themeData = store.state.theme
        // const useVirtual = useVirtualList({})
        const state = reactive({
            loading: true,
            isNight: false,
            picIndex: 0,
            cateIndex: 0,
            colorIndex: 0,
            colors: [],
            localBgUrls: [],
            picData: [],
            cateList: [],
            pageno: 1,
            count: 15,
            total: 0,
            activeIndex: 0
            // ...computed(() => themeData)
        })
        watch(() => [
            themeData.picData,
            themeData.cateList,
            themeData.total
        ], (value) => {
            // console.log(value, 'theme')
            state.picData = value[0]
            state.cateList = value[1]
            state.total = value[2]
            state.loading = false
        })
        onMounted(async () => {
            changeTheme().then(res => {
                state.picIndex = res.bgUrlIndex
                state.colorIndex = res.colorIndex
                state.localBgUrls = res.bgUrlList
                state.colors = res.colors
                store.dispatch('themeChanged', !store.state.themeChanged)
            })
            getData()
        })
        const getData = async () => {
            store.dispatch('theme/getData', { page: state.pageno, size: state.count }).then(res => {
                state.loading = false
            })
        }
        const toggleModal = () => {
            context.emit('close-modal', true)
        }
        const changeNight = () => {
            state.isNight = !state.isNight
            state.isNight && (document.querySelector('#app').classList = 'dark-mode-invert')
            !state.isNight && (document.querySelector('#app').classList = '')
        }
        const onCateChange = async (item) => {
            if (state.cateIndex === item.old_id) return
            state.pageno = 1
            state.cateIndex = item.old_id

            store.dispatch('theme/getListByCategory', {
                ...item,
                pageno: state.pageno,
                count: state.count
            }).then(res => {})
        }
        const loadingMore = async () => {
            state.pageno++
            state.loading = true
            store.dispatch('theme/loadingMore', {
                old_id: state.cateIndex,
                category: state.cateIndex || 'unsplash',
                pageno: state.pageno,
                count: state.count
            }).then(res => {
                state.loading = false
            })
        }
        return {
            changeTheme,
            changeNight,
            toggleModal,
            onCateChange,
            loadingMore,
            // ...computed(() => themeData).value,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="less" scoped>
.theme-dialog {
    position: fixed;
    right: 0;
    top: 0;
    width: 500px;
    height: 100%;
    transition: all .3s;
    transform: translateX(640px);
    opacity: 0;
    z-index: 1000;
    &.active {
        opacity: 1;
        transform: translateX(0px);
    }
    .sub-title {
        color: @white;
        font-size: 16px;
        line-height: 16px;
        margin: 10px 0 20px;
        padding-left: 10px;
        display: flex;
        align-items: center;
        border-left: 4px solid @primary;
        &:nth-child(3) {
            margin-top: 20px;
        }
        .icon-night {
            display: inline-block;
            margin-left: 20px;
            width: 20px;
            padding: 2px 10px;
            border-radius: 30px;
            overflow: hidden;
            height: 14px;
            background: rgba(0, 0, 0, .8);
            position: relative;
            transition: all .3s;
            background-color: @primary;
            &::after {
                content: "";
                position: absolute;
                width: 14px;
                height: 14px;
                border-radius: 14px;
                top: 2px;
                left: 2px;
                transition: all .3s;
                background-color: @white;
            }
            &.active {
                &::after {
                    content: "";
                    position: absolute;
                    // right: 2px;
                    left: 24px;
                    background-color: @c-000;
                }
            }
        }
    }
    &-title {
        position: relative;
        line-height: 40px;
        height: 40px;
        font-size: 18px;
        color: @white;
        text-align: center;
        -webkit-app-region: drag;
        background-color: rgba(0, 0, 0, 0.9);
        // border-bottom: 1px solid @c-ccc;
    }
    &-body {
        padding: 20px 10px 20px 20px;
        overflow: hidden;
        overflow-y: auto;
        height: calc(100% - 80px);
        -webkit-app-region: no-drag;
        background-color: rgba(0, 0, 0, 0.8);
    }
    &-footer {
        height: 40px;
        line-height: 40px;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.7);
        border-top: 1px solid @c-ccc;
        .btns {
            span {
                padding: 5px 10px;
                font-size: 14px;
                color: @white;
                border-radius: 3px;
                border: 1px solid @c-ccc;
                margin-right: 20px;
                cursor: pointer;
                transition: all 0.5s;
                &:hover {
                    background-color: @white;
                    color: @c-333;
                }
                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }
    .pic-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        &-item {
            margin-bottom: 15px;
            margin-right: 15px;
            height: 80px;
            width: 135px;
            cursor: pointer;
            overflow: hidden;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            border-radius: 10px;
            border: 2px solid @c-e8;
            background: @c-e8;
            &.active {
                border-color: @primary;
            }
            img {
                // height: 200px;
                width: 100%;
            }
            &:nth-child(3n) {
                margin-right: 0;
            }
        }
    }
    .colors-list {
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        border-radius: 3px;
        overflow: hidden;
        &-item {
            height: 45px;
            flex-basis: 10%;
            // margin-right: 16px;
            // margin-bottom: 16px;
            position: relative;
            overflow: hidden;
            cursor: pointer;
            &:nth-child(8n) {
                margin-right: 0;
            }
            &.active::after {
                content: '';
                display: block;
                position: absolute;
                bottom: -10px;
                right: -10px;
                width: 0;
                height: 0;
                border-width: 10px;
                border-color: var(--white);
                border-style: solid;
                transform: rotateZ(45deg);
            }
        }
    }
    .icon-close {
        position: absolute;
        left: -40px;
        padding: 0 12px;
        background: rgba(0,0,0,0.5);
        top: 0px;
        font-size: 28px;
        cursor: pointer;
        color: @white;
        transition: all 0.3s;
        border-radius: 5px 0 0 5px;
        -webkit-app-region: no-drag;
        &:hover {
            // transform: rotateZ(90deg);
            color: @primary;
        }
    }
    .cate-list {
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        margin-bottom: 10px;
        &-item {
            margin-right: 10px;
            margin-bottom: 5px;
            cursor: pointer;
            color: @white;
            font-size: 14px;
            line-height: 24px;
            transition: all 0.3s;
            border-bottom: 2px solid transparent;
            &:nth-child(11n) {
                margin-right: 0;
            }
            &:hover {
                color: @primary;
            }
            &.active {
                color: @primary;
                border-bottom: 2px solid @primary;
            }

        }
    }
    .more-btn {
        text-align: center;
        line-height: 32px;
        color: @white;
        &:hover {
            color: @primary;
            cursor: pointer;
        }
    }
}
</style>
