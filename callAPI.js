// console.log('callapi');
import * as sysFetch from "../../main/sysFetch.js";

var user_id;
var sys_code;
var userName;

export function setArgs(args) {
    user_id = args.user_id;
    sys_code = args.sys_code;
    userName = args.userName;
};

export function getArgs() {
    return {
        user_id,
        sys_code,
        userName,
    }
};

export async function awaitDelay(times) {
    return new Promise(resolve => {
        setTimeout(resolve, times);
    });
};

// 安保功能狀態與權限
export async function getPermission() {
    let sendObj = {
        api: 'Security/getPermission',
        data: {
            user_id,
            sys_code_id: sys_code,
        },
    }
    let rsData = await sysFetch.get(sendObj);
    return rsData.status && rsData.data ? rsData.data : {};
}

// 取使用者
export async function getUser(project_id = null) {
    let sendObj = {
        api: 'AssUser/GetData_AssUser',
        data: {
            sys_code: project_id ?? sys_code,
            withOutSuspend: true
        },
    }
    let rsData = await sysFetch.get(sendObj);
    return rsData.Status && rsData.Data ? rsData.Data : [];
};

// 取會驗人員
// value: userArray
export async function getChecker() {
    let sendData = {
        api: 'Security/getPersonList',
        data: {
            user_id,
            sys_code_id: sys_code,
        }
    }
    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : [];
};

// 安保列表
// 取專案清單
export async function getProjectList() {
    let sendObj = {
        api: 'Security/getProjectList',
        data: {
            user_id,
            sys_code_id: sys_code,
        }
    }

    let rsData = await sysFetch.get(sendObj);
    if (rsData.status && rsData.data) {
        return rsData.data.map(i => ({ text: i.name, id: i.sys_code_id }));
    } else {
        return [];
    }
};

// 取督導人清單
export async function getSuperviseList() {
    let sendData = {
        api: 'Security/getSuperviseList',
        data: {
            user_id,
            sys_code_id: sys_code,
        }
    }
    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : [];
};
// 取工作別清單

// 取記錄列表 -
// paperType 業務類型: 全部/品質/安衛/技師
// workType 檢查項目: 全部/品質/安衛/技師 
// reportType: 全部/缺失/提醒/優良/現況
// status: 無狀態/待送出/未回覆/待審核/結案
// range: 資料範圍
// project: 專案
// supervise: 督導人
// 全部/指定使用者(個人工作區)
export async function getRecordList(sendInfo) {
    let sendData = {
        api: 'Security/getRecordList',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...sendInfo
        }
    }
    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 取報告列表
// paperType 業務類型: 全部/品質/安衛/技師
// range: 資料範圍
// project: 專案
export async function getPaper(sendInfo) {
    let sendData = {
        api: 'Security/getSafeInspectReportList',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...sendInfo
        }
    }
    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 檢查項目設定
// 取檢查項目列表
export async function getChecklist() {
    let sendData = {
        api: 'Security/getCheckList',
        data: {
            user_id,
            sys_code_id: sys_code,
        }
    }
    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : null;
};

// 取檢查項目、自檢表內容
export async function getListContent(uid) {
    let sendData = {
        api: 'Security/getCheckListItem',
        data: {
            user_id,
            sys_code_id: sys_code,
            uid,
        }
    }
    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : null;
};

