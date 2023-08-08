// -------------公司端-------------
import * as callapi from "../callAPI.js";

import floatDialog from "../../../vue/assets/float-dialog-slot-compon.js";
import bottomNoticeCompon from "../../../vue/assets/bottom-notice-compon.js";
import chooseDialogCompon from "../../../vue/assets/choose-dialog-compon.js";

import selectDialogCompon from "../../dailyreport/component/select-dialog-compon.js";

import bottomPopoverCompon from "../component/bottom-popover-compon.js";
import editChecklistCompon from "../component/edit-checklist-compon.js";
import editChecklistShCompon from "../component/edit-checklist-sh-compon.js";
import editChecklistInfoShCompon from "../component/edit-checklist-info-sh-compon.js";
import editTagCompon from "../component/edit-tag-compon.js";
import editPaperInfoCompon from "../component/edit-paper-info-compon.js";
import settingCompon from "../component/setting-compon.js";
import paperCompon from "../component/paper-compon.js";
import editRecordCompon from "../component/edit-record-compon.js";
import selectCheckitemCompon from "../component/select-checkitem-compon.js";
import selectDialogComponVer2 from "../component/select-dialog-compon-ver2.js";
import selectPenaltyCompon from "../component/select-penalty-compon.js";
import selectPictureCompon from "../component/select-picture-compon.js";
import selectWorkerCompon from "../component/select-worker-compon.js";
import mapMarkerCompon from "../component/map-marker-compon.js";
import shScoreRateCompon from "../component/sh-score-rate-compon.js";
import shScoreCompon from "../component/sh-score-compon.js";
import accordingData from "../record-accord-data-class.js";
import paperConfirmCompon from "../component/paper-confirm-compon.js";
import exportSelectCompon from "../component/export-select-compon.js";
import exportSettingCompon from "../component/export-setting-compon.js";
import reportSummaryCompon from "../component/report-summary-compon.js";
import deleteFailCheckCompon from "../component/delete-fail-check-compon.js";
import companyResponseCompon from "../component/company-response-compon.js";
import comfirmResponseCompon from "../component/comfirm-response-compon.js";
import edit from "./index.js";

// 檢查項目提示
export function emptyChecklistRemind(options = [], isAdmin) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'empty-remind');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#empty-remind',
        mixins: [bottomNoticeCompon],
        data() {
            let text = '尚未設定檢查項目，此功能目前無法正常運作';

            return {
                allowBgClick: true,
                noticeAreaClass: `red-bg${!isAdmin ? ' text-center' : ''}`,
                // bgClass: '',
                text: isAdmin ? text : text + '，請管理員協助處理。',
                options: isAdmin ? options : [],
            }
        },
    });
};

// 公司端檢查項目設定
export function settingPage(closeCall) {
    const putArea = document.getElementById('fullsize');
    putArea.classList.add('active');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'setting-page');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#setting-page',
        mixins: [settingCompon],
        methods: {
            afterLeave() {
                closeCall?.();
                if (!putArea.querySelector(':scope > div')) {
                    putArea.classList.remove('active');
                }
                this.$destroy();
            },
        }
    });
};

// 報告匯出
// 棄用
export function exportSelect(data, sureCall) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'export-select');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#export-select',
        mixins: [exportSelectCompon],
        data() {
            return {
                ...data,
                sureCall,
                getData: callapi.getPaper,
            }
        }
    });
};

// 編輯匯出報告內容
export async function exportSetting(uid, closeCall) {
    const putArea = document.getElementById('fullsize');
    putArea.classList.add('active');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'export-setting');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#export-setting',
        mixins: [exportSettingCompon],
        data() {
            return {
                getData: callapi.getExportData,
                uid,
            }
        },
        methods: {
            afterLeave() {
                closeCall?.();
                if (!putArea.querySelector(':scope > div')) {
                    putArea.classList.remove('active');
                }
            },
            // type > 0: 暫存, 1: 儲存建立, 2: 建立下載
            async nextBtnClick(type) {
                let sendData = this.output();
                sendData['type'] = type < 2 ? type : 1;

                let rsStatus = await callapi.updateExportData(sendData);
                if (rsStatus) {
                    this.refresh();
                    floatMsgRemind(`${type == 0 ? '暫存' : '儲存'}成功`);

                    if (type == 2) edit.epxortFromat({ uid: this.uid });
                }
            },
            async closeClick() {
                // let wait = await warn4export();
                // if (wait) this.$refs.dialog.onDialogClose();
                this.$refs.dialog.onDialogClose();
            }
        },
        async created() {
            await this.refresh();
            if (Object.keys(this.recordData).length == 0) {
                floatMsgRemind('此份報告無記錄內容');
            }
        },
    });
};

