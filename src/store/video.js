import { video, MV } from '@/api/apiList'
import { filterPlayCount, store } from '@/utils'
export default {
    namespaced: true,
    state: {
        tab1Data: {
            all: {},
            categories: [], // 分类
            tags: [], // 分类
            subs: [], // 分类
            list: []
        },
        tab2Data: {
            personalized: store.get('videoTab2Data') !== null ? store.get('videoTab2Data').personalized : [], // 推荐歌单列表
            // privatecontent: [], // 独家放送列表
            // topSong: [], // 新歌速递列表
            // mv: [], // 推荐 mv
            // djprogram: [], // 最热主播榜
            // djrecommend: [] // 最热主播榜
            hotMV: [],
            exclusive: [],
            topMV: []
        },
        videoParams: {},
        showVideoPlayer: false
    },
    mutations: {
        setTab1Data (state, data) {
            for (const key in data) {
                state.tab1Data[key] = data[key]
            }
            store.set('videoTab1Data', { ...data }, new Date().getTime() + 300 * 1000)
        },
        setTab2Data (state, data) {
            for (const key in data) {
                state.tab2Data[key] = data[key]
            }
            const localData = store.get('videoTab2Data')
            store.set('videoTab2Data', { ...localData, ...data }, new Date().getTime() + 300 * 1000)
        },
        updateTab1Data (state, list) {
            state.tab1Data.list = list
            const localData = store.get('videoTab1Data')
            store.set('videoTab1Data', { ...localData, list }, new Date().getTime() + 300 * 1000)
        },
        setVideoPlayer (state, val) {
            val && (state.videoParams = val)
            val && store.set('videoParams', val)
        },
        showVideoPlayer (state, val) {
            state.showVideoPlayer = val
        }
    },
    actions: {
        async getTab1Data ({ commit }, params) {
            const localData = store.get('videoTab1Data')
            const data = {}
            if (localData !== null) {
                commit('setTab1Data', localData)
                return Promise.resolve({ code: 200, success: true })
            }
            const catlistRes = await video.groupList(params)
            const allVideosRes = await video.all(params)
            const categoryRes = await video.category(params)
            if (catlistRes && catlistRes.code === 200) {
                const subs = []
                const categories = {
                    0: '全部视频'
                }
                for (const key in categories) {
                    subs[key] = []
                    catlistRes.data.map(el => {
                        subs[key].push(el)
                    })
                }
                data.subs = subs
                data.categories = categories
            }
            if (allVideosRes && allVideosRes.code === 200) {
                allVideosRes.datas.map(el => {
                    el.data.playTime = filterPlayCount(el.data.playTime)
                    el.data.playCount = filterPlayCount(el.data.playCount)
                })
                data.list = allVideosRes.datas
            }
            if (categoryRes && categoryRes.code === 200) {
                data.tags = categoryRes.data
            }
            commit('setTab1Data', data)
            return Promise.resolve({ code: 200, success: true })
        },
        async getTab2Data ({ commit }, params) {
            const localData = store.get('videoTab2Data')
            const data = {}
            if (localData !== null) {
                commit('setTab2Data', localData)
                return Promise.resolve({ code: 200, success: true })
            }
            const firstRes = await MV.first(params)
            const hotMVRes = await MV.all(params)
            const exclusiveRes = await MV.exclusive(params)
            const topMVRes = await MV.all(params)
            // const djprogramRes = await home.djprogram(params)
            // data.personalized.map(el => {
            //     el.playCount = filterPlayCount(el.playCount)
            // })
            firstRes.data.map(el => {
                el.playCount = filterPlayCount(el.playCount)
            })
            hotMVRes.data.map(el => {
                el.playCount = filterPlayCount(el.playCount)
            })
            exclusiveRes.data.map(el => {
                el.playCount = filterPlayCount(el.playCount)
            })
            topMVRes.data.map(el => {
                el.playCount = filterPlayCount(el.playCount)
            })
            data.personalized = (firstRes && firstRes.data.slice(0, 6)) || []
            data.topMV = (topMVRes && topMVRes.data) || []
            data.exclusive = (exclusiveRes && exclusiveRes.data) || []
            let res = (hotMVRes && hotMVRes.data) || []
            res = hotMVRes.data.slice(0, 10)
            data.hotMV = res
            // data.mv = (mvRes && mvRes.result.slice(0, 3)) || {}
            // data.djrecommend = (djprogramRes && djprogramRes.result.slice(0, 5)) || []
            commit('setTab2Data', data)
            return Promise.resolve({ code: 200, success: true })
        },
        // 根据分类标签获取列表数据
        getVideoByParams ({ commit }, {
            offset = 0,
            limit = 9,
            ctype = 1,
            order = 1,
            type = '游戏',
            ...ohters
        }) {
            return new Promise((resolve, reject) => {
                let api = 'first'
                let apiStr = 'personalized'
                // console.log(ctype)
                switch (ctype) {
                case 1:
                    api = 'first'
                    apiStr = 'personalized'
                    break
                case 2:
                    api = 'all'
                    apiStr = 'hotMV'
                    break
                case 3:
                    api = 'exclusive'
                    apiStr = 'exclusive'
                    break
                case 5:
                    api = 'top'
                    apiStr = 'topMV'
                    break
                default:
                    break
                }
                MV[api]({
                    limit,
                    offset: offset * limit,
                    type,
                    order,
                    ...ohters
                }).then(res => {
                    const data = {}
                    if (res && res.code === 200) {
                        res.data.map(el => {
                            el.playTime = filterPlayCount(el.playTime)
                            el.score = filterPlayCount(el.score)
                            el.playCount = filterPlayCount(el.playCount)
                        })
                        data[apiStr] = res.data
                        commit('setTab2Data', data)
                        resolve({ code: 200, success: true })
                    }
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 根据分类标签获取列表数据
        getListByCate ({ commit }, { offset = 0, id }) {
            return new Promise((resolve, reject) => {
                let api = 'group'
                if (!id) {
                    api = 'all'
                }
                video[api]({ limit: 9, order: 'hot', id, offset: offset * 9 }).then(res => {
                    if (res && res.code === 200) {
                        res.datas.map(el => {
                            el.data.playTime = filterPlayCount(el.data.playTime)
                            el.data.playCount = filterPlayCount(el.data.playCount)
                        })
                        commit('updateTab1Data', res.datas)
                        resolve(res)
                    }
                }).catch(err => {
                    reject(err)
                })
            })
        },
        setVideoPlayer ({ commit, dispatch }, val) {
            commit('setVideoPlayer', val)
            commit('showVideoPlayer', val.show)
        },
        setVideoPlayerShow ({ commit }, val) {
            commit('showVideoPlayer', val)
        }
    }
}
