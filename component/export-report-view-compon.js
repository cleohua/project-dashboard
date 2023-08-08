import fullsizeDialogSlotCompon from "../../../vue/assets/fullsize-dialog-slot-compon.js";
import exportReportViewTemp from "../template/export-report-view-temp.js";

export default {
    name: 'export-report-view-compon',
    template: exportReportViewTemp,
    components: {
        'full-size': fullsizeDialogSlotCompon,
        'v-select': VueSelect.VueSelect,
    },
    data() {
        let date = new Date();
        return {
            // dialog
            elementID: 'export-report-view',
            titleText: '檢視匯出報告',
            nextBtnShow: false,
            loading: false,
            // datepicker
            range: {
                start: new Date(date.getFullYear(), date.getMonth() - 1, 1),
                end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
            },
            masks: {
                range: {
                    input: 'YYYY/MM/DD',
                },
            },
            // v-select
            porjectText: '',
            supserviseText: '',
            currentProjcet: null,
            currrentSupervise: null,
            projectList: [],
            superviseList: [],
            limit: 10,
            // content
            count: 0,
            reportList: [],
            partition: 10,
            showPageLoad: true,
            currentSelect: null,
            isProject: false,
            // call
            queue: [],
            getData: () => { },
            downloadFile: () => { },
        }
    },
    computed: {
        // v-select
        filtered_0() {
            return this.projectList.filter(tag => {
                let keys = this.porjectText.toLowerCase().split(' ');
                let tagText = tag.text.toLowerCase();
                let search = !keys.map(k => tagText.includes(k)).includes(false);
                return search;
            });
        },
        filtered_1() {
            return this.superviseList.filter(tag => {
                let keys = this.supserviseText.toLowerCase().split(' ');
                let tagText = tag.name.toLowerCase();
                let search = !keys.map(k => tagText.includes(k)).includes(false);
                return search;
            });
        },
        paginated_0() {
            return this.filtered_0.slice(0, this.limit);
        },
        paginated_1() {
            return this.filtered_1.slice(0, this.limit);
        },
        load_0() {
            return this.paginated_0.length < this.filtered_0.length;
        },
        load_1() {
            return this.paginated_1.length < this.filtered_1.length;
        },
    },
    watch: {
        range: {
            handler() {
                this.refresh();
            },
            deep: true,
        },
        currentProjcet() {
            this.refresh();
        },
        currrentSupervise() {
            this.refresh();
        },
    },
    methods: {
        // vselect observer
        async vSelectOnOpen(i) {
            // 0:project, 1: supervise
            let target = i ? this.load_1 : this.load_0;
            if (target) {
                await this.$nextTick();
                this.observer.observe(this.$refs.load);
            }
        },
        vSelectOnClose() {
            this.observer.disconnect();
            this.limit = 10;
        },
        async infiniteScroll([{ isIntersecting, target }]) {
            if (isIntersecting) {
                const ul = target.offsetParent;
                const scrollTop = target.offsetParent.scrollTop;
                this.limit += 10;
                await this.$nextTick();
                ul.scrollTop = scrollTop;
            }
        },
        dateText(time) {
            return moment(time).format('YYYY/MM/DD HH:mm');
        },
        async refresh() {
            let sendData = {
                date: {
                    start: this.range.start.getTime(),
                    end: this.range.end.getTime(),
                },
                supervise: this.currrentSupervise?.uid,
                project: this.currentProjcet?.id,
            }
            let rsData = await this.getData(sendData);
            if (rsData) this.reportList = rsData;
        },
        async download(report) {
            const { uid, time } = report;
            // let padding
            let index = this.queue.findIndex(i => i == uid);
            if (index != -1) {
                floatMsgRemind('套表檔案下載中請稍後');
            } else {
                this.downloadFile({ uid, time }, this.startCall, this.finishCall);
            }
        },
        startCall(uid) {
            let index = this.queue.findIndex(i => i == uid);
            if (index == -1) this.queue.push(uid);
        },
        finishCall(uid) {
            let index = this.queue.findIndex(i => i == uid);
            this.queue.splice(index, 1);
        },
        afterLeave() { }
    },
    created() {
        this.refresh();
    },
    async mounted() {
        this.observer = new IntersectionObserver(this.infiniteScroll);
    },
}