<template>
  <div>
    <div class="container-fluid">
      <el-row :gutter="10" class="spannel_list">
        <el-col :sm="6" :xs="12">
          <div class="spannel">
            <em>10015</em><span>篇</span>
            <b>总文章数</b>
          </div>
        </el-col>
        <el-col :sm="6" :xs="12">
          <div class="spannel scolor01">
            <em>123</em><span>篇</span>
            <b>日新增文章数</b>
          </div>
        </el-col>
        <el-col :sm="6" :xs="12">
          <div class="spannel scolor02">
            <em>35</em><span>条</span>
            <b>评论总数</b>
          </div>
        </el-col>
        <el-col :sm="6" :xs="12">
          <div class="spannel scolor03">
            <em>123</em><span>条</span>
            <b>日新增评论数</b>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="container-fluid">
      <el-row class="curve-pie" :gutter="10">
        <el-col :sm="16" :xs="16">
          <div class="gragh_pannel" id="curve_show"></div>
        </el-col>
        <el-col :sm="8" :xs="8">
          <div class="gragh_pannel" id="pie_show"></div>
        </el-col>
      </el-row>
    </div>
    <div class="container-fluid">
      <div class="column_pannel" id="column_show"></div>
    </div>
  </div>
</template>

<script>
// 模块内用命名导出的, 我把他们再收集起来形成对象, 放到echrats变量里
import * as echarts from 'echarts'
export default {
  name: 'myHome',
  mounted () {
    // 初始胡面积图
    this.setCurveChartFn()
    this.picChartFn()
    this.columnChartFn()
  },
  methods: {
    // 初始化面积图
    setCurveChartFn () {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('curve_show'))
      // 数据源(模拟后台返回的数据)
      const aListAll = [
        { count: 36, date: '2019-04-13' },
        { count: 52, date: '2019-04-14' },
        { count: 78, date: '2019-04-15' },
        { count: 85, date: '2019-04-16' },
        { count: 65, date: '2019-04-17' },
        { count: 72, date: '2019-04-18' },
        { count: 88, date: '2019-04-19' },
        { count: 64, date: '2019-04-20' },
        { count: 72, date: '2019-04-21' },
        { count: 90, date: '2019-04-22' },
        { count: 96, date: '2019-04-23' },
        { count: 100, date: '2019-04-24' },
        { count: 102, date: '2019-04-25' },
        { count: 110, date: '2019-04-26' },
        { count: 123, date: '2019-04-27' },
        { count: 100, date: '2019-04-28' },
        { count: 132, date: '2019-04-29' },
        { count: 146, date: '2019-04-30' },
        { count: 200, date: '2019-05-01' },
        { count: 180, date: '2019-05-02' },
        { count: 163, date: '2019-05-03' },
        { count: 110, date: '2019-05-04' },
        { count: 80, date: '2019-05-05' },
        { count: 82, date: '2019-05-06' },
        { count: 70, date: '2019-05-07' },
        { count: 65, date: '2019-05-08' },
        { count: 54, date: '2019-05-09' },
        { count: 40, date: '2019-05-10' },
        { count: 45, date: '2019-05-11' },
        { count: 38, date: '2019-05-12' }
      ]
      // 但是图标要求直接给数字的值, 所以要把对象的值取出来形成2个只有值的数组
      const aCount = []
      const aDate = []
      aListAll.forEach((item) => {
        aCount.push(item.count)
        aDate.push(item.date)
      })
      // 绘制图表
      // 面积图的 echarts 配置项
      const chartopt = {
        title: {
          // 标题
          text: '月新增文章数',
          // 位置居中
          left: 'center',
          // 标题距离容器顶部的距离
          top: '10'
        },
        // 提示框组件
        tooltip: {
          // 坐标轴触发(鼠标放在坐标轴就能出提示框)
          trigger: 'axis'
        },
        // 图例组件(每种颜色的意思)
        legend: {
          // 图例文字解释(要和 series 里 name 对应)
          data: ['新增文章'],
          // 距离容器顶部px
          top: '40'
        },
        // 工具栏
        toolbox: {
          // 要显示
          show: true,
          // 各工具配置项
          feature: {
            // 辅助线开关
            mark: { show: true },
            // 数据视图工具，可以展现当前图表所用的数据，编辑后可以动态更新。
            dataView: { show: true, readOnly: false },
            // 动态类型切换
            magicType: { show: true, type: ['line', 'bar'] },
            // 配置项还原
            restore: { show: true },
            // 点击保存下载图片
            saveAsImage: { show: true }
          }
        },
        // 水平轴显示
        xAxis: {
          name: '日',
          type: 'category',
          // 坐标轴两边留白策略 (不留白)
          boundaryGap: false,
          data: aDate
        },
        // 垂直轴显示
        yAxis: {
          name: '月新增文章数',
          // 以series里的data值做划分段
          type: 'value'
        },
        series: [
          {
            name: '新增文章',
            // 折线图
            type: 'line',
            // 是否平滑视觉引导线，
            smooth: true,
            // 区域填充样式。设置后显示成区域面积图。
            areaStyle: { type: 'default' },
            // 折线拐点标志的样式。
            itemStyle: { color: '#f80', lineStyle: { color: '#f80' } },
            // 真正数据源 (用下标和x轴数组对应)
            data: aCount
          }
        ],
        // 直角坐标系内绘图网格
        grid: {
          show: true,
          // grid 组件离容器偏移量, 左侧
          x: 50,
          // 右侧
          x2: 50,
          // 上
          y: 80,
          // 高度
          height: 220
        }
      }
      myChart.setOption(chartopt)
    },
    // 设置饼状图
    picChartFn () {
      const oPie = echarts.init(document.getElementById('pie_show'))
      const oPieopt = {
        title: {
          text: '分类文章数量比',
          top: 10,
          left: 'center'
        },
        tooltip: {
          // 在图形上才会触发提示
          trigger: 'item',
          // 提示的文字显示的格式
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: ['#5885e8', '#13cfd5', '#00ce68', '#ff9565'], // 系列颜色
        // 图例组件
        legend: {
          x: 'center',
          top: 65,
          data: ['奇趣事', '会生活', '爱旅行', '趣美味'] // 每个部分对应的数据名(要和series里name对应)
        },
        // 工具箱
        toolbox: {
          show: true,
          x: 'center',
          top: 35,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ['pie', 'funnel'],
              option: {
                funnel: {
                  x: '25%',
                  width: '50%',
                  funnelAlign: 'left',
                  max: 1548
                }
              }
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['45%', '60%'],
            center: ['50%', '65%'],
            data: [
              { value: 300, name: '奇趣事' },
              { value: 100, name: '会生活' },
              { value: 260, name: '爱旅行' },
              { value: 180, name: '趣美味' }
            ]
          }
        ]
      }
      oPie.setOption(oPieopt)
    },
    // 设置底部柱状图
    columnChartFn () {
      const oColumn = echarts.init(document.getElementById('column_show'))
      const oColumnopt = {
        title: {
          text: '文章访问量',
          left: 'center',
          top: '10'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['奇趣事', '会生活', '爱旅行', '趣美味'],
          top: '40'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月']
          }
        ],
        yAxis: [
          {
            name: '访问量',
            type: 'value'
          }
        ],
        series: [
          {
            name: '奇趣事',
            type: 'bar',
            barWidth: 20,
            areaStyle: { type: 'default' },
            itemStyle: {
              color: '#fd956a'
            },
            data: [800, 708, 920, 1090, 1200]
          },
          {
            name: '会生活',
            type: 'bar',
            barWidth: 20,
            areaStyle: { type: 'default' },
            itemStyle: {
              color: '#2bb6db'
            },
            data: [400, 468, 520, 690, 800]
          },
          {
            name: '爱旅行',
            type: 'bar',
            barWidth: 20,
            areaStyle: { type: 'default' },
            itemStyle: {
              color: '#13cfd5'
            },
            data: [500, 668, 520, 790, 900]
          },
          {
            name: '趣美味',
            type: 'bar',
            barWidth: 20,
            areaStyle: { type: 'default' },
            itemStyle: {
              color: '#00ce68'
            },
            data: [600, 508, 720, 890, 1000]
          }
        ],
        grid: {
          show: true,
          x: 50,
          x2: 30,
          y: 80,
          height: 260
        },
        // 给x轴设置滚动条
        dataZoom: [
          {
            start: 0,
            end: 100 - 1000 / 31,
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            // 滑动条的 左右2个滑动条的大小
            handleSize: 0,
            // 组件高度
            height: 8,
            // 左边的距离
            left: 45,
            // 右边的距离
            right: 50,
            // 右边的距离
            bottom: 26,
            // 滑动图标的颜色
            handleColor: '#ddd',
            handleStyle: {
              borderColor: '#cacaca',
              borderWidth: '1',
              shadowBlur: 2,
              background: '#ddd',
              shadowColor: '#ddd'
            }
          }
        ]
      }
      oColumn.setOption(oColumnopt)
    }
  }
}
</script>
<style lang="less" scoped>
.spannel_list {
  margin-top: 20px;
}
.spannel {
 height: 100px;
// overflow: hidden;
 text-align: center;
 position: relative;
 background-color: #fff;
 border: 1px solid #e7e7e9;
 margin-bottom: 20px;
}
.spannel em {
  font-style: normal;
  font-size: 50px;
  line-height: 50px;
  display: inline-block;
  margin: 10px 0 0 20px;
  font-family: Arial;
  color: #83a2ed;
}
.spannel span {
  font-size: 14px;
  display: inline-block;
  color: #83a2ed;
  margin-left: 10px;
}
.spannel b {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  line-height: 24px;
  background-color: #e5e5e5;
  color: #333;
  font-size: 14px;
  font-weight: 400;
}
.spannelo1 em ,
.spannel span {
  color: #6ac6e2;
}
.scolor02 em,
.scolor02 span {
  color: #5fd9de;
}

.scolor03 em,
.scolor03 span {
  color: #58d88e;
}

.gragh_pannel{
  height: 350px;
  border: 1px solid #e7e7e9;
  background-color: #fff !important;
  margin-bottom: 20px;
}
.column_pannel {
  margin-bottom: 20px;
  height: 400px;
  border: 1px solid #e7e7e9;
  background-color: #fff !important;
}
</style>
