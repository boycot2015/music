import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

export default function useVirtualList (config) {
    // 获取元素
    let actualHeightContainerEl = null
    let translateContainerEl = null
    let scrollContainerEl = null

    onMounted(() => {
        actualHeightContainerEl = document.querySelector(
            config.actualHeightContainer
        )
        scrollContainerEl = document.querySelector(config.scrollContainer)
        translateContainerEl = document.querySelector(
            config.translateContainer
        )
    })

    // 数据源，便于后续直接访问
    let dataSource = []

    // 数据源发生变动
    watch(
        () => config.data.value,
        newVla => {
            // 更新数据源
            dataSource = newVla

            // 计算需要渲染的数据
            updateRenderData(0)
        }
    )

    // 更新实际高度
    const updateActualHeight = () => {
        let actualHeight = 0
        dataSource.forEach((_, i) => {
            actualHeight += getItemHeightFromCache(i)
        })

        actualHeightContainerEl.style.height = actualHeight + 'px'
    }

    // 缓存已渲染元素的高度
    const RenderedItemsCache = {}

    // 更新已渲染列表项的缓存高度
    const updateRenderedItemCache = index => {
        // 当所有元素的实际高度更新完毕，就不需要重新计算高度
        const shouldUpdate =
            Object.keys(RenderedItemsCache).length < dataSource.length
        if (!shouldUpdate) return

        nextTick(() => {
            // 获取所有列表项元素
            const Items = Array.from(
                document.querySelectorAll(config.itmeContainer)
            )

            // 进行缓存
            Items.forEach(el => {
                if (!RenderedItemsCache[index]) {
                    RenderedItemsCache[index] = el.offsetHeight
                }
                index++
            })

            // 更新实际高度
            updateActualHeight()
        })
    }

    // 获取缓存高度，无缓存，取配置项的 itemHeight
    const getItemHeightFromCache = index => {
        const val = RenderedItemsCache[index]
        return val === 0 ? config.itemHeight : val
    }

    // 实际渲染的数据
    const actualRenderData = ref([])

    // 更新实际渲染数据
    const updateRenderData = scrollTop => {
        let startIndex = 0
        let offsetHeight = 0

        for (let i = 0; i < dataSource.length; i++) {
            offsetHeight += getItemHeightFromCache(i)

            if (offsetHeight >= scrollTop) {
                startIndex = i
                break
            }
        }

        // 计算得出的渲染数据
        actualRenderData.value = dataSource.slice(
            startIndex,
            startIndex + config.size
        )

        // 缓存最新的列表项高度
        updateRenderedItemCache(startIndex)

        // 更新偏移值
        updateOffset(offsetHeight - getItemHeightFromCache(startIndex))
    }

    // 更新偏移值
    const updateOffset = offset => {
        translateContainerEl.style.transform = `translateY(${offset}px)`
    }

    // 滚动事件
    const handleScroll = e => {
        // 渲染正确的数据
        updateRenderData(e.target.scrollTop)
    }

    // 注册滚动事件
    onMounted(() => {
        scrollContainerEl.addEventListener('scroll', handleScroll)
    })

    // 移除滚动事件
    onBeforeUnmount(() => {
        scrollContainerEl.removeEventListener('scroll', handleScroll)
    })

    return { actualRenderData }
}
