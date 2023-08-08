// -------------工地(專案)端-------------

import * as callapi from "../callAPI.js";

import bottomNoticeCompon from "../../../vue/assets/bottom-notice-compon.js";

import userManaCompon from "../component/user-mana-compon.js";
import selectJobTypeCompon from "../component/select-job-type-compon.js";
import editRecordCompon from "../component/edit-record-compon.js";
import selectAssignCompon from "../component/select-assign-compon.js";
import confirmAssignCompon from "../component/confirm-assign-compon.js";
import notAssignBottomCompon from "../component/not-assign-bottom-compon.js";
import viewJobHistoryCompon from "../component/view-job-history-compon.js";
import selectDialogComponVer2 from "../component/select-dialog-compon-ver2.js";
import sendRecordToAuditCompon from "../component/send-record-to-audit-compon.js";
import passAuditCompon from "../component/pass-audit-compon.js";
import rejectAuditReasonCompon from "../component/reject-audit-reason-compon.js";
import selectRejectStatusCompon from "../component/select-reject-status-compon.js";
import confirmRejectStatusCompon from "../component/confirm-reject-status-compon.js";

// 工地人員管理
export function userMana(closeCall) {
    const putArea = document.getElementById('fullsize');
    putArea.classList.add('active');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'user-mana');
    putArea.appendChild(vueArea);
    let _getData = [
        callapi.getProjectUserList(),
        callapi.getUser(),
    ];

    return new Vue({
        el: '#user-mana',
        mixins: [userManaCompon],
        methods: {
            afterLeave() {
                closeCall?.();
                if (!putArea.querySelector(':scope > div')) {
                    putArea.classList.remove('active');
                }
                this.$destroy();
            },
        },
        async created() {
            let rsData = await Promise.all(_getData);
            const [groupData, userData] = rsData;
            const { permission, data } = groupData;
            this.permission = permission;
            this.groupList = data;
            this.userList = userData.map(u => ({ text: u.name, uid: u.uid }));
            await this.$nextTick();
            this.loading = false;
        },
    })
}

// 新增人員類型選擇
export function selectJobType(role) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'select-job-type');
    putArea.appendChild(vueArea);

    return new Promise((resolve) => {
        new Vue({
            el: '#select-job-type',
            mixins: [selectJobTypeCompon],
            data() {
                return {
                    list: role,
                }
            },
            methods: {
                btnClick(btn) {
                    if (btn.limit == -1 || btn.limit > 0) {
                        resolve(btn.id);
                        this.$refs.dialog.onDialogClose();
                    }
                },
                closeClick() {
                    resolve(false);
                }
            }
        })
    });
}

// 檢視人員更換歷程
export async function viewJobHistroy(uid) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'view-job-history');
    putArea.appendChild(vueArea);
    let rsData = await callapi.getJobHistory(uid);

    return new Vue({
        el: '#view-job-history',
        mixins: [viewJobHistoryCompon],
        async created() {
            if (rsData) {
                const { role, list } = rsData;
                this.role = role;
                this.historyList = list;
            }
        }
    })
}

// 選協力廠商
export function selectCompany({ dataList = [], currentList = [], sureCall } = {}) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'select-company');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#select-company',
        mixins: [selectDialogComponVer2],
        data() {
            return {
                dataList,
                currentList,
                muiltSelect: false,
                allowOtherOption: false,
                placeholder: '請選擇責任協力廠商',
                sureCall,
            };
        },
    })
};

// 選責任工程師 
export function engineerSelect({ dataList = [], currentList = [], sureCall, muiltSelect = true } = {}) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'engineer-select');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#engineer-select',
        mixins: [selectDialogComponVer2],
        data() {
            return {
                dataList,
                currentList,
                muiltSelect,
                allowOtherOption: false,
                placeholder: '請選擇責任工程師',
                sureCall,
            };
        },
    })
};

