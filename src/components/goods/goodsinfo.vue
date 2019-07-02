<template>
    <div class="goodsinfoContainer">
    <!-- 使用封装的 轮播图子组件 -->
    <!-- 1. 导入这个组件 -->
    <!-- 2. 在父组件的 components 成员中，挂载上这个子组件 -->
    <!-- 3. 以标签的形式，在template中 插入 轮播图子组件 -->
    <!-- 4. 以父组件向子组件传值的方式， 把轮播图数据传递给轮播图子组件 -->
        <swiper :swiperList="swiperList"></swiper>

        <!-- 商品信息 -->
        <div class="goodsInfo">
            <p class="price">
                <span class="sell_price">
                    <span class="label">￥</span>
                    {{this.goodsInfo.sell_price}}
                </span>
                <span class="market_price">
                    <span class="label">商场价:</span>
                    {{this.goodsInfo.market_price}}
                </span>
            </p>
            <p class="title">{{this.goodsInfo.title}}</p>
            <p class="abstract">{{this.goodsInfo.abstract}}</p>
            <p class="add_time">
                <span class="label">发布时间:</span>
                {{this.goodsInfo.add_time | dateFormat}}
            </p>
            <p class="count">
                <span class="stock">
                    <span class="label">库存:</span>
                    {{this.goodsInfo.stock}}
                </span>
                <span class="click_count">
                    <span class="label">关注度:</span>
                    {{this.goodsInfo.click_count}}
                </span>
            </p>    
            <p>
                <span class="label">购买数量:</span>
                <number-box :min="1" :max="this.goodsInfo.stock" 
		:initCount="1" @getcount="getGoodsCount" 
		:goodsId="this.goodsId" 
                :isChangeStore="false"></number-box>
	<!-- 分析： 如何在点击加入购物车的时候，
	从numberBox子组件拿到购买的数量 -->
	<!-- 数量所在的input标签，从属于numberBox子组件，goodinfo.vue父组件
	无法直接获取它的值， 所以需要使用子组件向父组件传值的技巧 -->
	<!-- 子组件向父组件传值的本质是：父组件向子组件传递1个方法，
	子组件调用该方法，并且把要传递的数据当做参数，传递给这个方法 -->
        <!-- 子组件向父组件传值的步骤 -->
        <!-- 1. 在父组件身上定义一个方法：getGoodsCount -->
        <!-- 2. 通过事件调用机制，把该方法传递给子组件：@getcount="getGoodsCount" -->
        <!-- 3. 在numberBox组件中，添加watch，监听 input标签 绑定的 currentNum -->
        <!-- 4. 在watch监听事件中，通过$emit 触发父组件传递过来的 getcount事件 -->
        <!-- 5. 这里切记，不能通过input 标签的change事件来调用$emit -->、
        <!-- 最后再改造一下，可选数量的上限，应该跟库存一致 -->
            </p>
            <p>
                <button type="button" class="mui-btn mui-btn-warning"
                 @click="addToCart">加入购物车</button>
		<button type="button" class="mui-btn mui-btn-danger">
		    立即购买
		</button>
            </p>
            
        </div>
        <div class="sellerInfo">
            <h3>卖家信息</h3>
            <p class="seller">
                <span class="label">卖家:</span>
                {{this.goodsInfo.seller}}
            </p>
            <p class="seller_phone">
                <span class="label">电话:</span>
                {{this.goodsInfo.seller_phone}}
            </p>            
        </div>
        <!-- 商品图片详情 -->
        <div class="img_info">
            <img v-for="item in swiperList" :key="item.id" :src="item.img_url">
        </div>
        <!-- 评论 -->
        <comment :id="this.goodsId"></comment>
    </div>
</template>
<script>
import swiper from '../subComponents/swiper.vue';
import comment from '../subComponents/comment.vue';
//导入数字选择框组件
import numberBox from '../subComponents/numberBox.vue';

export default {
    data(){
        return {
            swiperList: [], //轮播图 图片数组
            goodsId: this.$route.params.id, //获取商品id
            goodsInfo: {}, //商品详情信息
            goodsCount: 1, // 默认的购买数量
        }
    },
    created(){
        this.getSwiperData();
        this.getGoodesInfo();
    },
    methods: {
        getSwiperData(){
            this.$ajax({
                method: 'get',
                url: '/thumbs/' + this.goodsId,
            }).
            then(response => {
                if(response.data.Status == 0){ //正确拿到轮播图数据
                    // Toast('已经获取到数据')
                    this.swiperList = response.data.Data;

                }else{
                    Toast('无法加载轮播图');
                }
            })
        },
        getGoodesInfo(){
            this.$ajax({
                method: 'get',
                url: '/goods/goodsinfo',
                params: {
                    goodsid : this.goodsId,
                }
            }).
            then(response => {
                if(response.data.Status == 0){ //正确拿到轮播图数据
                    // Toast('已经获取到数据')
                    this.goodsInfo = response.data.Data[0];
                }else{
                    Toast('无法加载轮播图');
                }
            })
        },
        addToCart(){ //“添加到购物车”点击事件
        //{id: 商品id, title: 商品名字, price: 价格, img_url: 图片url，
	//  count: 购买数量,stock: 库存}
            var goods = {id: this.goodsId, 
                title: this.goodsInfo.title, 
                price: this.goodsInfo.sell_price, 
                img_url: this.goodsInfo.img_url, 
                count: this.goodsCount, 
                stock: this.goodsInfo.stock
            };
            // 调用
            this.$store.commit("addToCart", goods);
        },
        // goodinfo.vue组件传递给子组件numberBox的方法，
        // 用来获取子组件numberBox中加入购物车的数量
        getGoodsCount(count){
            //在data中添加1个goodsCount变量，用来记录从子组件传过来的
            //购买数量，以便添加该商品进购物车时，知道添加几个
            this.goodsCount = count; 
        }
    },
    components:{
        swiper,
        comment,
        numberBox,
    }
}
</script>
<style lang="less">
.goodsinfoContainer{
    padding: 5px; 
     
    .goodsInfo, .sellerInfo{
        background-color: #fff;
        padding: 5px;
        border-radius: 5px;
        margin-bottom: 10px;
        p{
            font-size: 14px;
            line-height: 16px;
            color: #333;
            margin: 20px;
            .label{
                color: #999;
                margin-right: 20px;
            }
        }   
    }
    .goodsInfo{
        .sell_price{
            color: #ce0000;
            font-size: 28px;
            font-weight: bold;
            margin-right: 20px;
            .label{
                font-size: 12px;
                color: #ce0000;
                margin: 0;
            }
        }
        .market_price{
            font-size: 14px;
            text-decoration: line-through;
            .label{
                margin: 0;
            }
        }
        .title{
            font-size: 16px;
            font-weight: bold;
        }
        .abstract{
            font-size: 15px;
            line-height: 18px;
        }
        .click_count{
            margin-left: 50px;
        }
    }
    .sellerInfo{
        h3{
            font-size: 14px;
            color: #888;
            padding-left: 20px;
        }
    }
    .img_info{
        img{
            width: 100%;
        }
    }
}
</style>
