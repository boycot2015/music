<template>
    <li class="music-list-item flexbox-h jsut-b" :class="{'grid': type === 2}">
        <!-- {{ data }} {{ type }} -->
        <div class="order tc" v-if="order">
            <span class="num" style="padding-right: 0;" v-if="type === 1" v-html="(index + 1) < 10 ? '0' + (index + 1) : (index + 1)"></span>
            <span class="num" style="padding-right: 0;" v-else-if="type === 3" v-html="(count - index) < 10 ? '0' + (count - index) : (count - index)"></span>
            <span class="num" style="padding-right: 0;" v-else :class="{'red': index < 3}" v-html="index + 1"></span>
        </div>
        <div class="operation tc" style="flex-basis: 78px;padding-right: 0;" v-if="operation">
            <span class="icon-music-love"></span>
            <span class="icon-music-download"></span>
        </div>
        <div class="img tc" v-if="type === 3 || type === 100 || type === 10 || type === 1002">
            <img v-if="data.coverUrl || data.picUrl || data.avatarUrl" style="width: 50px;height: 50px;" :src="data.coverUrl || data.picUrl || data.avatarUrl" alt="">
            <i class="icon-music-pause" v-if="type === 3"></i>
        </div>
        <div class="sing-info flex-4 line-one">
            <span class="name line-one">{{data.name || data.nickname}}</span>
            <span class="source line-one">{{data.al && data.al.name}}</span>
        </div>
        <div class="sing-info flex-4 line-one" v-if="data.artists || (data.track && data.track.artists)">
            <template v-if="data.artists">
                <i v-for="(singer, cindex) in data.artists || []" :key="cindex" v-html="singer.name + (cindex < data.artists.length - 1 ? '/' : '')"></i>
            </template>
            <template v-else>
                <i v-for="(singer, cindex) in data.track.artists || []" :key="cindex" v-html="singer.name + (cindex < data.track.artists.length - 1 ? '/' : '')"></i>
            </template>
        </div>
        <div class="play-info flex-2 tl line-one" v-if="data.listenerCount >= 0">
            <span class="source line-one">播放: </span>
            <span class="source line-one">{{data.listenerCount}}</span>
        </div>
        <div class="star-info flex-2 tl line-one" v-if="data.likedCount >= 0">
            <span class="source line-one">赞: </span>
            <span class="source line-one">{{data.likedCount}}</span>
        </div>
        <div class="play-info flex-2 tl line-one" v-if="data.createTime">
            <span class="source line-one">{{data.createTime.replace(/\//g,'-')}}</span>
        </div>
        <template v-if="!isminiPlay">
            <span class="singer line-one flex-2" v-if="data.ar">
                <i v-for="(singer, cindex) in data.ar " :key="cindex" v-html="singer.name + (cindex < data.ar.length - 1 ? '/' : '')"></i>
            </span>
            <span class="collect line-one flex-2" v-if="isPlay && data.al">{{data.al.name}}</span>
            <!-- <span class="icon-music-link" v-if="order && !isminiPlay"></span> -->
            <span class="time flex-1 tl">{{data.dt || data.playTime || (data.track && data.track.playTime)}}</span>
        </template>
    </li>
</template>

<script>
export default {
    props: {
        data: {
            type: [Object],
            default: () => ({})
        },
        operation: {
            type: Boolean,
            default: true
        },
        isminiPlay: {
            type: Boolean,
            default: false
        },
        isPlay: {
            type: Boolean,
            default: true
        },
        order: {
            type: Boolean,
            default: true
        },
        index: {
            type: Number,
            default: 0
        },
        type: {
            type: Number,
            default: 1
        },
        count: {
            type: Number,
            default: 1
        }
    }
}
</script>

<style>

</style>
