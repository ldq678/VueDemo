import {Toast} from "mint-ui";
export default {
    singleClick: function(){
        // 此方法用户子页面
        // 不用引入mui
        document.addEventListener('plusready', function() {
            var webview = plus.webview.currentWebview();
            plus.key.addEventListener('backbutton', function() {
                webview.canBack(function(e) {
                    if(e.canBack) {
                        webview.back();
                    } else {
                        webview.close(); //hide,quit
                        //plus.runtime.quit();
                    }
                })
            });
        });
    },
    doubleClick: function(){
        document.addEventListener('plusready', function(a) {
            var first = null;
            plus.key.addEventListener('backbutton', function() {
                    //首次按键，提示‘再按一次退出应用’
                    if (!first) {
                        first = new Date().getTime();
                        Toast('再按一次退出应用');//用自定义toast提示最好
                        setTimeout(function() {
                            first = null;
                        }, 1000);
                    } else {
                        if (new Date().getTime() - first < 1000) {
                            plus.runtime.quit();
                        }
                    }
                }, false);
        });
    }
}