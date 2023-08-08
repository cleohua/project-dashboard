import * as callapi from "./callAPI.js";
import config from "./config.js";

import template from "./template/workspace-temp.js";
import reportCardCompon from "./component/report-card-compon.js";
import paperCardCompon from "./component/paper-card-compon.js";

export default {
    name: 'workspaceCompon',
    template,
    components: {
        'report-card': reportCardCompon,
        'paper-card': paperCardCompon,
        'v-select': VueSelect.VueSelect,
    },
    props: {
        date: {
            type: Date,
            default: () => new Date(),
        },
        options: {
            type: Object,
            default: () => { },
        },
        currenttab: {
            type: String,
        },
        isproject: {
            type: Boolean,
        },
        hash: {
            type: Object,
            default: () => { },
        },
        userid: {
            type: String,
        },
        headerflipup: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        const target = this.isproject ? 'project' : 'company';
        const statusOption = config.status[target].slice(1);
        const currentStatus = statusOption?.[0]?.index;

        return {
            // 小齒輪
            optionShow: false,
            statusOption,
            reportTypeOption: _.cloneDeep(config.reportType),
            settingOption: [
                {
                    id: 'user-set',
                    titleText: '內部人員設定',
                    funCall: this.userManaClick,
                    show: this.isproject,
                },
                {
                    id: 'export',
                    titleText: '走動管理報告',
                    funCall: this.exportClick,
                    show: true,
                },
                {
                    id: 'set',
                    titleText: '檢查項目設定',
                    funCall: this.setClick,
                    show: !this.isproject,
                },
            ],
            // 紀錄/報告切換，個人用
            workspaceTab: ['缺失追蹤', '走動管理報告'],
            // 紀錄/報告切換，稽核紀錄用
            recordTab: ['記錄類型', '報告類型'],
            // 報告類型
            paperTab: ['全部稽核類型', '品質內部稽核', '安衛內部稽核', '技師內部稽核'],
            currentStatus,
            currentRecordTab: 0,
            currentWorkspaceTab: 0,
            currentPaperTab: 0,
            listOptions: {
                showThumbnail: true,
                smallThumbnail: false,
                showDate: true,
                showSupervise: true,
                showStatus: true,
                showLocation: true,
                showOffice: !this.isproject,
            },
            paperOptions: {
                showTitle: true,
                showDate: false,
                showProject: false,
                showFaultSummary: !this.isproject,
            },
            projectList: [],
            superviseList: [],
            reportList: [],
            userList: [],
            // datepicker
            range: null,
            masks: {
                range: {
                    input: 'YYYY/MM/DD',
                },
            },
            // v-select
            porjectText: '',
            supserviseText: '',
            userText: '',
            currentProjcet: null,
            currrentSupervise: null,
            currentUser: null,
            currentReportType: 0,
            // observer
            observer: null,
            limit: 10,
            // content 分頁
            count: 0,
            listObserver: null,
            showPageLoad: true,
            dataList: [],
            partition: 10,
            loading: true,
        };
    },
    watch: {
        // 換類型
        currenttab(newVal) {
            this.pageObserver?.disconnect();
            this.dataList = [];
            this.count = 0;
            this.currentStatus = newVal === 'workspace' ? (this.statusOption?.[0]?.index ?? 0) : 0;
            this.currentWorkspaceTab = 0;
            this.currentRecordTab = 0;
            this.currentPaperTab = 0;
        },
        currentProjcet() {
            this.refresh();
        },
        currrentSupervise() {
            this.refresh();
        },
        currentUser() {
            this.refresh();
        },
        currentReportType() {
            this.refresh();
        },
        currentStatus() {
            this.refresh();
        },
        range: {
            handler() {
                this.refresh();
            },
            deep: true,
        },
    },
    computed: {
        // 個人區用
        statusTab() {
            if (this.isproject) {
                return this.statusOption.slice(0, 3);
            } else {
                return this.statusOption.slice(0, -1);
            }
        },
        reportSelectOption() {
            return this.reportTypeOption.slice(1);
        },
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
        filtered_2() {
            return this.userList.filter(tag => {
                let keys = this.userText.toLowerCase().split(' ');
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
        paginated_2() {
            return this.filtered_2.slice(0, this.limit);
        },
        load_0() {
            return this.paginated_0.length < this.filtered_0.length;
        },
        load_1() {
            return this.paginated_1.length < this.filtered_1.length;
        },
        load_2() {
            return this.paginated_2.length < this.filtered_2.length;
        },
        // 個人工作區
        isWorkspaceTab() {
            return this.currenttab === 'workspace';
        },
        // 稽核紀錄
        isAuditTab() {
            return this.currenttab === 'audit';
        },
        // 顯示報告
        isPaperTab() {
            return Boolean(this.currentWorkspaceTab || this.currentRecordTab);
        },
        // 顯示記錄
        isReportTab() {
            return !this.isPaperTab;
        },
        // 紀錄/報告tab 個人工作區用
        showWorkspaceTab() {
            return !this.isproject && this.isWorkspaceTab;
        },
        showTypeSelect() {
            return this.isWorkspaceTab && this.isReportTab;
        },
        showSuperviseSelect() {
            return this.isproject ? this.isAuditTab : false;
        },
        showPrincipalSelect() {
            return this.isproject && this.isAuditTab;
        },
        showReportTypeSelect() {
            return this.isAuditTab && this.isReportTab;
        },
        showReportCard() {
            return this.dataList.length && this.isReportTab;
        },
        showPaperCard() {
            return this.dataList.length && this.isPaperTab;
        },
        headerflipBtnText() {
            return `${this.headerflipup ? '展開' : '收折'}搜尋條件`;
        },
    },
    methods: {
        exportClick() {
            let data = _.cloneDeep({
                projectList: this.projectList,
                superviseList: this.superviseList,
            })
            this.$emit('child-event', 'export', data);
            this.optionShow = false;
        },
        setClick() {
            this.$emit('child-event', 'set');
            this.optionShow = false;
        },
        // vselect observer
        async vSelectOnOpen(i) {
            // 0:project, 1: supervise
            let target = i ? this.load_1 : this.load_0;
            if (target) {
                await this.$nextTick();
                this.observer.observe(this.$refs.load);
            }
        },
        vSelectOnClose(index) {
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
        async infiniteScroll_list([{ isIntersecting, target }]) {
            if (isIntersecting) {
                this.loading = true;
                const parent = target.offsetParent;
                const scrollTop = target.offsetParent.scrollTop;
                let rsData = await this.getPageData();
                if (rsData) {
                    const { count, list } = rsData;
                    this.count = count;
                    if (list.length) {
                        this.dataList = [...this.dataList, ...list];
                        if (this.dataList.length >= count) {
                            this.showPageLoad = false;
                        }
                        parent.scrollTop = scrollTop;
                    }
                }
                this.loading = false;
            }
        },
        workspaceTabClick(index) {
            this.currentWorkspaceTab = index;
            this.refresh();
        },
        paperTabClick(index) {
            this.currentPaperTab = index;
            this.refresh();
        },
        recordTabClick(index) {
            this.currentRecordTab = index;
            this.refresh();
        },
        typeClick(index) {
            this.currentStatus = index;
        },
        removeRangeSelect() {
            this.range = null;
        },
        async refresh() {
            this.loading = true;
            this.count = 0;
            this.pageObserver?.disconnect();
            this.dataList = [];
            let content = this.$refs.content;
            if (content) content.scrollTop = 0;
            const todo = [
                // 督導人清單
                callapi.getSuperviseList(),
                this.getPageData(),
                // 缺改人員清單 / 專案清單
                (this.isproject ? callapi.getPrincipalList : callapi.getProjectList)()
            ]

            const [data1, data2, data3] = await Promise.all(todo);
            this.superviseList = data1;
            this[this.isproject ? 'userList' : 'projectList'] = data3;

            if (data2) {
                const { count, list } = data2;
                this.count = count;
                this.dataList = list;
                let showPageLoad = list.length > 0 && list.length < count;

                this.showPageLoad = showPageLoad;
                await this.$nextTick();
                if (showPageLoad) {
                    this.pageObserver.observe(this.$refs.pageload);
                }
            }
            this.loading = false;
        },
        getPageData() {
            let paperType, reportType, supervise, principal;
            let with_examine = false;
            const status = this.currentStatus;

            if (this.isproject) {
                if (this.isWorkspaceTab) {
                    // 工地端/僅個人
                    principal = callapi.getArgs().user_id;
                    with_examine = true;
                } else {
                    principal = this.currentUser?.uid;
                }
                supervise = this.currrentSupervise?.uid;
            } else {
                // 僅公司端(工地端為缺失回覆區不指定)
                if (this.isWorkspaceTab) {
                    supervise = this.userid;
                } else {
                    supervise = this.currrentSupervise?.uid;
                }
            }

            let date = {
                start: this.range?.start?.getTime() ?? 0,
                end: this.range?.end?.getTime() ?? 0,
            };

            let range = [
                this.dataList.length + 1,
                this.dataList.length + this.partition,
            ];

            switch (this.currenttab) {
                case 'workspace':
                    paperType = 0;
                    // 缺失追蹤
                    reportType = 1;
                    break;
                case 'audit':
                    paperType = this.currentPaperTab;
                    reportType = this.currentReportType;
                    break;
            }

            if (this.isPaperTab) {
                // 取報告
                let sendData = {
                    date,
                    range,
                    supervise,
                    paperType,
                    principal,
                    project: this.currentProjcet?.id,
                    with_examine,
                }
                return callapi.getPaper(sendData);
            } else {
                // 取記錄
                let sendData = {
                    date,
                    range,
                    paperType,
                    reportType,
                    status,
                    supervise,
                    principal,
                    project: this.currentProjcet?.id,
                    with_examine,
                };
                return callapi.getRecordList(sendData);
            }
        },
        onflipBtnClick() {
            this.$emit('child-event', 'flipBtnClick');
        },
        onRecordView(info) {
            this.$emit('child-event', 'onRecordView', info);
        },
        reportClick(info) {
            this.$emit('child-event', 'reportClick', info);
        },
        markClick(info) {
            this.$emit('child-event', 'markClick', info);
        },
        paperClick(uid) {
            this.$emit('child-event', 'paperClick', uid);
        },
        // for poject side
        userManaClick() {
            this.$emit('child-event', 'userManaClick');
        },
    },
    async created() {
        this.refresh();
        console.log(this);
    },
    async mounted() {
        this.observer = new IntersectionObserver(this.infiniteScroll);
        this.pageObserver = new IntersectionObserver(this.infiniteScroll_list);
    },
    destroyed() {
        this.pageObserver.disconnect();
    },
};