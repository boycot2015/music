// 把一个类型下的所有url接口放入这一个文件
import baseUrl from '../baseUrl'
export default {
    music: baseUrl + '/comment/music', // 歌曲评论
    like: baseUrl + '/comment/like', // 评论点赞
    playList: baseUrl + '/comment/playList' // 歌曲评论
}
