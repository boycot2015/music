// import Home from '@/views/Home.vue'
// import store from '@/store'
import Layout from '@/views/layout/index.vue'
// import Cookies from 'js-cookie'
const routes = [
    {
        name: '推荐',
        path: '/',
        redirect: '/index',
        component: Layout,
        meta: {
            icon: 'record',
            title: '推荐',
            unfold: true
        },
        children: [
            {
                id: 1,
                name: 'index',
                path: '/index',
                component: () => import('@/views/index.vue'),
                meta: {
                    icon: 'music',
                    title: '发现音乐'
                }
            },
            {
                id: 2,
                name: 'FM',
                path: '/FM/index',
                component: () => import('@/views/FM/index.vue'),
                meta: {
                    icon: 'FM',
                    title: '私人FM',
                    hideInMenu: true

                }
            },
            {
                id: 3,
                name: 'look',
                path: '/look/index',
                component: () => import('@/views/look/index.vue'),
                meta: {
                    icon: 'replay',
                    title: 'LOOK直播',
                    login: true,
                    hideInMenu: true

                }
            },
            {
                id: 4,
                name: 'videos',
                path: '/video/index',
                component: () => import('@/views/video/index.vue'),
                meta: {
                    icon: 'video',
                    login: false,
                    title: '视频'
                }
            },
            {
                id: 5,
                name: 'friend',
                path: '/friend/index',
                component: () => import('@/views/friend/index.vue'),
                meta: {
                    icon: 'friend',
                    login: true,
                    title: '朋友'

                }
            }
        ]
    },
    {
        name: 'myMusic',
        path: '/index',
        component: Layout,
        meta: {
            icon: 'record',
            title: '我的音乐',
            unfold: true

        },
        unfold: true,
        children: [
            {
                id: 1,
                name: 'myMusicIndex',
                path: '/myMusic/index',
                component: () => import('@/views/myMusic/index.vue'),
                meta: {
                    title: '本地音乐',
                    login: true,
                    icon: 'my-music'

                }
            },
            {
                id: 2,
                name: 'download',
                path: '/myMusic/download',
                component: () => import('@/views/myMusic/download.vue'),
                meta: {
                    icon: 'download',
                    login: true,
                    title: '下载管理'

                }
            },
            {
                id: 3,
                name: 'cloud',
                path: '/myMusic/cloud',
                component: () => import('@/views/myMusic/cloud.vue'),
                meta: {
                    icon: 'cloud',
                    login: true,
                    title: '我的音乐云盘'

                }
            },
            {
                id: 4,
                name: 'dj',
                path: '/myMusic/dj',
                component: () => import('@/views/myMusic/dj.vue'),
                meta: {
                    icon: 'radio',
                    login: true,
                    title: '我的电台'

                }
            },
            {
                id: 5,
                name: 'collect',
                path: '/myMusic/collect',
                component: () => import('@/views/myMusic/index.vue'),
                meta: {
                    title: '我的收藏',
                    login: true,
                    icon: 'star-user'

                }
            }
        ]
    },
    {
        name: 'myCreate',
        path: '/myCreate',
        component: Layout,
        meta: {
            // rightIcon: 'right',
            unfold: true,
            hideInMenu: false,
            title: '创建的歌单'

        },
        request: {
            id: 1,
            key: 'id',
            sort: (arr, { uid }) => arr.slice(1).filter(_ => _.userId === uid),
            apiUrl: '/user/playlist',
            name: 'list',
            path: '/songs/list',
            meta: {
                login: true,
                title: '歌单详情列表'
            }
        },
        children: []
    },
    {
        name: 'favCollect',
        path: '/favCollect',
        component: Layout,
        request: {
            id: 1,
            key: 'id',
            sort: (arr, { uid }) => arr.slice(1).filter(_ => _.userId !== uid),
            apiUrl: '/user/playlist',
            name: 'list',
            path: '/songs/list',
            meta: {
                login: true,
                title: '歌单详情列表'
            }
        },
        meta: {
            // rightIcon: 'right',
            title: '收藏的歌单',
            unfold: true,
            hideInMenu: false,
            login: true
        },
        children: []
    },
    {
        name: 'list',
        path: '/songs/list',
        component: Layout,
        meta: {
            icon: 'right',
            hideInMenu: true,
            activePath: '/index',
            title: '歌单详情列表'

        },
        children: [
            {
                id: 1,
                name: 'list',
                path: '/songs/list',
                component: () => import('@/views/songs/list.vue'),
                meta: {
                    icon: 'right',
                    login: true,
                    title: '歌单详情列表'

                },
                rightIcon: 'beckoning'
            }
        ]
    },
    {
        name: 'detail',
        path: '/songs/detail',
        component: Layout,
        meta: {
            icon: '',
            title: '歌单详情',
            activePath: '/index',
            hideMenu: true,
            hideInMenu: true

        },
        children: [
            {
                id: 1,
                name: 'detail',
                path: '/songs/detail',
                component: () => import('@/views/songs/detail.vue'),
                meta: {
                    icon: 'right',
                    title: '歌单详情'

                },
                rightIcon: 'beckoning'
            }
        ]
    },
    {
        name: 'list',
        path: '/songs/list',
        component: Layout,
        meta: {
            icon: 'right',
            activePath: '/index',
            hideInMenu: true,
            title: '歌单详情列表'

        },
        children: [
            {
                id: 1,
                name: 'list',
                path: '/songs/list',
                component: () => import('@/views/songs/list.vue'),
                meta: {
                    icon: 'right',
                    login: true, // 是否需要登录 true 需要，false 不需要，默认不需要
                    title: '歌单详情列表'

                },
                rightIcon: 'beckoning'
            }
        ]
    },
    {
        name: 'videoDetail',
        path: '/video/detail',
        component: Layout,
        meta: {
            icon: '',
            title: '视频详情',
            activePath: '/video/index',
            hideMenu: true,
            hideInMenu: true

        },
        children: [
            {
                id: 1,
                name: 'videoDetail',
                path: '/video/detail',
                component: () => import('@/views/video/detail.vue'),
                meta: {
                    icon: 'right',
                    hideFooter: true,
                    title: '视频详情'

                },
                rightIcon: 'beckoning'
            }
        ]
    },
    {
        name: 'commonPage',
        path: '/common/page',
        component: Layout,
        meta: {
            icon: '',
            title: '更多列表',
            hideInMenu: true

        },
        children: [
            {
                id: 1,
                name: 'commonPage',
                path: '/common/page',
                component: () => import('@/views/list-page.vue'),
                meta: {
                    icon: 'right',
                    title: '更多列表'
                },
                rightIcon: 'beckoning'
            }
        ]
    },
    {
        path: '/upgrade',
        name: 'upgrade',
        component: Layout,
        meta: {
            title: '更新日志',
            unfold: true,
            hideInMenu: false
        },
        children: [{
            path: '/upgrade',
            name: 'upgrade',
            component: () => import('@/views/upgrade.vue'),
            meta: {
                title: '更新日志',
                hideInMenu: false
            }
        }]
    },
    {
        path: '/desktop-lyric',
        name: 'lyricPage',
        component: () => import('@/views/lyric.vue'),
        meta: {
            title: '音乐歌词',
            hideInMenu: true
        }
    },
    {
        path: '/mini',
        name: 'mini',
        component: () => import('@/views/mini-box.vue'),
        meta: {
            title: '音乐盒子',
            hideInMenu: true
        }
    },
    {
        path: '/error',
        name: 'error',
        component: Layout,
        meta: {
            title: 'error',
            hideInMenu: true
        },
        children: [{
            path: '/error',
            name: 'error',
            component: () => import('@/views/error.vue'),
            meta: {
                title: '网页不存在！',
                hideInMenu: true
            }
        }]
    }
]
export const dymicRoutes = [
    {
        name: 'myCreate',
        path: '/myCreate',
        component: Layout,
        meta: {
            rightIcon: 'right',
            // unfold: true,
            hideInMenu: false,
            title: '创建的歌单'
        },
        children: [{
            name: 'myCreateList',
            path: '/myCreate/playlist',
            component: () => import('@/views/songs/list.vue'),
            meta: {
                login: true,
                title: '歌单详情列表'
            }
        }]
    },
    {
        name: 'favCollect',
        path: '/favCollect',
        component: Layout,
        meta: {
            rightIcon: 'right',
            title: '收藏的歌单',
            // unfold: true,
            hideInMenu: false,
            login: true
        },
        children: [{
            name: 'favCollectList',
            component: () => import('@/views/songs/list.vue'),
            path: '/favCollect/playlist',
            meta: {
                login: true,
                title: '歌单详情列表'
            }
        }]
    }
]
export default routes
