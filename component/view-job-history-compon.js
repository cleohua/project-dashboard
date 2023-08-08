import floatDialogSlotCompon from "../../dailyreport/component/float-dialog-slot-compon"

var template = /*html*/ `
<float-dialog
    :elementID="elementID"
    :allowBgClick="allowBgClick"
    :bottomShow="bottomShow"
>
    <template
        v-slot:header
    >
        <div
            class="floatDialog-header-center"
        >
            <div>檢視更替記錄</div>
            <div>{{role}}</div>
        </div>
    </template>
    <template>
        <div
            class="histroy-list"
            v-for="(list, index) in historyList"
            :key="index"
        >
            <div>{{list.title}}</div>
            <div>{{list.label}}</div>
        </div>
    </template>
</float-dialog>`;

export default {
    name: 'view-history-compon',
    template,
    components: {
        'float-dialog': floatDialogSlotCompon,
    },
    data() {
        return {
            elementID: 'view-job-history',
            allowBgClick: true,
            bottomShow: false,
            role: '',
            historyList: [],
        }
    },
}