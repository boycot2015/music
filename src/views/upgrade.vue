<template>
    <div class="yzh-version-container" >
        <div class="title">更新日志</div>
        <h3 class="sub-title">最近更新版本：<b>{{getVersion}}</b> 时间：<span class="public-time">{{ formatTime(versionData.publicTime) }}</span></h3>
        <div class="content clearfix">
            <div class="time-stamp list fl">
                <div class="el-time-item">
                    <div class="title">
                        {{getVersion}} ({{ formatTime(versionData.publicTime) }})
                    </div>
                </div>
                <div
                class="el-time-item"
                    v-for="(version, index) in versionData.data"
                    :key="index"
                    :type="version.type || 'primary'"
                    :color="version.color || '#EC4141'"
                    :size="version.size || 'large'"
                    :timestamp="version.date"
                    placement="top"
                    :class="!version.version && 'bg'"
                    :ref="version.version ? 'version-' + version.version : ''"
                    >
                    <div class="el-card" v-if="!version.version">
                        <h4 v-if="version.message" v-html="'* '+version.message.split(' ').join(`<br/><span style='margin-left:13px;'></span>`)"></h4>
                        <!-- <p>{{ version.name }} 提交于 {{ new Date(version.date).toLocaleString() }}</p> -->
                    </div>
                    <h3 class="title" v-else>
                        {{ version.name }} ({{ formatTime(version.date) }})
                    </h3>
                </div>
            </div>
            <!-- <div class="time-stamp category fl" style="height: 100%;">
                <h3 class="category-title">目录导航</h3>
                <div>
                    <template
                        v-for="(version, index) in versionData.data"
                    >
                        <div
                            :key="index"
                            :type="version.type || 'info'"
                            :color="version.active? 'green' : version.color || '#EC4141'"
                            :size="version.size || 'normal'"
                            :timestamp="version.date"
                            placement="top"
                            :class="version.active?'active':''"
                            :ref="version.version ? 'version-title' + version.version : ''"
                            >
                            <h3 class="title" v-if="version.version" @click="onVersionClick(version)">{{ version.name }}</h3>
                        </div>
                    </template>
                </div>
            </div> -->
        </div>
        <!-- {{ versionData }} -->
    </div>
</template>
<script type="text/javascript">
// import version from '~dist/js/version.json'
import axios from 'axios'
export default {
    name: 'upgrade',
    data () {
        return {
            versionData: {}
        }
    },
    computed: {
        getVersion () {
            if (this.versionData && this.versionData.version) {
                return 'v' + this.versionData.version.slice(0, 4) + (Number(this.versionData.version.split('.')[2]) + 1)
            }
            return ''
        }
    },
    mounted () {
        this.getData()
    },
    methods: {
        getData () {
            axios.get('/version.json').then(({ data }) => {
                console.log(data, 'data')
                this.versionData = {
                    ...data,
                    data: [
                        ...data.data.filter(val => !val.message || (val.message && !val.message.includes('自动提交版本') && !val.message.includes('111'))).sort((a, b) => b.date - a.date)
                    ]
                }
                this.versionData.data.map(el => {
                    el.active = false
                })
                document.querySelector('.yzh-version-container').addEventListener('scroll', (e) => {
                    for (const key in this.$refs) {
                        if (key.indexOf('version-title') > -1 &&
                        this.$refs[key][0] &&
                        e.target.scrollTop === this.$refs[key][0].$el.offsetTop) {
                            // console.log(e.target.scrollTop, this.versionData.data, 'this.versionData.data')
                            this.versionData.data.map(el => {
                                if (key.includes(el.version)) {
                                    el.active = true
                                } else {
                                    el.active = false
                                }
                            })
                        }
                    }
                })
            })
        },
        onVersionClick (version) {
            // console.dir(this.$refs['version-title' + version.version], 'this.versionData.data')
            const versonDom = this.$refs['version-' + version.version]
            const clickDom = this.$refs['version-title' + version.version]
            const offsetTop = versonDom.offsetTop
            const clickDomOffsetTop = clickDom.offsetTop
            this.versionData.data.map(el => {
                if (('version-title' + version.version) === ('version-title' + el.version)) {
                    el.active = true
                    // console.dir(el, 'versonDom')
                } else {
                    el.active = false
                }
            })
            document.querySelector('.yzh-version-container').scrollTo(0, offsetTop)
            document.querySelector('.yzh-version-container .time-stamp').scrollTo(0, clickDomOffsetTop)
        },
        formatTime (time) {
            return new Date(time).toLocaleString().replace(/\//g, '-').split(' ')[0]
        }
    }
}
</script>
<style lang="less">
.yzh-version-container {
    background: transparent;
    // margin: 10px;
    padding: 20px 10px 20px 20px;
    font-size: 16px;
    position: relative;
    .el-scrollbar__wrap {
        overflow-x: hidden;
    }
    .el-time-item {
        &.bg {
            padding: 5px 0;
            // background-color: @c-ddd;
        }
        margin-bottom: 0px;
    }
    .title {
        font-size: 30px;
        font-weight: 400;
        color: @c-333;
        margin-bottom: 30px;
    }
    .content {
        // max-height: 413px;
        padding: 10px;
        // overflow: hidden;
        // overflow-y: auto;
    }
    .time-stamp {
        width: 100%;
        h4 {
            font-size: 16px;
            color: @c-333;
            margin-bottom: 0;
            line-height: 22px;
            user-select: text;
        }
        p {
            font-size: 14px;
            color: @c-666;
        }
        .title {
            border-left: 3px solid @primary;
            margin-top: 30px;
            line-height: 16px;
            margin-bottom: 15px;
            padding-left: 10px;
            font-size: 20px;
        }
    }
    .category {
        width: 220px;
        position: absolute;
        right: 50px;
        top: 58%;
        margin-top: -200px;
        z-index: 100;
        max-height: 400px;
        border-radius: 5px;
        padding: 10px;
        box-shadow: 0 0px 10px @c-e8;
        .el-timeline {
            padding-left: 10px;
        }
        .el-timeline-item.active {
            h3 {
                color: @primary;
            }
        }
        &-title {
            margin-bottom: 20px;
            color: @c-666;
            font-size: 18px;
        }
        h4,.title {
            cursor: pointer;
            margin-bottom: 0;
        }
    }
    .sub-title {
        user-select: text;
        margin-bottom: 10px;
        .public-time {
            color: @c-999;
        }
    }
    .el-button {
        margin-bottom: 20px;
    }
    .countdown {
        border: 2px solid #abc;
    }
}
</style>
