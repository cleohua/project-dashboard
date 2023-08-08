import floatDialogSlotCompon from "../../../vue/assets/float-dialog-slot-compon.js";

var template = /*html*/ `
<float-dialog
    :elementID="elementID"
    :allowBgClick="allowBgClick"
    :bottomShow="bottomShow"
    :bottomCancelText="bottomCancelText"
    :bottomFinishShow="bottomFinishShow"
>
    <template
        v-slot:header
    >
        <div
            class="floatDialog-header-center"
        >
            <div>提示</div>
            <div>目前尚有記錄「已送出」或「未結案」 </br>故無法刪除!</div>
        </div>
    </template>
    <template>
        <div
            class="scroll-style-gray-thin"
        >
            <div
                v-for="list in lists"
                :key="list.uid"
            >
                <div>
                    <div>缺失原因：{{list.issue}}</div>
                    <div>位置描述：{{list.location}}</div>
                </div>
                <div
                    class="status danger"
                >{{statusText(list.status)}}</div>
            </div>
        </div>
    </template>
</float-dialog>
`

export default {
    name: 'delete-fail-check-compon',
    template,
    components: {
        'float-dialog': floatDialogSlotCompon,
    },
    data() {
        return {
            elementID: 'delete-fail-check',
            allowBgClick: true,
            bottomShow: true,
            bottomCancelText: '關閉',
            bottomFinishShow: false,
            lists: [],
        }
    },
    computed: {
        statusText() {
            return (status) => {
                switch (status) {
                    case 1:
                        return '待送出';
                    case 2:
                        return '未回覆';
                    case 3:
                        return '待審核';
                    case 4:
                        return '結案';
                }
            }
        },
    },
}