// 把所有的api文件夹导入到这一个文件中来
import comment from './comment'
import song from './song'
import home from './home'
import simi from './simi'
import search from './search'
import toplist from './toplist'
import artist from './artist'
import video from './video'
import MV from './MV'
import user from './user'
import dj from './dj'
import wallpaper from './wallpaper'
const apis = {
    comment,
    song,
    home,
    simi,
    search,
    toplist,
    artist,
    video,
    user,
    MV,
    dj,
    wallpaper
}
export default {
    ...apis
}
export {
    comment,
    song,
    home,
    simi,
    search,
    toplist,
    artist,
    video,
    user,
    MV,
    dj,
    wallpaper
}