//工地端檢視紀錄
export function viewRecordForProject({
    paperID,
    recordIdArr,
    closeCall,
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
                titleText: '檢視管理紀錄',
                keyIndex: 0,
                showNewCardBtn: false,
                editable: false,
                nextBtnText: '',
                subMenu: true,
                subMenuArr: [
                    // 待指派
                    // 可指派
                    // 0
                    {
                        text: '不指派',
                        eventText: 'notAssignUser',
                        class: 'yello-tx-yello-border pointer',
                    },
                    // 1
                    {
                        text: '指派',
                        eventText: 'assignUser',
                        class: 'yello-bg-bk-tx pointer',
                    },
                    // 不可指派
                    // 2
                    {
                        text: '待指派',
                        class: 'yello-tx-yello-border',
                    },
                    // 待回覆
                    // 可編輯/可提交
                    // 3
                    {
                        text: '編輯',
                        eventText: 'editRecord',
                        class: 'yello-tx-yello-border pointer',
                    },
                    // 4
                    {
                        text: '提交',
                        eventText: 'sendRecordDirect',
                        class: 'yello-bg-bk-tx pointer',
                    },
                    // 不可編輯 & 提交
                    // 5
                    {
                        text: '待回覆',
                        class: 'yello-tx-yello-border',
                    },
                    // 待回覆
                    // 編輯中
                    // 6
                    {
                        text: '儲存',
                        eventText: 'saveRecord',
                        class: 'yello-tx-yello-border pointer',
                        args: { submit: false },
                    },
                    // 7
                    {
                        text: '提交',
                        eventText: 'saveRecord',
                        class: 'yello-bg-bk-tx pointer',
                        args: { submit: true },
                    },
                    // 待審核-內部審核
                    // 8
                    {
                        text: '退審',
                        eventText: 'rejectAudit',
                        class: 'red-bg-wh-tx pointer',
                    },
                    // 9
                    {
                        text: '通過',
                        eventText: 'passAudit',
                        class: 'yello-bg-bk-tx pointer',
                    },
                    // 不可審核
                    // 10
                    {
                        text: '待審核',
                        class: 'yello-tx-yello-border',
                    },
                    // 提交
                    // 11
                    {
                        text: '已提交',
                        class: 'yello-tx-yello-border',
                    },
                    // 結案
                    // 12
                    {
                        text: '結案',
                        class: 'yello-tx-yello-border',
                    },
                ],
                isProject: true,
                showExamine: true,
                onCloseUpdate: false,
            }
        },
        methods: {
            closeClick() {
                closeCall?.(this.onCloseUpdate);
            },
            //工地端用refresh
            async refresh() {
                this.loading = true;

                let _g1 = callapi.getExamineHistory({
                    uid: this.paperID,
                    record_id: this.recordIdArr[0],
                });

                let _g2 = callapi.getRecordForProject({
                    uid: this.paperID,
                    record_id: this.recordIdArr[0],
                });

                const [historyData, recordData] = await Promise.all([_g1, _g2]);
                if (historyData) {
                    const { flow, history } = historyData;
                    this.examineHistory.flow = flow;
                    this.examineHistory.history = history.map((v, i) => ({ ...v, keyIndex: i }));
                }

                if (recordData) {
                    const { before: card, middle, after, info, permission, status } = recordData;
                    this.paperInfo = info;
                    this.status = status;
                    this.permission = permission;

                    //改善前
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
                    if (middle && !Array.isArray(middle)) {
                        this.middle = combineData(middle);
                        this.changeTabs[1].show = false;
                        this.changeTabs[2].show = true;
                    } else {
                        this.changeTabs[1].show = true;
                        this.changeTabs[1].show = false;
                        this.middle = null;
                    }

                    this.after = combineData(after);
                    await this.$nextTick();
                }

                this.loading = false;
            },
            // 工地端轉編輯
            async editRecord() {
                this.loading = true;
                let todo = [callapi.getUser(), callapi.getCompanyWork(this.paperID)];
                const [userData, { company }] = await Promise.all(todo);

                this.titleText = '編輯管理紀錄';
                this.returnBtnText = '取消';
                this.userListForProject = userData.map(({ uid, name }) => ({ text: name, uid: parseInt(uid) }));
                this.companyListForProject = company.map(i => ({ uid: i.uid, text: i.name }));

                if (this.middle) {
                    this.changeTabs[1].show = false;
                    this.changeTabs[2].show = true;
                } else {
                    this.changeTabs[1].show = true;
                    this.changeTabs[2].show = false;
                }

                this.editable = true;
                await this.$nextTick();
                this.loading = false;
            },
            // 審核相關功能
            // 指派
            assignUser() {
                const sureCall = async (checker) => {
                    this.onCloseUpdate = true;
                    await this.refresh();
                    this.checkerRemind(checker);
                }

                const infoObj = {
                    uid: this.paperID,
                    record_id: this.recordIdArr[0],
                    sureCall,
                }
                selectAssign(infoObj);
            },
            // 已指派提示
            checkerRemind(checker) {
                checkerRemind(checker, this.assignUser);
            },
            // 不指派
            notAssignUser() {
                const sureCall = () => {
                    this.onCloseUpdate = true;
                    this.refresh();
                }

                const sendData = {
                    uid: this.paperID,
                    record_id: this.recordIdArr[0],
                }
                notAssignBottom(sureCall, sendData);
            },
            // 工地端儲存與提交紀錄
            saveRecord({ submit }) {
                const direct = this.permission.submit;
                const sureCall = async () => {
                    this.loading = true;
                    let { sendData, sendFile } = this.outputForProject();
                    sendData['submit'] = submit;
                    let rsStatus = await callapi.editRecordForProject(sendData, sendFile);

                    if (rsStatus) {
                        if (submit) {
                            if (direct) {
                                await this.refresh();
                            } else {
                                await this.refresh();
                                sendRecordRemind();
                            }
                        } else {
                            floatMsgRemind(`儲存紀錄${rsStatus ? '成功' : '失敗'}`);
                            this.refresh();
                        }
                        this.onCloseUpdate = true;
                        this.editable = false;
                        this.titleText = '檢視管理紀錄';
                        this.returnBtnText = '返回';
                    } else {
                        floatMsgRemind(`${submit ? '提送' : '儲存'}紀錄失敗`);
                        this.loading = false;
                    }
                }

                // 補齊資料
                if (!this.checkForProject()) {
                    floatMsgRemind('改善後紀錄需有照片或說明');
                    this.currentChangeTab = 2;
                    return;
                }

                if (submit) {
                    if (direct) {
                        // 管理權限直接送公司
                        passAudit(sureCall);
                    } else {
                        // 內部審核
                        sendRecordToAudit(sureCall);
                    }
                } else {
                    sureCall();
                }
            },
            // 不經編輯提交(提送公司/內部審核)
            // 視狀態與提交人判定
            sendRecordDirect() {
                const direct = this.permission.submit;
                const sureCall = async () => {
                    this.loading = true;
                    const sendData = {
                        uid: this.paperID,
                        record_id: this.recordIdArr[0],
                    }
                    let rsStatus = await callapi.sendRecordDirectForProject(sendData);

                    if (rsStatus) {
                        if (!direct) {
                            sendRecordRemind();
                        }
                        this.onCloseUpdate = true;
                    } else {
                        floatMsgRemind(`提送紀錄失敗`);
                    }
                    this.refresh();
                }
                if (direct) {
                    // 管理權限直接送公司
                    // console.log('direct');
                    passAudit(sureCall);
                } else {
                    // 內部審核
                    sendRecordToAudit(sureCall);
                }
            },
            // 內部審核通過
            passAudit() {
                const sureCall = async () => {
                    this.loading = true;
                    let sendData = {
                        uid: this.paperID,
                        record_id: this.recordIdArr[0],
                        decide: true,
                    }

                    const rsStatus = await callapi.porjectExamine(sendData);
                    if (rsStatus) {
                        this.onCloseUpdate = true;
                        await this.refresh();
                        passAuditRemind();
                    } else {
                        floatMsgRemind('提送審核失敗，請稍後嘗試');
                    }
                }
                passAudit(sureCall);
            },
            // 內部審核退審
            rejectAudit() {
                const sureCall = async (data) => {
                    const rsStauts = await callapi.porjectExamine(data);
                    if (rsStauts) {
                        await this.refresh();
                        this.onCloseUpdate = true;
                        rejectAuditRemind(data.assign_status);
                    } else {
                        floatMsgRemind('提交退審失敗，請稍後嘗試');
                    }
                }

                rejectAuditReason({
                    data: {
                        uid: this.paperID,
                        record_id: this.recordIdArr[0],
                        decide: false,
                    },
                    sureCall
                });
            },
        },
        created() {
            this.refresh();
        }
    });
};

