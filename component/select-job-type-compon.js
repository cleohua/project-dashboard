import floatDialogSlotCompon from "../../dailyreport/component/float-dialog-slot-compon"

var template = /*html*/ `
<float-dialog
    :titleText="titleText"
    :elementID="elementID"
    :allowBgClick="allowBgClick"
    :bottomShow="bottomShow"
    @closeClick="closeClick"
    ref="dialog"
>
    <div
        v-for="(btn, index) in list"
        :key="index"
        :class="{'active':  btn.limit == -1 || btn.limit > 0}"
        @click="btnClick(btn)"
    >
        <div>
            <template 
                v-if="index == 0"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="47.454" height="42.181" viewBox="0 0 47.454 42.181">
                    <path d="M46.681,6H9.773A5.271,5.271,0,0,0,4.5,11.273V42.909a5.271,5.271,0,0,0,5.273,5.273H46.681a5.288,5.288,0,0,0,5.273-5.273V11.273A5.288,5.288,0,0,0,46.681,6ZM25.591,35H21.636V29.727H16.363V35H12.409V19.182h3.954v6.591h5.273V19.182h3.954Zm18.454-2.636A2.644,2.644,0,0,1,41.409,35H39.431v3.954H35.477V35H33.5a2.644,2.644,0,0,1-2.636-2.636V21.818A2.644,2.644,0,0,1,33.5,19.182h7.909a2.644,2.644,0,0,1,2.636,2.636Zm-9.227-1.318H40.09V23.136H34.818Z" transform="translate(-4.5 -6)" fill="#ecce2a"/>
                </svg>
            </template>
            <template
                v-if="index == 1"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="51.839" height="34.083" viewBox="0 0 51.839 34.083">
                <g transform="translate(0 -0.001)">
                    <path d="M135.514-271.252a24.011,24.011,0,0,0-5.417-3.609l-5.228,17.1H113.277L108.1-274.687a23.353,23.353,0,0,0-12.81,20.695v.8h47.952v-1.112A22.7,22.7,0,0,0,135.514-271.252Z" transform="translate(-93.135 278.353)" fill="#ecce2a"/>
                    <path d="M106.644-275.8a52.631,52.631,0,0,0-5.966.337.862.862,0,0,0-.8.763l.986,24.056h11.591l.967-24.056a.856.856,0,0,0-.793-.763A52.18,52.18,0,0,0,106.644-275.8Z" transform="translate(-80.725 275.804)" fill="#ecce2a"/>
                    <path d="M145.788-268.431H95.475a.765.765,0,0,0-.763.767v1.493a.762.762,0,0,0,.763.763h.356a33.96,33.96,0,0,0,15.5,3.742H129.94a33.933,33.933,0,0,0,15.492-3.742h.356a.762.762,0,0,0,.763-.763v-1.493A.765.765,0,0,0,145.788-268.431Z" transform="translate(-94.712 295.749)" fill="#ecce2a"/>
                </g>
                </svg>
            </template>
        </div>
        <div>{{btn.text}}</div>
    </div>
</float-dialog>`;

export default {
    name: 'select-job-type-compon',
    template,
    components: {
        'float-dialog': floatDialogSlotCompon,
    },
    data() {
        return {
            titleText: '選擇新增類型',
            elementID: 'select-job-type',
            allowBgClick: true,
            bottomShow: false,
            list: [],
        }
    },
    methods: {
        btnClick(btn) { 
            this.$refs.dialog.onDialogClose();
        },
        closeClick() { },
    }
}