// 取消編輯詢問
export async function warn4export() {
    const putArea = document.getElementById('main-wrapper');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'warn');
    putArea.appendChild(vueArea);

    return new Promise((resolve) => {
        new Vue({
            el: '#warn',
            mixins: [chooseDialogCompon],
            data: function () {
                let btn = [
                    {
                        text: '回到編輯',
                        class: 'cancel-style',
                        fnCall: this.cancelCall,
                    },
                    {
                        text: '確定離開',
                        class: 'success-style',
                        fnCall: this.sureCall,
                    },
                ];

                return {
                    elementID: 'chosose-dialog-short-tcenter',
                    titleText: '提示',
                    contentText: '編輯未儲存，是否離開',
                    bottomBtnList: btn,
                }
            },
            methods: {
                closeBtnClick() {
                    this.dialogClose = true;
                    resolve(false);
                },
                cancelCall() {
                    this.dialogClose = this;
                    resolve(false);
                },
                sureCall() {
                    this.dialogClose = true;
                    resolve(true);
                },
            }
        });
    });
};

// 新增時用，type > 1: 品質, 2: 技師
export function editChecklistName({
    type = 1,
    vueData,
    name,
    uid,
    sureCall
} = {}) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'edit-name');
    putArea.appendChild(vueArea);

    let template = /*html*/ `
        <float-dialog
            :elementID="elementID"
            :titleText="titleText"
            :showCloseBtn="showCloseBtn"
            :allowBgClick="allowBgClick"
            :bottomShow="bottomShow"
            :setWidth="setW"
            :elementWidth="width"
            @nextBtnClick="nextBtnClick"
            @closeClick="closeClick"
            ref="dialog"
        >
            <div
                class="dark-theme"
                :class="{'danger': danger}"
            >
                <input
                    type="text"
                    v-model="text"
                    :placeholder="placeholder"
                >
            </div>
        </float-dialog>
    `;

    return new Vue({
        el: '#edit-name',
        components: {
            'float-dialog': floatDialog,
        },
        template,
        data() {
            return {
                elementID: 'edit-checklist-name',
                titleText: vueData ? '編輯群組名稱' : '輸入群組名稱',
                dialogType: 2,
                showCloseBtn: false,
                placeholder: '請輸入群組名稱',
                allowBgClick: false,
                bottomShow: true,
                setW: true,
                width: '550px',
                text: vueData ? vueData.name : name ? name : '新檢查群組',
                danger: false,
            }
        },
        watch: {
            text() {
                if (this.danger && this.text.length) this.danger = false;
            }
        },
        methods: {
            nextBtnClick() {
                if (this.text.length) {
                    if (vueData) {
                        vueData.name = this.text;
                    } else if (uid) {

                    } else {
                        editChecklist({ type, name: this.text, sureCall });
                    }
                    this.$refs.dialog.onDialogClose();
                } else {
                    this.danger = true;
                    floatMsgRemind('請輸入名稱');
                };
            },
            closeClick() {
                this.$refs.dialog.onDialogClose();
            },
        },
    });
};

// safety and health
export function editChecklistName4sh({ info = null, sureCall }) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'edit-name');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#edit-name',
        mixins: [editChecklistInfoShCompon],
        data() {
            let obj = _.cloneDeep({
                titleText: info ? '修改自檢設定' : '新增自檢表',
                name: info?.name || '新增自檢表名稱',
                point: info?.point ?? '86',
                scope_rate: info?.scope_rate || ['', '', ''],
                progress_rate: info?.progress_rate || ['', '', ''],
            });
            return obj;
        },
        methods: {
            nextBtnClick() {
                if (this.check()) {
                    let dataObj = {
                        name: this.name,
                        point: this.point,
                        scope_rate: this.scope_rate,
                        progress_rate: this.progress_rate,
                    };
                    if (info) {
                        // 更新
                        sureCall(dataObj);
                    } else {
                        // 打開自檢表
                        dataObj['sureCall'] = sureCall;
                        editChecklist4sh(dataObj);
                    }
                    this.$refs.dialog.onDialogClose();
                } else {
                    floatMsgRemind('請輸入必要欄位');
                }
            },
            closeClick() {
                this.$refs.dialog.onDialogClose();
            },
        }
    });
};

// type > 1: 品質, 2: 技師
export function editChecklist({ type, name = '', uid = null, sureCall } = {}) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'edit');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#edit',
        mixins: [editChecklistCompon],
        data() {
            return {
                titleText: `${uid ? '檢視' : '新增'}檢查群組(${type == 2 ? '技師' : '品質'})`,
                editMode: uid ? false : true,
                nextBtnText: uid ? '編輯' : '確認',
                uid,
                name,
                type,
                closeCheckFun: () => {
                    if (this.editalbe && this.dataChange) {
                        return warn();
                    } else {
                        return true;
                    }
                },
            }
        },
        methods: {
            async nextBtnClick() {
                if (this.editMode) {
                    let pass = await this.passCheck();

                    if (pass) {
                        this.loading = true;
                        let sendData = await this.getData();
                        let rsStatus = await callapi.editCheckList(sendData, 1);
                        this.loading = false;
                        if (rsStatus) {
                            floatMsgRemind(`${uid ? '編輯' : '新增'}成功`);
                            if (this.uid) {
                                this.editMode = false;
                                this.nextBtnText = '編輯';
                                this.titleText = `檢視檢查群組(${type == 2 ? '技師' : '品質'})`;
                            } else {
                                this.$refs.dialog.onDialogClose();
                            }
                        } else {
                            floatMsgRemind(`${uid ? '編輯' : '新增'}失敗`);
                        }
                    }
                } else {
                    this.editMode = true;
                    this.nextBtnText = '確認';
                    this.titleText = `編輯檢查群組(${type == 2 ? '技師' : '品質'})`;
                }
            },
            afterLeave() {
                sureCall?.();
            }
        }
    });
};

