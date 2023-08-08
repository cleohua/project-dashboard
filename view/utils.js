// 安保中心 通用功能
import * as callapi from "../callAPI.js";

import reportViewerCompon from "../component/report-viewer-compon.js";
import editPictureCompon from "../component/edit-picture-compon.js";
import exportFormatSetCompon from "../component/export-format-set-compon.js";
import exportReportViewCompon from "../component/export-report-view-compon.js";

// 簡易檢視
export function viewRecordFloat({ paperID, recordIdArr }) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'report-viewer');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#report-viewer',
        mixins: [reportViewerCompon],
        async created() {
            const rsData = await callapi.getRecord({
                uid: paperID,
                record_arr: recordIdArr,
            });
            if (rsData) {
                const { data: cardData } = rsData;

                if (cardData) {
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

                    this.cardList = cardData.map(card => {
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
                            keyIndex: this.keyIndex++,
                        };

                        return data;
                    });
                }
                this.dialogShow = true;
            }

        }
    });
};

// 照片編輯功能
export function editPicture({ uid, pictID, finishCall }) {
    const putArea = document.getElementById('main-wrapper');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'edit-picture');
    putArea.appendChild(vueArea);
    let getUrl = callapi.getImageUrl(pictID);


    return new Vue({
        el: '#edit-picture',
        mixins: [editPictureCompon],
        data() {
            return {
                getUrl,
            }
        },
        methods: {
            closeClick() {
                finishCall(false);
            },
            async nextBtnClick() {
                this.loading = true;

                let sendData = {
                    file: this.output(),
                    uid,
                    pic: pictID,
                }

                let rsStatus = await callapi.updateImage(sendData);
                if (rsStatus) {
                    finishCall(true);
                    this.$refs.dialog.onDialogClose()
                } else {
                    this.loading = false;
                    floatDialog('編輯照片失敗');
                }
            },
        },
    });
}

// 照片編輯for紀錄中使用
export async function editPict4Record({ pictID, src, sureCall }) {
    const putArea = document.getElementById('main-wrapper');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'edit-picture');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#edit-picture',
        mixins: [editPictureCompon],
        data() {
            return {
                getUrl: src || callapi.getImageUrl(pictID),
            }
        },
        methods: {
            async nextBtnClick() {
                this.loading = true;

                let src = this.output();
                let sendData = {
                    src,
                    edit: true,
                };

                sureCall(sendData);
                this.$refs.dialog.onDialogClose();
            },
        }
    });
}

// 報告匯出格式選擇
export async function epxortFromat(info, startCall, finishCall) {
    const putArea = document.getElementById('fullsize');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'export-format-set');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#export-format-set',
        mixins: [exportFormatSetCompon],
        methods: {
            async nextBtnClick() {
                let sendData = {
                    type: this.curFileOpt,
                    reply: this.curReplyOpt == 0,
                    ...info,
                }

                floatMsgRemind('套表檔案建立中');
                this.$refs.dialog.onDialogClose();

                startCall?.(info.uid);
                let rsData = await callapi.exportPaperReport(sendData);
                if (rsData) {
                    const { name, url } = rsData;
                    await downloadAndRename({ path: url, name });
                } else {
                    floatMsgRemind('套表檔案建立失敗');
                }
                finishCall?.(info.uid);
            },
        },
    });
};

// 檢視匯出報告列表
export async function exportReportView(data, isProject = false) {
    const putArea = document.getElementById('fullsize');
    putArea.classList.add('active');
    let vueArea = document.createElement('div');
    vueArea.setAttribute('id', 'export-select');
    putArea.appendChild(vueArea);

    return new Vue({
        el: '#export-select',
        mixins: [exportReportViewCompon],
        data() {
            return {
                ...data,
                isProject,
                getData: callapi.getExportPaperList,
                downloadFile: epxortFromat,
            }
        },
        methods: {
            afterLeave() {
                if (!putArea.querySelector(':scope > div')) {
                    putArea.classList.remove('active');
                }
            },
        },
    });
};