// 選廠責任工程師及缺失改善人員
// infoObj: { uid, record_id, sureCall }
function selectAssign(infoObj) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'select-assign-page');
    putArea.appendChild(vueArea);
    let getUser = callapi.getUser();

    return new Vue({
        el: '#select-assign-page',
        mixins: [selectAssignCompon],
        methods: {
            nextBtnClick() {
                const engerCount = this.engineer.length;
                const checkCount = this.checker.length;
                const both = engerCount && checkCount;
                if (both) {
                    this.$refs.dialog.onDialogClose();
                    confirmAssign({
                        ...infoObj,
                        selectList: this.getData(),
                    });
                } else {
                    if (!both) {
                        floatMsgRemind('請選擇責任工程師及缺失改善人員');
                    } else {
                        floatMsgRemind(`請選擇${engerCount ? '缺失改善人員' : '責任工程師'}`);
                    }
                }
            }
        },
        async created() {
            let userList = await getUser;
            if (userList) {
                this.userList = userList.map(i => ({ uid: i.uid, text: i.name }));
            }
            this.loading = false;
        }
    })
};

//確認責任工程師及改善人員名單
// infoObj: {uid, record_id, sureCall, selectList }
function confirmAssign(infoObj) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'confirm-assign-page');
    putArea.appendChild(vueArea);

    const { uid, record_id, sureCall, selectList } = infoObj;

    return new Vue({
        el: '#confirm-assign-page',
        mixins: [confirmAssignCompon],
        data() {
            return {
                checkerData: selectList,
            }
        },
        methods: {
            async nextBtnClick() {
                let sendData = {
                    uid,
                    record_id,
                    assign_user: {
                        engineer: selectList.engineer.map(p => p.uid),
                        principal: selectList.checker.map(p => p.uid),
                    }
                }
                const rsStatus = await callapi.assignCheckItem(sendData);

                if (rsStatus) {
                    sureCall?.(selectList.checker[0].text);
                    this.$refs.dialog.onDialogClose();
                } else {
                    floatMsgRemind('指派失敗');
                }
            }
        },
    })
};

