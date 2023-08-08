import * as callapi from "../callAPI.js";
import edit from "../view/index.js";

import fullsizeDialogSlotCompon from "../../../vue/assets/fullsize-dialog-slot-compon.js";
import template from "../template/edit-paper-temp.js";
import paperPictManaCompon from "./paper-pict-mana-compon.js";
import paperRecManaCompon from "./paper-rec-mana-compon.js";
import paperShManaCompon from "./paper-sh-mana-compon.js";

export default {
    name: 'edit-paper-compon',
    template,
    components: {
        'full-dialog': fullsizeDialogSlotCompon,
        'picture-mana': paperPictManaCompon,
        'record-mana': paperRecManaCompon,
        'sh-mana': paperShManaCompon,
    },
    data() {
        return {
            // dialog
            nextBtnShow: false,
            editMode: true,
            titleText: '走動管理稽查報告(安保中心)',
            subMenu: true,
            nextBtnText: '更多',
            subMenuArr: [
                {
                    text: '記錄提送',
                    eventText: 'sendAll',
                },
                {
                    text: '匯出報告',
                    eventText: 'exportpaper',
                },
                {
                    text: '刪除報告',
                    eventText: 'delete',
                },
            ],
            elementID: 'paper-page',
            // this component
            loading: true,
            infoEditable: true,
            paperInfo: {
                name: '',
                date: '',
                office: '',
                project: {
                    name: '',
                    id: 0,
                },
                user: {
                    name: '',
                    uid: 0,
                },
                // id array
                checker: [],
                // name string array
                checkerName: [],
                // 業務類型
                type: 0,
            },
            editable: true,
            isProject: false,
            // child components
            tabs: [
                {
                    name: '照片存放',
                    show: false,
                    compon: 'picture-mana',
                    keyIndex: 0,
                },
                {
                    name: '管理記錄',
                    show: false,
                    compon: 'record-mana',
                    keyIndex: 1,

                },
                {
                    name: '安衛評分',
                    show: false,
                    compon: 'sh-mana',
                    keyIndex: 2,
                }
            ],
            currentTab: 0,
            pageRefresh: false,
            paperHeaderHide: false,
        };
    },
    computed: {
        filterdTab() {
            return this.tabs.filter(v => v.show);
        },
        currentCompon() {
            return this.filterdTab?.[this.currentTab]?.compon;
        }
    },
    methods: {
        async tabClick(index = this.currentTab) {
            this.loading = true;
            const targetCompon = this.filterdTab[index].compon;
            const diff = this.currentCompon != targetCompon;

            if (diff) {
                if (this.currentCompon == 'picture-mana') {
                    this.$refs['picture-mana'].hide();
                }

                this.currentTab = index;
                await this.$nextTick();
                await this.$refs[targetCompon]?.refresh();

                if (targetCompon == 'picture-mana') {
                    this.$refs['picture-mana'].init();
                }

            } else {
                this.currentTab = index;
                await this.$nextTick();
                await this.$refs[targetCompon]?.refresh();
            }

            this.loading = false;
        },
        editInfo() {
            let info = _.cloneDeep({
                typeId: this.paperInfo.type,
                projectId: this.paperInfo.project.id,
                user: this.paperInfo.user.name,
                checker: this.paperInfo.checker,
                paperID: this.uid,
                date: this.paperInfo.date,
            });

            edit.editPaperInfo({ info, sureCall: this.updateInfo });
        },
        async updateInfo(data) {
            this.pageRefresh = true;
            this.paperInfo = data.info;
        },
        showDetail() {
            edit.viewSummary(this.uid);
        },
        async sendAll() {
            const closeCall = () => {
                if (this.currentCompon == 'picture-mana') this.$refs['picture-mana']?.init();
            }
            const sureCall = () => {
                this.pageRefresh = true;
                if (this.currentCompon == 'picture-mana') this.$refs['picture-mana']?.init();
                if (this.currentCompon == 'record-mana') this.tabClick();
            }
            if (this.currentCompon == 'picture-mana') this.$refs['picture-mana'].hide();
            edit.sendPaperConfirm(this.uid, sureCall, closeCall);
        },
        exportPaper() {
            if (this.currentCompon == 'picture-mana') this.$refs['picture-mana'].hide();

            const closeCall = () => {
                if (this.currentCompon == 'picture-mana') this.$refs['picture-mana']?.init();
            }
            edit.exportSetting(this.uid, closeCall);
        },
        // 刪除報告
        async deletePaper() {
            let ans = await edit.deletePaperWarn();
            if (ans) {
                this.loading = true;
                let rsStatus = await callapi.deletePaper(this.uid);

                if (rsStatus && rsStatus.success) {
                    this.pageRefresh = true;
                    this.$refs['picture-mana']?.hide();
                    this.$refs.dialog.onDialogClose();
                    floatMsgRemind(`刪除成功`);
                } else {
                    this.loading = false;
                    edit.deleteFailCheck(rsStatus.list);
                }
            }
        },
        async deleteSH(uid, score_id) {
            this.loading = true;
            let rsStatus = await callapi.deleteSH({ uid, score_id });
            floatMsgRemind(`刪除${rsStatus ? '成功' : '失敗'}`);
            if (rsStatus) this.tabClick();
            this.loading = false;
        },
        async downloadSH(score_id) {
            let rsData = await callapi.downloadSHScore({
                uid: this.uid,
                score_id,
            });

            if (rsData) {
                const { name, url } = rsData;
                downloadAndRename({ path: url, name });
            } else {
                floatMsgRemind('取得檔案失敗');
            }
        },
        childEvent(event, ...args) {
            // console.log(event, args);
            switch (event) {
                case 'newRecord': {
                    const closeCall = async (update) => {
                        // // 檢查安衛頁是否顯示
                        if (update) {
                            this.loading = true;
                            let getInfo = callapi.getPaperInfo(this.uid);
                            this.tabClick();
                            const { showSHtab, infoEditable } = await getInfo;
                            this.tabs[2].show = showSHtab;
                            this.infoEditable = infoEditable;
                            this.pageRefresh = true;
                        } else {
                            if (this.currentCompon == 'picture-mana') this.$refs['picture-mana']?.init();
                        }
                    }
                    // args[0]: reportType
                    // args[1]: options
                    // selectPict: [{uid, src}]
                    let { selectPict = [], pictIndependent = false, getPictByReportType = false, excludeUsedPict = false } = args[1];

                    edit.editRecordPage({
                        paperID: this.uid,
                        paperInfo: _.cloneDeep(this.paperInfo),
                        selectPict,
                        reportType: args[0],
                        closeCall,
                        pictIndependent,
                        getPictByReportType,
                        excludeUsedPict,
                    });

                    if (this.currentCompon == 'picture-mana') this.$refs['picture-mana'].hide();
                    break;
                }
                // 記錄管理
                case 'markClick':
                    break;
                case 'recordClick': {
                    const closeCall = async (update) => {
                        // // 檢查安衛頁是否顯示
                        if (update) {
                            this.loading = true;
                            let getInfo = callapi.getPaperInfo(this.uid);
                            this.tabClick();
                            const { showSHtab, infoEditable } = await getInfo;
                            this.tabs[2].show = showSHtab;
                            this.infoEditable = infoEditable;
                            this.pageRefresh = true;
                        } else {
                            if (this.currentCompon == 'picture-mana') this.$refs['picture-mana']?.init();
                        }
                    }
                    const { paperID, recordIdArr } = args[0];
                    if (this.isProject) {
                        edit.viewRecordForProject({
                            paperID,
                            recordIdArr,
                            closeCall,
                        })
                    } else {
                        edit.viewRecord({
                            paperID,
                            recordIdArr,
                            nextBtnShow: this.editable,
                            closeCall,
                        });
                    }
                    break;
                }
                // 安衛
                case 'newSHrecord': {
                    const sureCall = data => this.childEvent('setSHScore', data);
                    edit.setSHRate(this.uid, sureCall);
                    break;
                }
                case 'setSHScore': {
                    const sureCall = () => this.childEvent('refresh');
                    edit.setSHScore(args[0], sureCall);
                    break;
                }
                case 'shRecordClick':
                    const sureCall = () => this.childEvent('refresh');
                    edit.viewShScore(this.uid, args[0], sureCall);
                    break;
                case 'downloadSHrecord':
                    this.downloadSH(args[0]);
                    break;
                case 'deleteSHrecord':
                    this.deleteSH(this.uid, args[0]);
                    break;
                case 'refresh':
                    this.tabClick();
                    break;
                default:
                    console.warn('no match event', event);
                    break;
            }
        },
        async setData(data) {
            const { info, infoEditable, showPicture, showSHtab, editable = false } = data;

            this.nextBtnShow = editable;
            info.date = info.date.replace(/-/g, '/');
            this.paperInfo = info;
            this.infoEditable = infoEditable;
            this.tabs[0].show = showPicture;
            this.tabs[1].show = true;
            this.tabs[2].show = showSHtab;
            this.editable = editable;
        },
        pageWheel(e, sureCall) {
            const childEl = this.$refs[this.currentCompon]?.$el;
            const scrollTop = childEl.scrollTop;
            // console.log(scrollTop);
            if (e.deltaY > 0) {
                if (this.paperHeaderHide) {
                    sureCall?.(130);
                } else {
                    this.paperHeaderHide = true;
                }
            } else {
                if (scrollTop == 0) {
                    this.paperHeaderHide = false;
                } else {
                    sureCall?.(-130);
                }
            }
        },
        childPageWheel(e, sureCall) {
            this.pageWheel(e, sureCall);
        }
    },
}