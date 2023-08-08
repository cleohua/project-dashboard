import reportCardCompon from "./report-card-compon.js";
import template from "../template/paper-card-temp.js";

// 缺失紀錄數量統計
// fault_count: { summary, unsubmitted, wait未回覆, pending待審, delag, finish }
export default {
    name: 'paper-card-compon',
    template,
    components: {
        'report-card': reportCardCompon,
    },
    props: {
        data: {
            type: Object,
            default: () => ({}),
        },
        options: {
            type: Object,
            default: () => ({
                showTitle: true,
                showDate: false,
                showProject: false,
                showFaultSummary: true,
            })
        },
        isproject: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            typeList: ['現況', '優良', '提醒', '缺失'],
            currentType: 0,
            flipdown: false,
            recordOptions: {
                showThumbnail: true,
                smallThumbnail: true,
                showDate: false,
                showSupervise: false,
                showStatus: true,
                showLocation: true,
                showOffice: false,
            }
        }
    },
    computed: {
        currentList() {
            return this.data.report.filter(i => {
                let idArr = [4, 3, 2, 1];
                return i.reportType == idArr[this.currentType];
            });
        },
        typeText() {
            return (index) => {
                let count = this.data.report.filter(i => {
                    let idArr = [4, 3, 2, 1];
                    return i.reportType == idArr[index];
                }).length;

                return `${this.typeList[index]}(${count})`;
            }
        },
        showTitle() {
            return this.options?.showTitle ?? true;
        },
        showDate() {
            return this.options?.showDate ?? true;
        },
        showProject() {
            return this.options?.showProject ?? true;
        },
        showFaultSummary() {
            return this.options?.showFaultSummary ?? false;
        },
        summaryCount() {
            return this.data.fault_count?.summary ?? 0;
        },
        unsubmittedCount() {
            return this.data.fault_count?.unsubmitted ?? 0;
        },
        waitCount() {
            return this.data.fault_count?.wait ?? 0;
        },
        pendingCount() {
            return this.data.fault_count?.pending ?? 0;
        },
        delagCount() {
            return this.data.fault_count?.delag ?? 0;
        },
        finishCount() {
            return this.data.fault_count?.finish ?? 0;
        },
    },
    methods: {
        typeClick(index) {
            this.currentType = index;
        },
        listClick() {
            this.$emit('onpaperClick', this.data.uid);
        },
        reportClick(info) {
            this.$emit('onrecordview', info);
        }
    },
}