//不指派缺失改善人員
function notAssignBottom(sureCall, sendData) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'not-assign-bottom-page');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#not-assign-bottom-page',
        mixins: [notAssignBottomCompon],
        methods: {
            async nextBtnClick() {
                let rsStatus = await callapi.assignCheckItem(sendData);
                if (rsStatus) sureCall();
                floatMsgRemind(`指派${rsStatus ? '成功' : '失敗'}`);
                this.$refs.dialog.onDialogClose();
            },
        },
    })
};

//提交缺失內部審核
function sendRecordToAudit(sureCall) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'send-record-to-audit-page');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#send-record-to-audit-page',
        mixins: [sendRecordToAuditCompon],
        methods: {
            async nextBtnClick() {
                sureCall();
                this.$refs.dialog.onDialogClose();
            },
        },
    })
};

//缺失改善紀錄通過審核      
function passAudit(sureCall) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'pass-audit-page');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#pass-audit-page',
        mixins: [passAuditCompon],
        methods: {
            nextBtnClick() {
                sureCall();
                this.$refs.dialog.onDialogClose();
            },
        },
    })
};

// 退審情境
// rejectAuditReason -> selectRejectStatus -> confirmRejectStatus
//缺失改善紀錄退審
// { data, sureCall }
function rejectAuditReason(infoObj) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'reject-audit-reason-page');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#reject-audit-reason-page',
        mixins: [rejectAuditReasonCompon],
        methods: {
            nextBtnClick() {
                if (this.reasonText.length) {
                    this.$refs.dialog.onDialogClose();
                    infoObj['data']['reason'] = this.reasonText;
                    selectRejectStatus(infoObj);
                } else {
                    floatMsgRemind('請填寫退審原因');
                }
            },
        },
    })
};

