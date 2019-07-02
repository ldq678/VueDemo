<template>
    <div class="cartContainer">
        <h2>购物车</h2>
        <transition-group class="mui-table-view" tag="ul">
        <li class="mui-table-view-cell mui-media" v-for="item in cart" :key="item.id">
            <!-- 给每个购买项 添加 路由导航 -->
            <router-link :to="'/home/goodsinfo/' + item.id" tag="div" class="rlink">
                <img class="mui-media-object mui-pull-left" :src="item.img_url">
                <div class="mui-media-body">
                    <p class="goods-info">
                        <span class="title">{{item.title}}</span>
                        <span class="price">￥{{item.price}}</span> 
                    </p>
                    <p class="goods-control">
                        <number-box :initCount="item.count" :min="1" :max="item.stock"
                         :goodsId="item.id" :isChangeStore="true">
                        </number-box>
                        <span class="remove" @click.stop="remove(item.id)">×</span>
                    </p>
                </div> 
            </router-link>                     					
        </li>
        </transition-group>
        <div class="mui-table-view-cell mui-media total-price">
            总金额 <span class="price">￥{{$store.getters.getTotalPrice}}</span>
        </div>        
        <button type="button" class="mui-btn mui-btn-danger mui-btn-block">结算</button>
    </div>
</template>
<script>
import numberBox from '../subComponents/numberBox.vue';

export default {
    data(){
        return {
            cart: [],
        }
    },
    created(){
        this.getCart();
    },
    methods: {
        getCart: function(){
            this.cart = JSON.parse(localStorage.getItem('cart') || '[]')
        },
        remove: function(id){
            console.log(id);
            this.$store.commit("removeGoods", id);
            this.getCart();
        }
    },
    components: {
        numberBox
    }
}
</script>
<style lang="less" scoped>
.cartContainer{
    .v-leave-to{
        opacity: 0;
    }
    // .v-enter-active,
    .v-leave-active{
        transition: all 0.5s ease;
    }
    /* 删除时，li离开的动画效果，两者要搭配使用 */
    .v-move{
        transition: all 0.7s ease;
    }
    .v-leave-active{
        position: absolute;
    }
    // 以下是基础样式
    padding-bottom: 80px;
    h2{
        font-size: 18px;
        text-align: center;
        color: #444;
        background-color: #fff;
        line-height: 30px;
    }
    .mui-table-view{
        .mui-table-view-cell{
            width: 100%;
            .rlink{
                width: 100%;
            }
        }
        .mui-media-object{
            line-height: 80px;
            height: 80px;
            width: 100px;
            min-width: 100px;
        }
        .mui-media-body{
            .goods-info{
                font-size: 16px;
                color: #444;
                line-height: 18px;
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                .price{
                    color: #333;
                    font-weight: bold;
                }
            }
            .goods-control{
                position: relative;
                display: flex;
                justify-content: space-between;
                .remove{
                    font-size: 30px;
                    padding: 10px;
                }
            }
        }        
    }
    .mui-btn-danger{
        position: fixed;
        bottom: 40px;
    }
    .total-price{
        font-size: 16px;
        color: #333;
        font-weight: bold;
        text-align: center;
        background-color: #fff;
        padding: 10px;
        .price{
            color: #dd524d;
        }
    }
}
</style>