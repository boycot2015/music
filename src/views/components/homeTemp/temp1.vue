<template>
    <div class="tab-content tab-home-content temp1" v-loading="{loading, fullScreen: true}">
        <Slider
        ref="slider"
        :data-w="width"
        :list="tabData.banner"
        v-if="!loading"
        @slider-click="onSliderClick"/>
        <div v-show="!loading" class="recommend" v-for="(obj, findex) in tabData.list" :key="obj.title">
            <div class="title clearfix">
                <h3 class="name fl">{{obj.title || '推荐歌单'}}</h3>
                <span class="fr more" @click="showMoreClick(obj)">更多<i class="icon-music-right"></i></span>
            </div>
            <ul class="recommend-list grid-list" :style="{'marginBottom': findex === 2 ? '40px': ''}" v-loading="obj.loading">
                <li class="grid-list-item date js-list-detail"
                @click="onListClick({ id: 0 }, true)"
                v-if="findex === 0">
                    <div class="img">
                        <span class="tip copy-writer">{{tabData.dayData.copywriter}}</span>
                        <p class="week">{{tabData.dayData.weeks[new Date().getDay()]}}</p>
                        <div class="date-text">{{tabData.dayData.day}}</div>
                    </div>
                    <div class="name tl">{{tabData.dayData.name}}</div>
                </li>
                <grid-list
                v-for="(item, index) in obj.data"
                :item="item"
                :index="index"
                :category="obj.category"
                :type="obj.type"
                @click="onListClick(item)"
                :key="item.id"></grid-list>
            </ul>
        </div>
    </div>
</template>
<script>
import {
    // ref,
    // computed,
    watch,
    reactive,
    toRefs,
    // getCurrentInstance,
    // onBeforeMount
    onMounted
} from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import '@/plugins/swiper/swiper.min.css'
// import Swiper from '@/plugins/swiper/swiper.min.js'
import GridList from '@/views/components/GridList'
import Slider from '@/components/Slider'

export default {
    name: 'homeTemp1',
    components: {
        GridList,
        Slider
    },
    data () {
        return {
            width: 1000
        }
    },
    // directives: {
    //     swiper: directive
    // },
    setup () {
        const store = useStore()
        const tabData = store.state.home.tab1Data
        const router = useRouter()
        const state = reactive({
            loading: true,
            tabData: {
                dayData: {
                    weeks: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                    day: new Date().getDate(),
                    name: '每日歌曲推荐',
                    copywriter: '根据您的音乐口味生成每日更新'
                },
                // ...computed(() => store.state.home).value,
                list: [{
                    loading: true,
                    title: '推荐歌单',
                    category: 3,
                    type: 1,
                    query: {
                        tabName: 'cate'
                    },
                    data: []
                }, {
                    loading: true,
                    title: '独家放送',
                    category: 1,
                    type: 5,
                    path: '/common/page',
                    query: {
                        tabName: 'private'
                    },
                    data: []
                }, {
                    loading: true,
                    title: '最新音乐',
                    category: 3,
                    type: 1,
                    query: {
                        tabName: 'cate'
                    },
                    data: []
                }, {
                    loading: true,
                    title: '推荐MV',
                    category: 3,
                    type: 5,
                    path: '/video/index',
                    query: {
                        tabName: 'MV'
                    },
                    data: []
                }, {
                    loading: true,
                    title: '主播电台',
                    category: 3,
                    type: 1,
                    query: {
                        tabName: 'dj'
                    },
                    data: []
                }]
            }
        })
        // const { ctx } = getCurrentInstance()
        onMounted(async () => {
            state.loading = true
            getData()
        })
        watch(() => tabData.banner, (value) => {
            state.tabData.banner = value
        })
        watch(() => [
            tabData.personalized,
            tabData.privatecontent,
            tabData.topSong,
            tabData.mv,
            tabData.djrecommend
        ], (value) => {
            state.tabData.list.map((el, i) => {
                state.tabData.list[i].data = value[i]
            })
        })
        watch(() => store.state.isExtend, (value) => {
            // console.log(value, 'state.isExtend')
        })
        // methods
        const getData = async () => {
            store.dispatch('home/getTab1Data').then(res => {
                state.loading = false
                state.tabData.list.map(el => {
                    el.loading = false
                })
            })
        }
        const onListClick = (item, isDaily) => {
            // getData(item.type)
            router.push({
                path: '/songs/list',
                query: {
                    id: item.id,
                    isDaily
                }
            })
        }
        const onBannerClick = (item) => {
            if (item.targetType === 1) {
                store.dispatch('setPlayData', { id: item.targetId }).then(res => {
                    const audio = document.getElementById('play-audio')
                    audio.play()
                })
            } else if (item.targetType === 10) {
                router.push({
                    path: '/songs/list',
                    query: {
                        id: item.targetId
                    }
                })
            } else if (item.url !== null) {
                window.open(item.url)
            }
        }
        const showMoreClick = (obj) => {
            const route = {
                path: '',
                query: {
                    tabName: ''
                }
            }
            if (obj.path) {
                route.path = obj.path
            } else {
                route.path = router.currentRoute.value.path
            }
            route.query = obj.query
            route.query.title = obj.title
            route.query.type = obj.type
            route.query.category = obj.category
            router.push(route)
        }
        return {
            ...toRefs(state),
            onListClick,
            onBannerClick,
            showMoreClick
        }
    },
    deactivated () {
        this.$refs.slider.pause()
        window.removeEventListener('resize', this.handleResize)
    },
    activated () {
        this.$nextTick(() => {
            var dom = this.$refs.slider.$el.parentNode
            this.width = dom.clientWidth || 1000
        })
        window.addEventListener('resize', this.handleResize)
    },
    mounted () {
        this.$nextTick(() => {
            this.handleResize()
            window.addEventListener('resize', this.handleResize)
        })
    },
    methods: {
        async onSliderClick (i, item) {
            // console.log(item, 'item')
            if (item.targetType === 1) {
                this.$store.dispatch('setPlayData', { id: item.targetId }).then(res => {
                    const audio = document.getElementById('play-audio')
                    audio.play()
                })
            } else if (item.targetType === 2) {
                this.$router.push({
                    path: '/songs/list',
                    query: {
                        id: item.targetId
                    }
                })
            } else if (item.url !== null) {
                window.open(item.url)
            }
            if (item.url) {
                this.$electron && this.$electron.remote.shell.openExternal(item.url)
            }
        },
        handleResize () {
            if (!this.$refs.slider) return
            var dom = this.$refs.slider.$el.parentNode
            this.width = dom.clientWidth || 1000
        }
    }
}
</script>
