import { song, comment, simi, video, MV } from '@/api/apiList'
import { filterTime, store, filterPlayCount } from '@/utils'
export default {
    namespaced: true,
    state: {
        songDetail: {
            lyricList: [],
            data: {
                total: 0,
                playLists: [],
                songs: [],
                hasMore: true,
                hotComments: [], // 精彩评论
                comments: [] // 所有评论
            },
            currLyric: {
                time: '00:01',
                text: (store.get('playData') !== null && store.get('playData').name) || '纯音乐，请欣赏~'
            },
            songParams: (store.get('songParams') !== null && store.get('songParams')) || ''
        },
        videoDetail: {
            total: 0,
            hasMore: true,
            countData: {},
            playData: {},
            hotComments: [], // 精彩评论
            comments: [], // 所有评论
            videos: []
        },
        showSongPlayer: false
    },
    mutations: {
        setSongData (state, data) {
            for (const key in data) {
                state.songDetail[key] = data[key]
            }
            store.set('songDetailData', data)
        },
        setVideoData (state, data) {
            for (const key in data) {
                state.videoDetail[key] = data[key]
            }
            store.set('videoDetailData', data)
        },
        setCurrentLyric (state, curStr) {
            let currLyric = ''
            state.songDetail.lyricList.map(el => {
                if (el.time === curStr) {
                    currLyric = el
                }
            })
            // 首次播放存第一行
            if (!currLyric && store.get('currLyric') === null) {
                currLyric = {
                    time: '00:01',
                    text: (store.get('playData') !== null && store.get('playData').name) || ''
                }
            }
            currLyric && (state.songDetail.currLyric = currLyric)
            currLyric && store.set('currLyric', currLyric)
            return Promise.resolve({ code: 200, success: true, data: currLyric })
        },
        updateComment (state, data) {
            state.songDetail.data.total = data.total
            state.songDetail.data.hasMore = data.more
            state.songDetail.data.comments = data.comments
        },
        updateVideoComment (state, data) {
            state.videoDetail.total = data.total
            state.videoDetail.hasMore = data.more
            state.videoDetail.comments = data.comments
        },
        setSongPlayer (state, val) {
            val && (state.songParams = val)
            val && store.set('songParams', val)
        },
        showSongPlayer (state, val) {
            state.showSongPlayer = val
        }
    },
    actions: {
        async getsongData ({ commit }, params) {
            const lyricRes = await song.lyric(params)
            // const playlistRes = await song.playlist(params)
            const state = {
                lyricList: [],
                data: {}
            }
            const newArr = []
            if (!params.id) return
            if (lyricRes.code === 200 && !lyricRes.nolyric && lyricRes.lrc && lyricRes.lrc.lyric) {
                const tempArr = lyricRes.lrc.lyric.split('\n')
                tempArr.map((el, i) => {
                    const obj = {}
                    el = (el && el.split(']')) || ''
                    if (i > 0 && el && el[1] && !el[1].includes('[')) {
                        let timeStr = el[0].split('[')[1]
                        timeStr = timeStr.split(':')
                        timeStr[1] = Math.round(timeStr[1]) + ''
                        timeStr[1] = timeStr[1] < 10 ? '0' + timeStr[1] : timeStr[1]
                        timeStr = timeStr.join(':')
                        obj.time = timeStr
                        obj.text = el[1]
                        obj.text && newArr.push(obj)
                    }
                })
                state.lyricList = newArr
            }
            const commentRes = await comment.music(params)
            if (commentRes.code === 200) {
                commentRes.hotComments.map(el => {
                    el.time = filterTime(el.time)
                })
                commentRes.comments.map(el => {
                    el.time = filterTime(el.time)
                })
                state.data.total = commentRes.total
                state.data.hasMore = commentRes.more
                state.data.hotComments = commentRes.hotComments
                state.data.comments = commentRes.comments
            }
            const playListRes = await simi.playlist(params)
            if (playListRes && playListRes.code === 200) {
                state.data.playLists = playListRes.playlists
            }
            const songRes = await simi.song(params)
            if (songRes && songRes.code === 200) {
                state.data.songs = songRes.songs
            }
            commit('setSongData', state)
            commit('setCurrentLyric', state.data.playLists[0])
            return Promise.resolve({ code: 200, success: true })
        },
        async getVideoData ({ commit }, params) {
            const state = {
                total: 0,
                countData: {},
                videos: [],
                hotComments: [], // 精彩评论
                comments: [], // 所有评论
                playData: {}
            }
            // const localData = store.get('videoDetailData')
            // if (localData !== null) {
            //     commit('setVideoData', localData)
            //     return Promise.resolve({ code: 200, success: true })
            // }
            const videoRes = params.type === 'mv' ? await MV.detail({ mvid: params.id }) : await video.detail(params)
            const videoInfoRes = params.type === 'mv' ? await MV.info({ mvid: params.id }) : await video.info({ vid: params.id })
            const videoCommentRes = await video.comment({ id: params.id })
            const relatedRes = await video.related({ id: params.id })
            let videoUrlRes = params.type === 'mv' ? await MV.url({ id: params.id }) : await video.url({ id: params.id })
            if (videoRes && videoRes.code === 200) {
                state.playData = videoRes.data
                state.playData.playCount = filterPlayCount(state.playData.playCount)
                state.playData.playTime = filterPlayCount(state.playData.playTime)
            }
            if (videoInfoRes && videoInfoRes.code === 200) {
                state.countData = videoInfoRes
            }
            if (videoCommentRes && videoCommentRes.code === 200) {
                state.comments = videoCommentRes.comments
                state.hotComments = videoCommentRes.hotComments
                state.total = videoCommentRes.total
            }
            if (relatedRes && relatedRes.code === 200) {
                state.videos = relatedRes.data
                state.videos.map(el => {
                    el.playCount = filterPlayCount(el.playCount)
                    el.playTime = filterPlayCount(el.playTime)
                })
            }
            if (videoUrlRes && videoUrlRes.code === 200) {
                videoUrlRes = videoUrlRes.urls ? videoUrlRes.urls[0] : videoUrlRes.data
                state.playData = { ...state.playData, ...videoUrlRes }
            }
            // console.log(state, 'state')
            commit('setVideoData', state)
            return Promise.resolve({ code: 200, success: true })
        },
        async getCommentByPage ({ commit }, params) {
            const commentRes = await comment.music(params)
            if (commentRes.code === 200) {
                commentRes.comments.map(el => {
                    el.time = filterTime(el.time)
                })
                commit('updateComment', commentRes)
                return Promise.resolve({ code: 200, success: true })
            }
        },
        async getVideoCommentByPage ({ state, commit }, params) {
            const videoCommentRes = await video.comment(params)
            if (videoCommentRes && videoCommentRes.code === 200) {
                commit('updateVideoComment', videoCommentRes)
                return Promise.resolve({ code: 200, success: true })
            }
        },
        setSongPlayer ({ commit, dispatch }, val) {
            commit('setSongPlayer', val)
            dispatch('getsongData', val)
            dispatch('getCommentByPage', val)
            // commit('showSongPlayer', val.show)
        },
        setSongPlayerShow ({ commit }, val) {
            commit('showSongPlayer', val)
        },
        setCurrentLyric ({ state, commit }, curStr) {
            let currLyric = ''
            state.songDetail.lyricList.map(el => {
                if (el.time === curStr) {
                    currLyric = el
                }
            })
            // 首次播放存第一行
            if (!currLyric && store.get('currLyric') === null) {
                currLyric = {
                    time: '00:01',
                    text: (store.get('playData') !== null && store.get('playData').name) || ''
                }
            }
            currLyric && (state.songDetail.currLyric = currLyric)
            currLyric && store.set('currLyric', currLyric)
            commit('setCurrentLyric', currLyric)
            return Promise.resolve({ code: 200, success: true, data: currLyric })
        }
    }
}
