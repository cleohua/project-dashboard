// 公司端、工地端各自功能
import * as utils from "./utils.js";
import * as cs from "./compony-side.js";
import * as ps from "./project-side.js";

export default {
    // utils
    viewRecord: cs.viewRecord,
    viewRecordFloat: utils.viewRecordFloat,
    editPicture: utils.editPicture,
    editPict4Record: utils.editPict4Record,
    epxortFromat: utils.epxortFromat,
    exportReportView: utils.exportReportView,
    // compony
    emptyChecklistRemind: cs.emptyChecklistRemind,
    settingPage: cs.settingPage,
    exportSetting: cs.exportSetting,
    warn4export: cs.warn4export,
    editChecklistName: cs.editChecklistName,
    editChecklistName4sh: cs.editChecklistName4sh,
    editChecklist: cs.editChecklist,
    editChecklist4sh: cs.editChecklist4sh,
    editTag: cs.editTag,
    editPaperInfo: cs.editPaperInfo,
    checkerSelect: cs.checkerSelect,
    paperPage: cs.paperPage,
    viewSummary: cs.viewSummary,
    warn: cs.warn,
    sendPaperConfirm: cs.sendPaperConfirm,
    finalConfirm: cs.finalConfirm,
    deletePaperWarn: cs.deletePaperWarn,
    deleteFailCheck: cs.deleteFailCheck,
    nextStep: cs.nextStep,
    bottomPopover: cs.bottomPopover,
    editRecordPage: cs.editRecordPage,
    selectCheckItem: cs.selectCheckItem,
    selcetDangerType: cs.selcetDangerType,
    selectReason: cs.selectReason,
    selectPenalty: cs.selectPenalty,
    selectWorker: cs.selectWorker,
    selectPicture: cs.selectPicture,
    mapMaker: cs.mapMaker,
    setSHRate: cs.setSHRate,
    setSHScore: cs.setSHScore,    
    viewShScore: cs.viewShScore,
    // project
    userMana: ps.userMana,
    selectJobType: ps.selectJobType,
    viewRecordForProject: ps.viewRecordForProject,
    viewJobHistroy: ps.viewJobHistroy,
    selectCompany: ps.selectCompany,
    engineerSelect: ps.engineerSelect,
}