// safety and health
export function editChecklist4sh(
    {
        name = '',
        uid = null,
        point = '86',
        scope_rate = ['', '', ''],
        progress_rate = ['', '', ''],
        sureCall,
    } = {}) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'edit-sh');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#edit-sh',
        mixins: [editChecklistShCompon],
        data() {
            return {
                titleText: uid ? '檢視檢查表' : '新增檢查表',
                editMode: uid ? false : true,
                showImportOption: uid ? false : true,
                nextBtnText: uid ? '編輯' : '完成',
                listName: name,
                point,
                scope_rate,
                progress_rate,
                uid,
                closeCheckFun: () => {
                    if (this.editMode && this.dataChange) {
                        return warn();
                    } else {
                        return true;
                    }
                },
            }
        },
        methods: {
            async nextBtnClick() {
                if (this.editMode) {
                    let pass = await this.passCheck();

                    if (pass) {
                        this.loading = true;
                        let sendData = await this.getData();
                        let rsStatus = await callapi.editCheckList(sendData);
                        this.loading = false;

                        if (rsStatus) {
                            floatMsgRemind(`${uid ? '編輯' : '新增'}成功`);
                            if (this.uid) {
                                this.editMode = false;
                                this.nextBtnText = '編輯';
                                this.titleText = '檢視檢查表';
                            } else {
                                this.$refs.dialog.onDialogClose();
                            }
                        } else {
                            floatMsgRemind(`${uid ? '編輯' : '新增'}失敗`);
                        }
                    }
                } else {
                    this.editMode = true;
                    this.showImportOption = true;
                    this.nextBtnText = '確認';
                    this.titleText = '編輯檢查表';
                }
            },
            afterLeave() {
                sureCall?.();
            },
        }
    });
};

// 常用細項(標籤)
export function editTag({ uid, sureCall }, isEdit = false) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'edit-tag');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#edit-tag',
        data() {
            return {
                uid,
                edit: isEdit,
                titleText: isEdit ? '常用細項訊息設定' : '檢視常用細項訊息',
                nextBtnText: isEdit ? '完成' : '編輯',
            }
        },
        mixins: [editTagCompon],
        methods: {
            async nextBtnClick() {
                if (this.edit) {
                    let check = await this.checkData();
                    if (check) {
                        this.loading = true;
                        let data = this.getData();
                        let rsStatus = await callapi.editTag(data);
                        this.loading = false;
                        if (rsStatus) {
                            this.edit = false;
                            this.nextBtnText = '編輯';
                            this.titleText = '檢視常用細項訊息';
                        }
                        floatMsgRemind(`編輯${rsStatus ? '成功' : '失敗'}`);
                    } else {
                        floatMsgRemind('請完成內容輸入');
                    }
                } else {
                    this.edit = true;
                    this.titleText = '常用細項訊息設定';
                    this.nextBtnText = '完成';
                }
            },
            async closeClick() {
                if (this.edit && this.dataChange) {
                    let ans = await warn();
                    if (ans) this.$refs.dialog.onDialogClose();
                } else {
                    this.$refs.dialog.onDialogClose();
                }
            },
            afterLeave() {
                sureCall?.();
            }
        },
    });
};

// 編輯報告資訊
export function editPaperInfo({ info = null, sureCall }) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    putArea.classList.add('active');

    vueArea.setAttribute('id', 'edit-paper-info');
    putArea.appendChild(vueArea);

    let getData = Promise.all([
        callapi.getChecker(),
        callapi.getProjectList(),
        info,
    ]);

    return new Vue({
        el: '#edit-paper-info',
        mixins: [editPaperInfoCompon],
        methods: {
            async nextBtnClick() {
                if (this.check()) {
                    let sendData = this.getData();
                    if (this.paperID) sendData.uid = this.paperID;
                    let rsData = await callapi.editPaperInfo(sendData);
                    if (rsData) {
                        if (this.paperID) {
                            floatMsgRemind('編輯完成');
                            // update info
                            sureCall(rsData);
                        } else {
                            // open paper page
                            sureCall(rsData);
                        }
                        this.$refs.dialog.onDialogClose();
                    } else {
                        floatMsgRemind(`${uid ? '編輯' : '新增'}失敗`);
                    }
                }
            },
            afterLeave() {
                if (!putArea.querySelector(':scope > div')) {
                    putArea.classList.remove('active');
                }
                this.$destroy();
            }
        },
        async created() {
            let data = await getData;
            this.setData(data);
            await this.$nextTick();
            this.loading = false;
        },
    })
};

