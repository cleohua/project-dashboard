import floatDialogSlotCompon from "../../dailyreport/component/float-dialog-slot-compon";

var template = /*html*/ `
<float-dialog
    :titleText="titleText"
    :elementID="elementID"
    :allowBgClick="allowBgClick"
    :bottomShow="bottomShow"
>
    <div
        :class="{'loading': loading}"
    >
        <div
        >
            <div
                v-for="(list, index) in summaryListA"
                class="one-line"
                :key="index"
            >
                <div>{{list.name}}</div>
                <div>{{textString(list.text)}}</div>
            </div>
        </div>
        <div>
            <div
                v-for="(list, index) in summaryListB"
                class="one-line"
                :key="index"
            >
                <div>{{list.name}}</div>
                <div>{{textString(list.text)}}</div>
            </div>
        </div>
    </div>
</float-dialog>
`

export default {
    name: 'report-summary-compon',
    template,
    components: {
        'float-dialog': floatDialogSlotCompon,
    },
    data() {
        return {
            titleText: '檢視工地概況',
            elementID: 'report-summary',
            allowBgClick: true,
            bottomShow: false,
            loading: true,
            summaryListA: [
                {
                    name: '報告名稱',
                    text: ['report', 'name'],
                },
                {
                    name: '督導日期',
                    text: ['report', 'date'],
                },
                {
                    name: '督導單位',
                    text: ['report', 'unit'],
                },
                {
                    name: '督導人員',
                    text: ['report', 'user'],
                },
                {
                    name: '會驗人員',
                    text: ['report', 'checker'],
                },
            ],
            summaryListB: [
                {
                    name: '工地名稱',
                    text: ['project', 'name'],
                },
                {
                    name: '工處別',
                    text: ['project', 'office'],
                },
                {
                    name: '開工日期',
                    text: ['project', 'start_date'],
                },
                {
                    name: '預計完工日',
                    text: ['project', 'finish_date'],
                },
                {
                    name: '業主單位',
                    text: ['project', 'owner'],
                },
                {
                    name: '監造單位',
                    text: ['project', 'supervision'],
                },
                {
                    name: '工地主任',
                    text: ['insiders', 0],
                },
                {
                    name: '副手',
                    text: ['insiders', 1],
                },
                {
                    name: '主辦工程師',
                    text: ['insiders', 2],
                },
                {
                    name: '部門主管',
                    text: ['insiders', 3],
                },
            ],
            summaryData: {}
        }
    },
    computed: {
        textString() {
            return (ref) => {
                let text = ref.reduce((obj, key) => {
                    return obj?.[key] || '';
                }, this.summaryData);
                return text;
            }
        }
    },
}