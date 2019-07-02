<template>
  <div class="goodsListContainer">
    <ul
      class="mui-table-view"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="isLoading"
      infinite-scroll-distance="100"
      style="max-height: 100vh; overflow-y: auto;"
    >
      <!-- 最后改造成 路由链接 -->
      <!-- <router-link :to="'/home/goodsinfo/' + item.id" class="goodsItem"> -->
      <!-- 编程导航 -->
      <!-- 1. 给li添加click事件 -->
      <!-- 2. 给路由匹配规则添加 name 属性 -->
      <!-- 3. 在click事件中，使用this.$router.push({name:'', params:{}}) 导航-->
      <li
        class="mui-table-view-cell mui-media"
        v-for="item in list"
        :key="item.id"
        @click="goGoodsInfo(item.id)"
      >
        <img class="mui-media-object mui-pull-left" :src="item.img_url">
        <div class="mui-media-body">
          <h3 class="title">{{item.title}}</h3>
          <p class="price">
            <span class="sellPrice">￥{{item.sell_price}}</span>
            <span class="marketPrice">原价:￥{{item.market_price}}</span>
          </p>
          <p class="stock">库存：{{item.stock}}</p>
          <button type="button" class="mui-btn mui-btn-danger">立即抢购</button>
        </div>

        <!-- </router-link> -->
      </li>
      <!--底部判断是加载图标还是提示“全部加载”-->
      <li class="more_loading">
        <mt-spinner type="fading-circle" v-show="is_loading_more" 
        class="loading_icon"></mt-spinner>
        <span v-show="finished">已经全部加载</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [],
      isLoading: false,
      is_loading_more: false, //控制 是否显示 ‘loading’的 图标
      finished: false,
      pageindex: 1,
      pagesize: 8
    };
  },
  created() {
    this.loadMore();
  },
  methods: {
    loadMore: function() {
      console.log(this.list.length);
      this.isLoading = true;
      this.$ajax({
        method: "get",
        url: "/goods/goodslist",
        params: {
          pageindex: this.pageindex,
          pagesize: this.pagesize
        }
      }).then(response => {
        var data = response.data;
        console.log(data);
        if (data.Status == 0) {
          if (data.Data.length > 0) {
            this.list = this.list.concat(data.Data);
            this.pageindex++;
            this.isLoading = false;
          } else {
            this.isLoading = true;
            this.finished = true;
          }
        } else {
          this.finished = true;
        }
      });
    },
    goGoodsInfo(goodsId) {
      this.$router.push({ name: "goodsInfo", params: { id: goodsId } });
    }
  }
};
</script>
<style lang="less">
.goodsListContainer {
  padding: 5px;
  .mui-table-view {
    list-style: none;
    margin: 0;
    padding: 0;
    .mui-table-view-cell {
      .mui-media-object{
        height: 100px;
        min-width: 120px;
      }
      .mui-media-body{
        .title{
          font-size: 16px;
          font-family: '微软雅黑';
          font-weight: bold;
          padding-bottom: 18px;
          color: #333;
        }
        .price{
          font-size: 12px;
          color: #888;
          margin: 0;
          .sellPrice{
              font-size: 18px;
              font-family: '微软雅黑';
              font-weight: bold;
              color: #ce0000;
              margin-right: 20px;
          }
          .marketPrice{
              text-decoration: line-through;
          }
        }
      }
      .mui-btn-danger {
        position: absolute;
        bottom: 30px;
        right: 10px;
      }
    }
    .more_loading {
      font-size: 12px;
      color: #aaa;
      text-align: center;
      border: none;
      .loading_icon {
        position: relative;
        left: 45%;
      }
    }
  }
}
</style>