// 選會驗人員
export function checkerSelect({ dataList = [], currentList = [], sureCall, muiltSelect = false } = {}) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'check-select');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#check-select',
        mixins: [selectDialogCompon],
        data() {
            return {
                dataList,
                currentList,
                muiltSelect,
                placeholder: '搜尋人名',
                sureCall,
            };
        },
    })
};

// 報告主畫面
export function paperPage(uid, isProject = false, pageRefreshCall, onMountedCall = null) {
    const putArea = document.getElementById('fullsize');
    putArea.classList.add('active');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'paper-page');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#paper-page',
        mixins: [paperCompon],
        data() {
            return {
                uid,
                isProject,
            }
        },
        methods: {
            afterLeave() {
                if (!putArea.querySelector(':scope > div')) {
                    putArea.classList.remove('active');
                }
                if (this.pageRefresh) pageRefreshCall?.();
                this.$destroy();
            },
            closeClick() {
                this.$refs['picture-mana']?.hide();
            }
        },
        async created() {
            let info = await callapi.getPaperInfo(this.uid);
            await this.setData(info);
            if (onMountedCall) {
                onMountedCall(this);
            } else {
                await this.tabClick();
                this.$refs['picture-mana']?.init();
            }
        },
    });
};

// 檢視工地概況
export function viewSummary(paperID) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'report-summary');
    putArea.appendChild(vueArea);

    let rsData = callapi.getPaperSummary(paperID);

    return new Vue({
        el: '#report-summary',
        mixins: [reportSummaryCompon],
        async created() {
            let data = await rsData;
            if (data) this.summaryData = data;

            await this.$nextTick();
            this.loading = false;
        },
    });
};

// 取消編輯詢問
export async function warn() {
    const putArea = document.getElementById('main-wrapper');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'warn');
    putArea.appendChild(vueArea);

    return new Promise((resolve) => {
        new Vue({
            el: '#warn',
            mixins: [chooseDialogCompon],
            data: function () {
                let btn = [
                    {
                        text: '回到編輯',
                        class: 'cancel-style',
                        fnCall: this.cancelCall,
                    },
                    {
                        text: '確定離開',
                        class: 'success-style',
                        fnCall: this.sureCall,
                    },
                ];

                return {
                    elementID: 'chosose-dialog-short-tcenter',
                    titleText: '取消編輯確認',
                    contentText: '內容尚未儲存，是否直接放棄此次修改',
                    bottomBtnList: btn,
                }
            },
            methods: {
                closeBtnClick() {
                    this.dialogClose = true;
                    resolve(false);
                },
                cancelCall() {
                    this.dialogClose = this;
                    resolve(false);
                },
                sureCall() {
                    this.dialogClose = true;
                    resolve(true);
                },
            }
        });
    });
};

// 送出確認
export function sendPaperConfirm(paperID, sureCall, closeCall) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'send-confirm-page');
    putArea.appendChild(vueArea);
    let _get = callapi.getSendList(paperID);

    return new Vue({
        el: '#send-confirm-page',
        name: 'confirm-compon',
        mixins: [paperConfirmCompon],
        methods: {
            closeClick() {
                closeCall?.();
            },
            async nextBtnClick() {
                this.loading = true;

                if (this.sended) {
                    return;
                } else {
                    floatMsgRemind('請稍等');
                }
                let record_arr = this.output();
                let rsStatus = await callapi.sendPaperRecord({
                    uid: paperID,
                    record_arr,
                });

                if (rsStatus) {
                    floatMsgRemind('已送出');
                    this.$refs.dialog.onDialogClose();
                    sureCall?.();
                } else {
                    floatMsgRemind('送出失敗，請稍後嘗試');
                    this.sended = false;
                    this.loading = false;
                }
            },
        },
        async created() {
            const list = await _get;
            this.dataList = list.map(l => ({ ...l, select: true }));
            await this.$nextTick();
            this.loading = false;
        }
    });
};

// 最後送出確認
// 棄用
export async function finalConfirm(projectName) {
    const putArea = document.getElementById('main-wrapper');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'warn');
    putArea.appendChild(vueArea);

    return new Promise((resolve) => {
        new Vue({
            el: '#warn',
            mixins: [chooseDialogCompon],
            data: function () {
                let btn = [
                    {
                        text: '取消',
                        class: 'cancel-style',
                        fnCall: this.cancelCall,
                    },
                    {
                        text: '送出',
                        class: 'success-style',
                        fnCall: this.sureCall,
                    },
                ];

                return {
                    titleText: '提示',
                    contentText: `是否確定將以上管理記錄一併送出至工地</br>"${projectName}"`,
                    bottomBtnList: btn,
                }
            },
            methods: {
                closeBtnClick() {
                    this.dialogClose = true;
                    resolve(false);
                },
                cancelCall() {
                    this.dialogClose = this;
                    resolve(false);
                },
                sureCall() {
                    this.dialogClose = true;
                    resolve(true);
                },
            }
        });
    });
};

