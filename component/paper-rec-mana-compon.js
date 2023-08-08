import * as callapi from "../callAPI.js";
import reportCardCompon from "../component/report-card-compon.js";

var template = /*html*/ `
<div
    id="rec-mana-page"
    @wheel.stop.prevent="onPageWheel"
>
    <div
        class="type-select"
    >
        <div
            v-for="(tab, index) in tabs"
            :class="{'active': index == currentTab}"
            :key="index"
            @click="tabClick(index)"
        >{{tab}}</div>
    </div>
    <report-card
        v-for="report in currentList"
        :key="report.uid + report.record_id"
        :data="report"
        :isproject="isproject"
        :options="cardOptions"
        @onreportclick="reportClick"
        @onmarkclick="markClick"
    ></report-card>
    <div
        class="empty-remind"
        v-if="!editable && currentList.length == 0"
    >無記錄</div>
    <div
        class="add-btn"
        v-if="editable"
        @click="newReportClick"
    >
        <div>+</div>
        <div>新增記錄</div>
    </div>
</div>`

export default {
    name: 'rec-mana-compon',
    template,
    props: {
        uid: {
            type: Number,
            default: 0,
        },
        editable: {
            type: Boolean,
            default: true,
        },
        isproject: {
            type: Boolean,
            default: false,
        }
    },
    components: {
        'report-card': reportCardCompon,
    },
    data() {
        return {
            data: [],
            currentTab: 0,
            cardOptions: {
                showThumbnail: true,
                smallThumbnail: false,
                showDate: false,
                showSupervise: false,
                showStatus: true,
                showLocation: true,
                showOffice: false,
            }
        };
    },
    computed: {
        tabs() {
            // workType: 全部/品質/安衛/技師
            let reportTypeCount = [0, 0, 0, 0, 0];
            this.data.forEach(i => {
                reportTypeCount[i.reportType]++;
            });

            return [
                `現況(${reportTypeCount[4]})`,
                `優良(${reportTypeCount[3]})`,
                `提醒(${reportTypeCount[2]})`,
                `缺失(${reportTypeCount[1]})`,
            ];
        },
        currentList() {
            return this.data.filter(i => {
                // repotType: 現況 > 4, 優良 > 3, 提醒 > 2, 缺失 > 1
                let idArr = [4, 3, 2, 1];
                return i.reportType == idArr[this.currentTab];
            });
        }
    },
    methods: {
        tabClick(index) {
            this.currentTab = index;
        },
        reportClick(info) {
            this.$emit('childevent', 'recordClick', info);
        },
        markClick(uid) {
            this.$emit('childevent', 'markClick', uid);
        },
        newReportClick() {
            let idArr = [4, 3, 2, 1];
            this.$emit('childevent', 'newRecord', idArr[this.currentTab], {
                pictIndependent: true,
                getPictByReportType: true,
                excludeUsedPict: true,
            });
        },
        onPageWheel(e) {
            const sureCall = (value = 100) => {
                const el = this.$el;
                const scrollTop = el.scrollTop;
                const offsetHeight = el.offsetHeight;
                const scrollHeight = el.scrollHeight;

                let newVal = scrollTop + value;
                if (newVal < 0) newVal = 0;
                if (newVal > scrollHeight) newVal = offsetHeight;

                el.scrollTo({
                    top: newVal,
                    // behavior: 'smooth',
                });
            }
            this.$emit('wheel', e, sureCall);
        },
        async refresh() {
            let rsData = await callapi.getPaperRecord(this.uid);
            if (rsData) this.data = rsData;
            await this.$nextTick();
        },
    },
    // created() {
    //     console.log(this);
    // },
}