//選擇退審狀態
// { data, sureCall }
function selectRejectStatus(infoObj) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'select-reject-status-page');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#select-reject-status-page',
        mixins: [selectRejectStatusCompon],
        methods: {
            nextBtnClick() {
                if (this.currentAssignTab == null || this.currentRecordTab == null) {
                    floatMsgRemind('請選擇退審狀態');
                } else {
                    // 0: 不重新指派, 1: 重新指派
                    infoObj['data']['assign_status'] = this.currentAssignTab;
                    // 0: 保留紀錄, 1: 清除紀錄
                    infoObj['data']['record_status'] = this.currentRecordTab;
                    this.$refs.dialog.onDialogClose();
                    confirmRejectStatus(infoObj);
                }
            }
        },
    })
};

//確認退審狀態
// { data, sureCall }
function confirmRejectStatus(infoObj) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'confirm-reject-status-page');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#confirm-reject-status-page',
        mixins: [confirmRejectStatusCompon],
        data() {
            return {
                assignStatus: infoObj.data.assign_status,
                recordStatus: infoObj.data.record_status,
            }
        },
        methods: {
            nextBtnClick() {
                infoObj.sureCall(infoObj.data);
                this.$refs.dialog.onDialogClose();
            }
        },
    })
};

// 提醒已指派
function checkerRemind(checker, sureCall) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'checker-remind');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#checker-remind',
        mixins: [bottomNoticeCompon],
        data() {
            return {
                allowBgClick: true,
                noticeAreaClass: 'checker-remind',
                text: `本缺失已指派「${checker}」進行改善`,
                options: [
                    {
                        text: '修改指派',
                        fnCall: sureCall,
                        option: {
                            class: 'select-assign',
                        }
                    },
                    {
                        text: '關閉提示',
                        option: {
                            class: 'leave-style',
                        }
                    },
                ],
            }
        }
    });
};

// 提醒送出缺失改善紀錄
function sendRecordRemind() {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'send-record-remind');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#send-record-remind',
        mixins: [bottomNoticeCompon],
        data() {
            return {
                allowBgClick: true,
                noticeAreaClass: 'send-record-remind',
                text: `提交成功，此紀錄將由指派者進行審核。`,
                options: [
                    {
                        text: '關閉提示',
                        option: {
                            class: 'leave-style',
                        }
                    },
                ],
            }
        }
    });
};

// 提醒退審完成
function rejectAuditRemind(assignStatus) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'reject-audit-remind');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#reject-audit-remind',
        mixins: [bottomNoticeCompon],
        data() {
            let text = assignStatus ? '退審成功，請重新指派缺失改善人員。' : '退審成功，此紀錄將退回給缺失改善人員。';
            return {
                allowBgClick: true,
                noticeAreaClass: 'reject-audit-remind',
                text,
                options: [
                    {
                        text: '關閉提示',
                        option: {
                            class: 'leave-style',
                        }
                    },
                ],
            }
        },
    });
};

// 提醒送出審核至公司端
function passAuditRemind() {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'pass-audit-remind');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#pass-audit-remind',
        mixins: [bottomNoticeCompon],
        data() {
            return {
                allowBgClick: true,
                noticeAreaClass: 'send-record-remind',
                text: `通過審核提交成功，此紀錄將送至安保中心審核。`,
                options: [
                    {
                        text: '關閉提示',
                        option: {
                            class: 'leave-style',
                        }
                    },
                ],
            }
        }
    });
};