// 刪除報告確認
export async function deletePaperWarn() {
    const putArea = document.getElementById('main-wrapper');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'warn');
    putArea.appendChild(vueArea);

    return new Promise((resolve) => {
        new Vue({
            el: '#warn',
            mixins: [chooseDialogCompon],
            data: function () {
                let btn = [
                    {
                        text: '取消',
                        class: 'cancel-style',
                        fnCall: this.cancelCall,
                    },
                    {
                        text: '刪除',
                        class: 'danger-style',
                        fnCall: this.sureCall,
                    },
                ];

                return {
                    elementID: 'chosose-dialog-short-tcenter',
                    titleText: '提示',
                    contentText: '是否確定刪除此稽查報告?</br>一但刪除後將無法復原!',
                    bottomBtnList: btn,
                }
            },
            methods: {
                closeBtnClick() {
                    this.dialogClose = true;
                    resolve(false);
                },
                cancelCall() {
                    this.dialogClose = this;
                    resolve(false);
                },
                sureCall() {
                    this.dialogClose = true;
                    resolve(true);
                },
            }
        });
    });
};

// 刪除報告失敗
export async function deleteFailCheck(lists) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'delete-fail');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#delete-fail',
        mixins: [deleteFailCheckCompon],
        data() {
            return {
                lists,
            }
        }
    })
}

// RWD 置底新增
export function nextStep(options) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'next-step');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#next-step',
        mixins: [bottomNoticeCompon],
        data() {
            return {
                allowBgClick: false,
                noticeAreaClass: 'next-step',
                bgClass: '',
                options,
            }
        },
    });
};

// 右下角泡泡
export function bottomPopover(options) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'bottom-pop');
    putArea.appendChild(vueArea);

    return new Vue({
        name: 'bottomPopover',
        el: '#bottom-pop',
        mixins: [bottomPopoverCompon],
        data() {
            return {
                options,
            }
        },
    });
};

// 建立記錄畫面
// paperInfo: 報告資訊
// selectPict: [{uid, src}]
// reportType: 1 > 缺失, 2 > 提醒, 3 > 優良, 4 > 現況
// pictIndependent: 照片紀錄 1 by 1
// pictIndependent: 以記錄類型自動帶入照片
// excludeUsedPict: 排除已使用照片
export function editRecordPage({
    paperID,
    paperInfo = null,
    selectPict = [],
    reportType,
    closeCall,
    pictIndependent = false,
    getPictByReportType = false,
    excludeUsedPict = false,
} = {}) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'edit-record-page');
    putArea.appendChild(vueArea);

    let defaultCard = {
        // 記錄類型
        reportType,
        // 照片清單
        pictureList: [],
        // 地點
        location: '',
        // 標記
        mark: {},
        // 檢查項目
        //  { form, group, select, selectGroup }
        checkitem: null,
        // 缺失內容，輸入
        context: '',
        // 工項別
        workTypeText: '',
        // 常用細項
        tagList: [],
        // 缺失原因
        reason: [],
        // 危害類型，僅安衛
        dangerType: [],
        // dete object
        time: new Date(paperInfo.date),
        // 改善時間
        endTime: ((date) => {
            let result = new Date(date);
            result.setDate(result.getDate() + 3);
            return result;
        })(paperInfo.date),
        // 會驗人員
        checkerName: paperInfo?.checkerName ?? [],
        // 責任工程師
        engineer: [],
        // 廠商
        company: null,
        // 工種
        work: null,
        // 罰條
        penalty: null,
        // 罰款
        fine: '',
        // 
        allowRemove: false,
        allowDupicate: true,
        keyIndex: 0,
    }

    const createCardList = (pictList) => {
        return pictList.map((pict, index) => {
            return {
                ...defaultCard,
                pictureList: [pict],
                allowRemove: true,
                keyIndex: index,
            };
        })
    }
    return new Vue({
        el: '#edit-record-page',
        mixins: [editRecordCompon],
        data() {
            let cardList = [];
            let keyIndex = 0;
            if (pictIndependent && selectPict.length > 1) {
                cardList = createCardList(selectPict);
                keyIndex = cardList.length;
            } else {
                cardList = [{
                    ...defaultCard,
                    pictureList: selectPict,
                }];
                keyIndex = 1;
            }

            return {
                returnBtnText: '取消',
                nextBtnText: '儲存',
                paperID,
                paperInfo,
                keyIndex,
                cardList,
            }
        },
        methods: {
            closeClick() {
                closeCall?.();
            },
            async nextBtnClick() {
                let pass = await this.check();
                if (pass) {
                    let sendData = this.output();
                    let rsStatus = await callapi.editRecord(sendData);
                    if (rsStatus) {
                        this.$refs.dialog.onDialogClose();
                        closeCall?.(true);
                        floatMsgRemind('建立記錄完成');
                    } else {
                        floatMsgRemind('建立記錄失敗');
                    }
                } else {
                    floatMsgRemind('請補齊報告內容');
                }
            }
        },
        async created() {
            let accData = new accordingData(this.paperID, this.paperInfo.project.id);
            await accData.initialize();

            this.accData = accData;

            if (getPictByReportType) {
                let pictList = accData.getPicutreByType(reportType, excludeUsedPict);
                if (pictIndependent && pictList.length > 1) {
                    this.cardList = createCardList(pictList);
                    this.keyIndex = this.cardList.length;
                    floatMsgRemind('已帶入相關紀錄照片');
                } else if (pictList.length) {
                    this.cardList = [{
                        ...defaultCard,
                        pictureList: pictList,
                    }];
                    this.keyIndex = 1;
                    floatMsgRemind('已帶入相關紀錄照片');
                } else {
                    floatMsgRemind('無可自動帶入之照片');
                }
            }
            this.loading = false;
            // console.log(this);
        },
    });
};