// 取常用罐頭訊息
export async function getTagList(uid) {
    let sendData = {
        api: 'Security/getTemplate',
        data: {
            user_id,
            sys_code_id: sys_code,
            uid,
        }
    }
    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 編輯常用罐頭訊息
export async function editTag(data) {
    let sendData = {
        api: 'Security/modifyTemplate',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...data
        }
    }
    let rs = await sysFetch.post(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 新增/編輯自檢表、檢查項目群組
// type > 0: 安衛, 1:品質技師
export async function editCheckList(data, type = 0) {
    let sendData = {
        api: `Security/${type ? 'addChecklistItem' : 'addSelfChecklistItem'}`,
        data: {
            user_id,
            sys_code_id: sys_code,
            ...data
        }
    }
    let rs = await sysFetch.post(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 刪除自檢表、檢查項目群組
export async function deleteCheckList(uid) {
    let sendData = {
        api: 'Security/delChecklistItem',
        data: {
            user_id,
            sys_code_id: sys_code,
            uid
        }
    }
    let rs = await sysFetch.post(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 編輯檢查項目群組名稱
export async function editCheckListName(info) {
    let sendData = {
        api: 'Security/renameChecklist',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info
        }
    }
    let rs = await sysFetch.post(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 下載檢查項目範本
export async function getCheckListForm(info) {
    let sendData = {
        api: 'Security/exportChecklistItem',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info,
        }
    }
    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 匯入自檢表、檢查項目
// type > 0: 安衛, 1: 品質、技師
export async function importChecklist(info, sendFile = {}) {
    return new Promise((resolve) => {
        let sendData = {
            sys_code_id: sys_code,
            user_id,
            ...info,
        }
        let sendObj = {
            api: 'Security/importChecklistItem',
            data: sendData,
            threeModal: true,
            sysCode: sys_code,
        };

        let options = {
            url: wrsAPI + "uploaderAPI",
            type: "POST",
            data: sendObj,
            file: sendFile,
            success: function (rs) {
                if (rs.status) {
                    resolve(rs.data);
                } else {
                    resolve(false);
                }
            },
            error: function (e) {
                resolve(false);
            },
        };

        $.formSender(options);
    });
};

// 新增/編輯報告
export async function editPaperInfo(info) {
    let sendData = {
        api: 'Security/addSafeInspectReport',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info
        }
    }
    let rs = await sysFetch.post(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 取報資訊
// 是否可編輯、是否顯示自檢表列表
export async function getPaperInfo(uid) {
    let sendData = {
        api: 'Security/getSafeInspectReport',
        data: {
            user_id,
            sys_code_id: sys_code,
            uid,
        }
    }
    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 刪除報告
export async function deletePaper(uid) {
    let sendData = {
        api: 'Security/delSafeInspectReport',
        data: {
            user_id,
            sys_code_id: sys_code,
            uid,
        }
    }
    let rs = await sysFetch.post(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 工地概況
export async function getPaperSummary(uid) {
    let sendData = {
        api: 'Security/getSafeInspectOverview',
        data: {
            user_id,
            sys_code_id: sys_code,
            uid,
        }
    }
    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 取照片存放
export async function getPaperPicture(uid) {
    let sendData = {
        api: 'Security/getPictureList',
        data: {
            user_id,
            sys_code_id: sys_code,
            uid,
        }
    }
    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 取管理記錄
export async function getPaperRecord(uid) {
    let sendData = {
        api: 'Security/getReportRecordList',
        data: {
            user_id,
            sys_code_id: sys_code,
            uid,
        }
    }
    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 取安衛評分列表
export async function getPaperSHList(uid) {
    let sendData = {
        api: 'Security/getSafetyHealth',
        data: {
            user_id,
            sys_code_id: sys_code,
            uid,
        }
    }
    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 下載安衛評分表
export async function downloadSHScore(info) {
    let sendData = {
        api: 'Security/exportSafetyHealth',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info,
        }
    }
    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 刪除安衛評分
export async function deleteSH(info) {
    let sendData = {
        api: 'Security/delSafetyHealth',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info,
        }
    }
    let rs = await sysFetch.post(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 新增照片、底圖
// 新增檔案
// propress: 上傳進度
// abortFun: 中斷function
// type: bg: background, pict、camera: picture
export async function addPicture(task, sendFile = {}, type = 'photo', uid) {

    return new Promise((resolve) => {
        let sendData = {
            sys_code_id: sys_code,
            user_id,
            uid,
            type: type == 'bg' ? 'base' : 'photo',
        }
        let sendObj = {
            api: 'Security/addReportPicture',
            data: sendData,
            threeModal: true,
            sysCode: sys_code,
        };

        let options = {
            url: wrsAPI + "uploaderAPI",
            type: "POST",
            data: sendObj,
            file: sendFile,
            beforeSend: function (xhr) {
                task.abortFun = function () {
                    xhr.abort();
                }
            },
            uploadProgress: (event, position, total, percentComplete) => {
                task.propress(task.keyIndex, percentComplete);
            },
            success: function (rs) {
                if (rs.status) {
                    resolve(rs.data);
                } else {
                    resolve(false);
                }
            },
            error: function (e) {
                resolve(false);
            },
        };

        $.formSender(options);
    });
};

// 底圖更名
export async function editPictName(info) {
    let sendData = {
        api: 'Security/renamePicture',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info,
        }
    }
    let rs = await sysFetch.post(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 設定照片類別
export async function setPictType(info) {
    let sendData = {
        api: 'Security/onlyPictureType',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info,
        }
    }
    let rs = await sysFetch.post(sendData);
    return rs.status && rs.data ? rs.data : false;
}

// 新增照片類別
export async function addPictType(info) {
    let sendData = {
        api: 'Security/setPictureType',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info,
        }
    }
    let rs = await sysFetch.post(sendData);
    return rs.status && rs.data ? rs.data : false;
}

// 下載照片
export async function downloadPicture(picArr) {
    let sendData = {
        api: 'Security/getPicturePackageLink',
        data: {
            user_id,
            sys_code_id: sys_code,
            picArr,
        }
    }
    let rs = await sysFetch.post(sendData);
    if (rs.status && rs.data) {
        const { url: path, name } = rs.data;
        downloadAndRename({ path, name });
    } else {
        floatMsgRemind('取得檔案失敗');
    }
};

// 刪除照片
// 照片/底圖
export async function deletePitcture(info) {
    let sendData = {
        api: 'Security/delReportPicture',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info,
        }
    }
    let rs = await sysFetch.post(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 取照片轉url
export async function getImageUrl(uid) {
    let sendData = {
        api: 'Security/getPicturePath',
        data: {
            user_id,
            sys_code_id: sys_code,
            uid,
        }
    }

    let url = await sysFetch.get(sendData)
        .then(rsData => rsData?.data)
        .then(path => path ? sysFetch.get(`${imgUrl}${path}`, { format: 'blob' }) : false)
        .then(url => url ? URL.createObjectURL(url) : '');
    return url;
}

// 編輯照片儲存
export async function updateImage(info) {
    let sendData = {
        api: 'Security/modifyReportPicture',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info,
        }
    }
    let rs = await sysFetch.post(sendData);
    return rs.status && rs.data ? rs.data : false;
}

// 新增記錄相關
// 取缺失原因
export async function getReason() {
    let sendData = {
        api: 'Security/getReasonList',
        data: {
            user_id,
            sys_code_id: sys_code,
        }
    }
    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : [];
};

// 取危害類型，僅安衛
export async function getDangerType() {
    let sendData = {
        api: 'Security/getReasonList',
        data: {
            user_id,
            sys_code_id: sys_code,
            type: 3
        }
    }
    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : [];
};

// 取廠商工種
export async function getCompanyWork(uid) {
    let sendData = {
        api: 'Security/getCompanyWork',
        data: {
            user_id,
            sys_code_id: sys_code,
            uid,
        }
    }
    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 取罰鍰列表與金額
export async function getPenalty(uid) {
    let sendData = {
        api: 'Security/getProjectPenalty',
        data: {
            user_id,
            sys_code_id: sys_code,
            uid,
        }
    }
    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : [];
};

// 新增報告
export async function editRecord(info) {
    let sendData = {
        api: 'Security/addReportRecord',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info,
        }
    }
    let rs = await sysFetch.post(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 檢視報告
export async function getRecord(info) {
    let sendData = {
        api: 'Security/getReportRecord',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info,
        }
    }
    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 取送出報告清單
export async function getSendList(uid) {
    let sendData = {
        api: 'Security/checkReportRecordNotSend',
        data: {
            user_id,
            sys_code_id: sys_code,
            uid,
        }
    }
    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : [];
};

// 送出記錄到工地
export async function sendPaperRecord(info) {
    let sendData = {
        api: 'Security/pushRecord',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info,
        }
    }
    let rs = await sysFetch.post(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 刪除報告
export async function deleteRecord(info) {
    let sendData = {
        api: 'Security/delReportRecord',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info,
        }
    }
    let rs = await sysFetch.post(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 取得記錄自檢表
export async function getSHScore(uid) {
    let sendData = {
        api: 'Security/getLastSafetyHealth',
        data: {
            user_id,
            sys_code_id: sys_code,
            uid,
        }
    }
    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 新增自檢表評分
export async function editSHScore(info) {
    let sendData = {
        api: 'Security/addSafetyHealth',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info,
        }
    }
    let rs = await sysFetch.post(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 取得自檢表記錄
export async function getSHrecord(info) {
    let sendData = {
        api: 'Security/getLastSafetyHealth',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info,
        }
    }
    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 匯出報告用
// 取概況與記錄
export async function getExportData(uid) {
    let sendData = {
        api: 'Security/getReportPreview',
        data: {
            user_id,
            sys_code_id: sys_code,
            uid,
        }
    }

    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 儲存匯出紀錄
export async function updateExportData(info) {
    let sendData = {
        api: 'Security/saveExportReport',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info,
        }
    }

    let rs = await sysFetch.post(sendData);
    return rs?.status;
};

// 取已建立匯出報告清單
export async function getExportPaperList(info) {
    let sendData = {
        api: 'Security/getExportReportList',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info,
        }
    }

    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : false;
}

// 建立檔案
export async function exportPaperReport(info) {
    let sendData = {
        api: 'Security/exportReport',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info,
        }
    }

    let rs = await sysFetch.post(sendData);
    return rs.status && rs.data ? rs.data : false;
}

// 工地(專案)端
// 取工地內部人員清單與權限
// 取缺改人員
export async function getPrincipalList() {
    let sendData = {
        api: 'Security/getPrincipalList',
        data: {
            user_id,
            sys_code_id: sys_code,
        }
    }

    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : [];
}

// 人員管理
export async function getProjectUserList() {
    let sendData = {
        api: 'Security/getInsidersList',
        data: {
            user_id,
            sys_code_id: sys_code,
        }
    }

    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : false;
}

// 設定人員
export async function setUserJob(info) {
    let sendData = {
        api: 'Security/addInsiders',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info,
        }
    }
    let rs = await sysFetch.post(sendData);
    return rs.status && rs.data ? rs.data : false;
}

// 刪除人員
export async function deleteUserJob(uid) {
    let sendData = {
        api: 'Security/removeInsiders',
        data: {
            user_id,
            sys_code_id: sys_code,
            uid,
        }
    }
    let rs = await sysFetch.post(sendData);
    return rs.status && rs.data ? rs.data : false;
}

// 變更僅通知/主辦
export async function setNotific(uid) {
    let sendData = {
        api: 'Security/switchPermissions',
        data: {
            user_id,
            sys_code_id: sys_code,
            uid,
        }
    }
    let rs = await sysFetch.post(sendData);
    return rs.status && rs.data ? rs.data : false;
}

// 取得職位歷程
export async function getJobHistory(uid) {
    let sendData = {
        api: 'Security/getChangeLog',
        data: {
            user_id,
            sys_code_id: sys_code,
            uid,
        }
    }

    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : false;
}

// 審核歷程
// 審核狀態代號
//  1.建立 / 2.提送工地 / 3.工地指派 / 4.待回覆 / 5.工地審核
//  6.工地退審 / 7.通過並提交 / 8.退審 / 9.缺失回覆 / 10.結案
export async function getExamineHistory(info) {
    let sendData = {
        api: 'Security/getExamineHistory',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info,
        }
    }

    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : false;
}

export async function getRecordForProject(info) {
    let sendData = {
        api: 'Security/getRecordContent',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info,
        }
    }
    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : [];
};

//工地端指派及不指派缺失改善人員
export async function assignCheckItem(info) {
    let sendData = {
        api: 'Security/assignCheckItem',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info
        }
    }
    let rs = await sysFetch.post(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 儲存工地端紀錄
export async function editRecordForProject(info, sendFile = {}) {
    return new Promise((resolve) => {
        let sendData = {
            sys_code_id: sys_code,
            user_id,
            ...info,
        }
        let sendObj = {
            api: 'Security/editExamineRecord',
            data: sendData,
            threeModal: true,
            sysCode: sys_code,
        };

        let options = {
            url: wrsAPI + "uploaderAPI",
            type: "POST",
            data: sendObj,
            file: sendFile,
            success: function (rs) {
                if (rs.status) {
                    resolve(rs.data);
                } else {
                    resolve(false);
                }
            },
            error: function (e) {
                resolve(false);
            },
        };

        $.formSender(options);
    });
};

// 直接提交紀錄
export async function sendRecordDirectForProject(info) {
    let sendData = {
        api: 'Security/submitExamineRecord',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info
        }
    }
    let rs = await sysFetch.post(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 工地端內部審核
export async function porjectExamine(info) {
    let sendData = {
        api: 'Security/addInsidersExamine',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info
        }
    }
    let rs = await sysFetch.post(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 安保中心最後審核
export async function componyExamine(info) {
    let sendData = {
        api: 'Security/addExamine',
        data: {
            user_id,
            sys_code_id: sys_code,
            ...info
        }
    }
    let rs = await sysFetch.post(sendData);
    return rs.status && rs.data ? rs.data : false;
};

// 取得使用者設定內容
export async function getGradingList() {
    let sendData = {
        api: 'Security/getGradingList',
        data: {
            user_id,
            sys_code_id: sys_code,
        }
    }

    let rs = await sysFetch.get(sendData);
    return rs.status && rs.data ? rs.data : [];
};

// 取統計分析widget清單
export async function getWidgetList() {
    const widgetList = [
        // type: form
        {
            id: 1,
            title: '各工地安衛缺失改善統計',
            size: 'half',
            type: 'form',
            columns: [1, 2],
            order_cols: [1, 2],
            active_cols: [1, 2, 7, 8, 9],
            sort_by: [1],
            options: {
                withDate: true,
                dateFormat: 'YYYY-MM-DD',
                dateRange: true,
                dateStart: '2022-10-30',
                dateEnd: '2022-11-30',
                keywordFilter: true,
                keyword: '',
                withSelect: true,
                selectColumn: [1],
            },
            get: {
                api: 'Security/',
                params: [],
                post: false,
            },
        },
        // {
        //     id: 2,
        //     title: 'widget標題2',
        //     size: 'half',
        //     type: 'form',
        //     columns: [4, 5, 6],
        //     order_cols: [4, 5, 6],
        //     active_cols: [4, 5, 6],
        //     sort_by: [5],
        //     options: {
        //         withDate: true,
        //         dateFormat: 'YYYY-MM',
        //         dateRange: true,
        //         dateStart: '2022-07',
        //         dateEnd: '2022-11',
        //         keywordFilter: false,
        //         keyword: 'aaa',
        //         selectColumn: [5],
        //     },
        //     get: {
        //         api: 'Security/',
        //         params: [],
        //         post: false,
        //     },
        // },
    ];

    const widgetListData = {
        widget: widgetList,
        columns: {
            1: {
                name: '專案名稱',
                sortable: true,
                filterable: false,
                selectable: true,
                searchable: true,
                options: {
                    width: 200,
                    cellStyle: [
                        {
                            color: ['rgba(255,255,255,.8)'],
                            type: 'text',
                        }
                    ],
                    labels: [
                        {
                            id: 1,
                            text: '專案名稱1OOXX專案名稱',
                        },
                        {
                            id: 2,
                            text: '專案名稱2OOXX專案名稱',
                        },
                        {
                            id: 3,
                            text: '專案名稱3OOXX專案名稱',
                        },
                    ]
                },
            },
            2: {
                name: '本月成效',
                sortable: false,
                filterable: false,
                selectable: false,
                searchable: false,
                children: [7, 8, 9],
            },
            // 3: {
            //     name: '責任工程師',
            //     col_id: 1,
            //     sortable: true,
            //     filterable: false,
            //     selectable: false,
            //     searchable: true,
            //     options: {
            //         width: 200,
            //         cellStyle: ['#ecce2a'],
            //     },
            // },
            4: {
                name: '責任工程師',
                sortable: true,
                filterable: false,
                selectable: false,
                searchable: true,
                options: {
                    width: 200,
                    cellStyle: [
                        {
                            color: ['#ecce2a'],
                            type: 'text',
                        }
                    ],
                },
            },
            5: {
                name: '缺失件數',
                sortable: true,
                filterable: false,
                selectable: false,
                searchable: true,
                options: {
                    width: 200,
                    cellStyle: [
                        {
                            color: ['rgba(255,255,255,.8)'],
                            type: 'text',
                        }
                    ],
                },
            },
            6: {
                name: '尚未改善',
                sortable: true,
                filterable: false,
                selectable: false,
                searchable: true,
                options: {
                    width: 200,
                    cellStyle: [
                        {
                            color: ['#ecce2a'],
                            type: 'text',
                        }
                    ],
                },
            },
            7: {
                name: '缺失件數',
                sortable: true,
                filterable: false,
                selectable: false,
                searchable: false,
                options: {
                    width: 150,
                    cellStyle: [{
                        color: ['rgba(255,255,255,.8)'],
                        type: 'text',
                    }],
                },
            },
            8: {
                name: '7日內改善完成件數',
                sortable: true,
                filterable: false,
                selectable: false,
                searchable: false,
                options: {
                    width: 150,
                    cellStyle: [
                        {
                            color: ['rgba(255,255,255,.8)'],
                            type: 'text',
                        },
                        {
                            color: ['rgba(255,255,255,.8)', 'red'],
                            threshold: [60],
                            type: 'persent',
                        },
                    ],
                },
            },
            9: {
                name: '未改善件數',
                sortable: true,
                filterable: false,
                selectable: false,
                searchable: false,
                options: {
                    width: 150,
                    cellStyle: [
                        {
                            color: ['rgba(255,255,255,.8)'],
                            type: 'text',
                        },
                        {
                            color: ['rgba(255,255,255,.8)', 'red'],
                            threshold: [60],
                            type: 'persent',
                        },
                    ],
                },
            },
            // 10: {
            //     name: 'column10',
            //     sortable: true,
            //     filterable: false,
            //     selectable: false,
            //     searchable: true,
            //     options: {
            //         width: 200,
            //         cellStyle: ['#ecce2a'],
            //     },
            // },
        },
    }

    return widgetListData;
};

// 取得使用者設定內容
export async function getUserProfile() {
    const profileData = {
        widgetOrder: [1, 2],
        widgetSet: {}
    }

    return profileData;
};

export async function getWidgetData(api = 'Security/', info, post = false) {
    const fukeListData = (index) => {
        return {
            uid: index,
            data: [
                {
                    data: [`專案名稱${index}OOXX專案名稱`],
                    uid: index,
                },
                {
                    data: [`${index * Math.floor(Math.random() * 10)}`]
                },
                {
                    data: [
                        `12`,
                        `${Math.floor(Math.random() * 10) * 10}`,
                    ]
                },
                {
                    data: [
                        `22`,
                        `${Math.floor(Math.random() * 10) * 10}`,
                    ]
                },
            ],
        }
    }

    return {
        col_id_refer: [1, 7, 8, 9],
        list: new Array(34).fill(1).map((v, i) => fukeListData(v + i)),
    };

    let sendData = {
        api,
        data: {
            user_id,
            sys_code_id: sys_code,
            info,
        }
    }

    const func = post ? sysFetch.post : sysFetch.get;
    let rs = await func(sendData);
    return rs.status && rs.data ? rs.data : false;
}