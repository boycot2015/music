import axios from '@/api/axios'
import urls from './urls'
// const headers = {}
export default {
    playlist (params) {
        return axios.get(urls.playlist, {
            params
        })
    },
    catlist (params) {
        return axios.get(urls.catlist, {
            params
        })
    },
    subscribe (params) {
        return axios.get(urls.subscribe, {
            params
        })
    },
    like (params) {
        return axios.get(urls.like, {
            params
        })
    },
    hotCate (params) {
        return axios.get(urls.hotCate, {
            params
        })
    },
    singleList (params) {
        return axios.get(urls.singleList, {
            params
        })
    },
    detail (params) {
        let ids = params.ids.split(',')
        if (ids.length > 300) ids = ids.slice(0, 300)
        params.ids = ids.join(',')
        return axios.get(urls.detail, { params })
    },
    topPlaylist (params) {
        return axios.get(urls.topPlaylist, {
            params
        })
    },
    playUrl (params) {
        return axios.get(urls.playUrl, {
            params
        })
    },
    lyric (params) {
        return axios.get(urls.lyric, {
            params
        })
    },
    resource (params) {
        return axios.get(urls.resource, { params })
    },
    recommend (params) {
        return axios.get(urls.recommend, { params })
    }
}