// 檢視記錄
export function viewRecord({
    paperID,
    recordIdArr,
    nextBtnShow = true,
    closeCall = null,
} = {}) {
    const putArea = document.getElementById('fullsize');
    putArea.classList.add('active');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'edit-record-page');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#edit-record-page',
        mixins: [editRecordCompon],
        data() {
            return {
                paperID,
                recordIdArr,
                titleText: '檢視記錄',
                nextBtnShow,
                keyIndex: 0,
                showNewCardBtn: false,
                editable: false,
                nextBtnText: '',
                subMenu: true,
                subMenuArr: [
                    // 待送出
                    // 0
                    {
                        text: '編輯',
                        eventText: 'editRecord',
                        class: 'yello-tx-yello-border pointer',
                    },
                    // 1
                    {
                        text: '刪除',
                        eventText: 'deleteRecord',
                        class: 'red-bg-wh-tx pointer',
                    },
                    // 待送出
                    // 2
                    {
                        text: '待送出',
                        class: 'yello-tx-yello-border',
                    },
                    // 待送出,編輯中
                    // 3
                    {
                        text: '儲存',
                        eventText: 'saveRecord',
                        class: 'yello-bg-bk-tx pointer',
                    },
                    // 未回覆
                    // 4
                    {
                        text: '待回覆',
                        class: 'yello-tx-yello-border',
                    },
                    // 待審核
                    // 可審核
                    // 5
                    {
                        text: '審核回覆',
                        eventText: 'companyResponse',
                        class: 'yello-bg-bk-tx pointer',
                    },
                    // 不可審核
                    // 6
                    {
                        text: '待審核',
                        class: 'yello-tx-yello-border',
                    },
                    // 結案
                    // 7
                    {
                        text: '已結案',
                        class: 'yello-tx-yello-border',
                    },
                ],
                onCloseUpdate: false,
            }
        },
        methods: {
            //公司端用refresh
            async refresh() {
                this.loading = true;

                const recordData = await callapi.getRecordForProject({
                    uid: this.paperID,
                    record_id: this.recordIdArr[0],
                });

                if (recordData) {
                    const { before: card, middle, after, info, permission, status } = recordData;
                    this.paperInfo = info;
                    this.status = status;
                    this.permission = permission;

                    // 已提交，顯示審核歷程
                    if (status > 1) {
                        callapi.getExamineHistory({
                            uid: this.paperID,
                            record_id: this.recordIdArr[0],
                        }).then(historyData => {
                            if (historyData) {
                                const { flow, history } = historyData;
                                this.examineHistory.flow = flow;
                                this.examineHistory.history = history.map((v, i) => ({ ...v, keyIndex: i }));
                                this.showExamine = true;
                            }
                        });
                    }

                    // 安保公司端紀錄
                    if (card && !Array.isArray(card)) {
                        let defaultCard = {
                            // 記錄類型 
                            reportType: 4,
                            // 照片清單
                            pictureList: [
                                {
                                    uid: 0,
                                    src: '',
                                },
                            ],
                            // 地點
                            location: '',
                            // 標記
                            mark: {},
                            // 檢查項目
                            //  { form, group, select, selectGroup }
                            checkitem: null,
                            // 缺失內容，輸入
                            context: '',
                            // 工項別
                            workTypeText: '',
                            // 常用細項
                            tagList: [
                                // {
                                //     uid: 0,
                                //     text: '',
                                //     active: false,
                                // },
                            ],
                            // 缺失原因
                            reason: [],
                            // {uid: 123213, text: '123213'}
                            // 危害類型，僅安衛
                            dangerType: [],
                            // dete object
                            time: new Date(),
                            // 改善時間
                            endTime: (() => {
                                let result = new Date();
                                result.setDate(result.getDate() + 3);
                                return result;
                            })(),
                            // 會驗人員
                            checkerName: [],
                            // 責任工程師
                            engineer: [],
                            // 廠商
                            company: null,
                            // 工種
                            work: null,
                            // 罰條
                            penalty: null,
                            // 罰款
                            fine: '',
                        };

                        if (card.reportType == 1) {
                            card.time = new moment(card.time).format('YYYY/MM/DD');
                            card.endTime = new moment(card.endTime).format('YYYY/MM/DD');
                        };

                        if (card.tagArr) {
                            card.tagList = card.tagArr.map(t => ({ ...t, active: true }));
                        }

                        card['pictureList'] = card.picture.picture.map(p => {
                            return {
                                uid: p.uid,
                                src: p.thumbnail,
                            }
                        });

                        if (Array.isArray(card['mark'])) {
                            card['mark'] = {};
                        }

                        let data = {
                            ...defaultCard,
                            ...card,
                            allowRemove: false,
                            allowDupicate: false,
                            keyIndex: this.keyIndex,
                        };

                        this.cardList = [data];
                    }
                    // 已有回覆內容
                    if (status > 2) {
                        const combineData = (data) => {
                            const defaultCard = {
                                // 照片清單
                                picture: [
                                    {
                                        uid: 0,
                                        neme: '',
                                        thumbnail: '',
                                        src: '',
                                    },
                                ],
                                // 缺失內容，輸入
                                context: '',
                                //備註說明，輸入
                                note: '',
                                // 改善日期
                                endTime: new Date(),
                                // 改善缺失人員
                                checkerName: [],
                                // 責任工程師
                                engineer: [],
                                // 協力廠商
                                company: {
                                    name: '',
                                    uid: 0
                                },
                            };

                            if (data?.endTime) {
                                data.endTime = new Date(data.endTime);
                            }


                            return { ...defaultCard, ...data };
                        }

                        this.middle = combineData(middle);
                        this.after = combineData(after);
                    }
                    await this.$nextTick();
                }

                this.loading = false;
            },
            closeClick() {
                closeCall?.(this.onCloseUpdate);
            },
            // 刪除記錄
            async deleteRecord() {
                let rsStatus = await callapi.deleteRecord({
                    uid: this.paperID,
                    record_id: recordIdArr[0],
                });

                if (rsStatus) {
                    this.$refs.dialog.onDialogClose();
                    closeCall?.(true);
                }
                floatMsgRemind(`刪除${rsStatus ? '成功' : '失敗'}`);
            },
            // 儲存紀錄(公司端)
            async saveRecord() {
                let pass = await this.check();
                if (pass) {
                    let sendData = this.output();
                    sendData["record_id"] = recordIdArr[0];

                    let rsStatus = await callapi.editRecord(sendData);
                    if (rsStatus) {
                        this.$refs.dialog.onDialogClose();
                        closeCall?.(true);
                        floatMsgRemind('修改成功');
                    } else {
                        floatMsgRemind('修改記錄失敗');
                    }
                } else {
                    floatMsgRemind('請補齊報告內容');
                }
            },
            // 轉編輯
            async editRecord() {
                this.loading = true;
                let accData = new accordingData(this.paperID);
                await accData.initialize();
                this.subMenu = false;
                this.titleText = '編輯記錄';
                this.nextBtnText = '完成';
                this.returnBtnText = '取消';
                this.accData = accData;

                for (let card of this.cardList) {
                    // string to Date Object
                    if (card.reportType == 1) {
                        card.time = new Date(card.time);
                        card.endTime = new Date(card.endTime);
                    }

                    if (card.tagArr) {
                        let tagList = await this.accData.getMsg(card.checkitem.selectGroup, card.reportType);
                        let uidArr = card.tagArr.map(t => t.uid);
                        tagList.forEach(t => {
                            if (uidArr.includes(t.uid)) {
                                t.active = true;
                            }
                        });
                        card.tagList = tagList;
                    }
                }

                this.editable = true;

                await this.$nextTick();
                this.loading = false;
            },
            //缺失回覆(公司端)
            companyResponse() {
                const sureCall = () => {
                    this.onCloseUpdate = true;
                    this.refresh();
                }
                companyResponse({
                    data: {
                        uid: this.paperID,
                        record_id: recordIdArr[0],
                        // 0: 安衛, 1: 品質, 2: 技師
                    },
                    checkitemType: this.cardList[0]?.checkitem?.currentForm,
                    sureCall,
                });
            },
        },
        created() {
            this.refresh();
            // console.log(this);
        }
    });
};

// 檢查項目選擇
export function selectCheckItem({ select, sureCall, getData } = {}) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'select-checkitem-page');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#select-checkitem-page',
        mixins: [selectCheckitemCompon],
        data() {
            return {
                sureCall,
                getData
            }
        },
        created() {
            this.init(select);
        }
    });
};

// 選危害類型
export function selcetDangerType({ sureCall, selectList, dataList } = {}) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');

    vueArea.setAttribute('id', 'select-dangertype-page');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#select-dangertype-page',
        mixins: [selectDialogComponVer2],
        data() {
            let currentList = selectList.map(v => v.uid);
            let other = selectList.find(v => v.uid == 0);
            let otherOptionText = other ? other.text : '';

            return {
                showCloseBtn: false,
                bottomShow: true,
                allowBgClick: false,
                titleText: '選擇危害類型',
                otherOptionPlaceholder: '請輸入原因',
                allowSearch: false,
                muiltSelect: true,
                dataList,
                currentList,
                otherOptionText,
                sureCall,
            }
        },
    });
};

// 選缺失原因
export async function selectReason({ sureCall, selectList, getData } = {}) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');

    vueArea.setAttribute('id', 'select-reason-page');
    putArea.appendChild(vueArea);
    let dataList = await getData;
    return new Vue({
        el: '#select-reason-page',
        mixins: [selectDialogComponVer2],
        data() {
            let currentList = selectList.map(v => v.uid);
            let other = selectList.find(v => v.uid == 0);
            let otherOptionText = other ? other.text : '';

            return {
                showCloseBtn: false,
                bottomShow: true,
                allowBgClick: false,
                titleText: '選擇缺失原因',
                otherOptionPlaceholder: '請輸入原因',
                allowSearch: false,
                muiltSelect: true,
                dataList,
                currentList,
                otherOptionText,
                sureCall,
            }
        },
    });
};

// 選罰鍰條則                    
export async function selectPenalty({ currentSelect = null, sureCall, getData } = {}) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'select-penalty-page');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#select-penalty-page',
        mixins: [selectPenaltyCompon],
        data() {
            let typeList = getData.getPenaltyList();
            let currentType = typeList?.[0];
            let listData = getData.getPenaltyContent();
            return {
                sureCall,
                typeList,
                listData,
                currentType,
                ...currentSelect,
                getData,
            }
        }
    });
};

// 選廠商工種
export async function selectWorker({ companyList, workList, sureCall } = {}) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'select-worker-page');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#select-worker-page',
        mixins: [selectWorkerCompon],
        data() {
            return {
                companyList,
                workList,
                sureCall,
            };
        },
    })
};

// 選擇/變更照片
export async function selectPicture({ sureCall, pictureList, muiltSelect } = {}) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'select-picture-page');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#select-picture-page',
        mixins: [selectPictureCompon],
        data() {
            return {
                pictureList,
                muiltSelect,
                sureCall,
            }
        },
    });
};

// 底圖標定
export async function mapMaker({ mapList = [], markerLog = {}, current = 0, editable = false, sureCall } = {}) {
    const putArea = document.getElementById('main-wrapper');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'map-maker-page');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#map-maker-page',
        mixins: [mapMarkerCompon],
        data() {
            return {
                mapList,
                markerLog,
                current,
                editable,
                sureCall,
            }
        }
    })
};

// 安衛評分 比例設定
export async function setSHRate(uid, sureCall) {
    let shData = await callapi.getSHScore(uid);
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'sh-score-rate-page');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#sh-score-rate-page',
        mixins: [shScoreRateCompon],
        data() {
            return {
                uid,
                sureCall,
                shData,
                scopeRate: shData.scope_rate,
                progressRate: shData.progress_rate,
            };
        },
    });
};

// 新增安衛評分表
export async function setSHScore({ select_scope, select_progress, shData, uid } = {}, sureCall) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'sh-score-page');
    putArea.appendChild(vueArea);
    return new Vue({
        el: '#sh-score-page',
        mixins: [shScoreCompon],
        data() {
            return {
                ...shData,
                loading: false,
                sureCall,
                uid,
                select_scope,
                select_progress,
            };
        },
        created() {
            this.content.forEach(unit => {
                unit['show'] = true;
                unit.list.forEach(l => l['show'] = true);
            });
            this.loading = false;
        }
    });
};

// 檢視安衛評分表
export async function viewShScore(uid, score_id, sureCall) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'sh-score-page');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#sh-score-page',
        mixins: [shScoreCompon],
        data() {
            return {
                titleText: '檢視安衛評分記錄',
                sureCall,
                uid,
                editMode: false,
            };
        },
        async created() {
            let rsData = await callapi.getSHrecord({ uid, score_id });
            if (rsData) {
                const { name, point, content, scope_rate, progress_rate, select_scope, select_progress } = rsData;
                this.name = name;
                this.point = point;
                this.scope_rate = scope_rate;
                this.progress_rate = progress_rate;
                this.select_scope = select_scope;
                this.select_progress = select_progress;
                this.content = content;
                this.content.forEach(unit => {
                    unit['show'] = true;
                    unit.list.forEach(l => l['show'] = true);
                });
            }
            this.loading = false;
        }
    });
};

//公司端缺失改善回覆
// { data, checkitemType, sureCall }
async function companyResponse(infoObj) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'company-response-page');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#company-response-page',
        mixins: [companyResponseCompon],
        data() {
            return {
                checkitemType: infoObj.checkitemType,
            }
        },
        methods: {
            async nextBtnClick() {
                if (this.check()) {
                    infoObj['data']['reply'] = this.output();
                    this.$refs.dialog.onDialogClose();
                    confirmResponse(infoObj);
                }
            }
        },
        async created() {
            let rsData = await callapi.getGradingList();
            this.scoreTab = rsData.map(t => ({
                name: `扣分：${t.score} (${t.text})`,
                uid: t.uid,
            }));
            await this.$nextTick();
            this.loading = false;
        }
    })
};

//缺失改善回覆確認送出
// { data, checkitemType, sureCall }
async function confirmResponse(infoObj) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'confirm-response-page');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#confirm-response-page',
        mixins: [comfirmResponseCompon],
        data() {
            return {
                decide: infoObj.data.reply.decide,
            };
        },
        methods: {
            async nextBtnClick() {
                const rsStatus = await callapi.componyExamine(infoObj.data);
                if (rsStatus) infoObj.sureCall();
                this.$refs.dialog.onDialogClose();
                floatMsgRemind(`${rsStatus ? '已結案' : '已退審'}`);
            },
        },
    })
};
