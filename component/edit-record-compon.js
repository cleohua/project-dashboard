import edit from "../view/index.js";

import fullsizeDialogSlotCompon from "../../../vue/assets/fullsize-dialog-slot-compon.js";
import editRecordCardCompon from "./edit-record-card-compon.js";
import editImproveCardCompon from "./edit-improve-card-compon.js";
import examineRecordCompon from "./examine-record-compon.js";
import template from "../template/edit-record-temp.js";

export default {
    name: 'edit-record-compon',
    template,
    components: {
        'full-dialog': fullsizeDialogSlotCompon,
        'record-card': editRecordCardCompon,
        'improve-card': editImproveCardCompon,
        'examine-record': examineRecordCompon,
    },
    data() {
        return {
            // dialog
            elementID: 'edit-record-page',
            titleText: '建立管理記錄',
            nextBtnShow: true,
            nextBtnText: '完成',
            returnBtnText: '返回',
            nextBtnClassArr: [],
            closeCall: null,
            paperHeaderHide: false,
            // 檢視下使用
            emitSubMenuEvent: false,
            subMenu: false,
            subMenuArr: [],
            // content
            accData: null,
            userListForProject: [],
            companyListForProject: [],
            loading: true,
            keyIndex: 0,
            cardList: [],
            improveList: [],
            middle: null,
            after: null,
            paperID: 0,
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
                checker: [],
                checkerName: [],
                // 業務類型
                type: 0,
            },
            changeTabs: [
                {
                    text: '改善前',
                    hoverText: '',
                    show: true,
                    index: 0,
                },
                {
                    text: '+',
                    hoverText: '新增改善中',
                    show: false,
                    index: -1,
                },
                {
                    text: '改善中',
                    hoverText: '',
                    show: false,
                    index: 1,
                },
                {
                    text: '改善後',
                    hoverText: '',
                    show: true,
                    index: 2,
                },
            ],
            activeTarget: null,
            activeIndex: 0,
            focus: 0,
            showNewCardBtn: true,
            editable: true,
            // 檢視審核部分
            showExamine: false,
            showExamineRecord: false,
            isProject: false,
            currentChangeTab: 0,
            examineHistory: {
                flow: [],
                history: [],
            },
            status: 0,
            permission: {
                // 可否審核
                examine: false,
                // 可否指派,專案端
                assign: false,
                // 可否編輯
                edit: false,
                // 紀錄是否可提送公司,專案端
                submit: false
            },
        };
    },
    watch: {
        count(newVal, oldVal) {
            if (newVal == 1) {
                this.cardList[0].allowRemove = false;
            }
            if (oldVal == 1) {
                this.cardList.forEach(card => card.allowRemove = true);
            }
        },
        currentChangeTab() {
            this.$refs.recordContent.scrollTop = 0;
        }
    },
    computed: {
        activeCard() {
            if (this.activeTarget) {
                return this.cardList.find(card => card.keyIndex == this.activeTarget);
            } else {
                return null;
            }
        },
        count() {
            return this.cardList.length;
        },
        showChangeTabs() {
            const type = this.cardList?.[0]?.reportType;
            // 僅缺失
            return type == 1 ? this.isProject ? this.status > 1 : this.status > 2 : false;
        },
        showRecordCard() {
            return this.showChangeTabs ? this.currentChangeTab == 0 : true;
        },
        showImproveCard() {
            return this.showChangeTabs && this.currentChangeTab != 0;
        },
        showAddRecordBtn() {
            return this.editable && !this.isProject && this.showNewCardBtn;
        },
        subMenuOption() {
            const reportType = this.cardList?.[0]?.reportType;
            const { examine, assign, edit } = this.permission;
            // 工地端
            if (this.isProject) {
                // 非缺失
                if (reportType > 1) return [];

                switch (this.status) {
                    // 待指派
                    case 1:
                        if (assign) {
                            return this.subMenuArr.slice(0, 2);
                        } else {
                            return this.subMenuArr.slice(2, 3);
                        }
                    // 待回覆
                    case 2:
                        if (this.editable) {
                            // 編輯狀態
                            return this.subMenuArr.slice(6, 8);
                        } else if (edit) {
                            return this.subMenuArr.slice(3, 5);
                        } else {
                            return this.subMenuArr.slice(5, 6);
                        }
                    // 待審核
                    case 3:
                        if (examine) {
                            return this.subMenuArr.slice(8, 10);
                        } else {
                            return this.subMenuArr.slice(10, 11);
                        }
                    // 已提交
                    case 4:
                        return this.subMenuArr.slice(11, 12);
                    // 結案
                    case 5:
                        return this.subMenuArr.slice(-1);
                }
            }
            // 公司端
            if (!this.isProject) {
                if (reportType > 1) {
                    // 非缺失，不用審核，工地端同步，隨時可編輯
                    if (this.editable) {
                        // 編輯狀態
                        return this.subMenuArr.slice(3, 4);
                    } else if (edit) {
                        return this.subMenuArr.slice(0, 2);
                    } else {
                        return this.subMenuArr.slice(2, 3);
                    }
                }

                switch (this.status) {
                    // 待送出
                    case 1:
                        if (this.editable) {
                            // 編輯狀態
                            return this.subMenuArr.slice(3, 4);
                        } else if (edit) {
                            return this.subMenuArr.slice(0, 2);
                        } else {
                            return this.subMenuArr.slice(2, 3);
                        }
                    // 未回覆
                    case 2:
                        return this.subMenuArr.slice(4, 5);
                    // 待審核
                    case 3:
                        if (examine) {
                            return this.subMenuArr.slice(5, 6);
                        } else {
                            return this.subMenuArr.slice(6, 7);
                        }
                    // 已結案
                    case 4:
                        return this.subMenuArr.slice(-1);
                }
            }
        },
        improveData() {
            const num = this.currentChangeTab;
            return num == 2 ? this.after : num == 1 ? this.middle : {};
        },
        allowImproveCardRemove() {
            // 僅改善中可以
            return this.currentChangeTab == 1;
        },
        curChangeTab() {
            return this.changeTabs.filter(t => t.show);
        },
        changeTabClass() {
            return (tab) => {
                return {
                    'active': this.currentChangeTab == tab.index,
                    'plus-icon': tab.index == -1
                }
            }
        }
    },
    methods: {
        // dialog event
        closeClick() { },
        nextBtnClick() { },
        pageWheel(e) {
            const el = this.$refs.recordContent;
            const scrollTop = el.scrollTop;
            const offsetHeight = el.offsetHeight;
            const scrollHeight = el.scrollHeight;
            if (!(scrollHeight > offsetHeight)) return;

            const sureCall = (value = 100) => {
                let newVal = scrollTop + value;
                if (newVal < 0) newVal = 0;
                if (newVal > scrollHeight) newVal = offsetHeight;

                el.scrollTo({
                    top: newVal,
                    // behavior: 'smooth',
                });
            }
            if (e.deltaY > 0) {
                if (this.paperHeaderHide) {
                    sureCall?.(70);
                } else {
                    this.paperHeaderHide = true;
                }
            } else {
                if (scrollTop == 0) {
                    this.paperHeaderHide = false;
                } else {
                    sureCall?.(-70);
                }
            }
        },
        subMenuClick(event) {
            const { eventText, args = null } = event;
            this?.[eventText]?.(args);
        },
        changeTabsClick(index) {
            if (this.editable && index == -1) {
                // 改善後內容複製
                this.middle = _.cloneDeep(this.after);
                this.changeTabs[1].show = false;
                this.changeTabs[2].show = true;
                this.currentChangeTab = 1;
            } else {
                this.currentChangeTab = index;
            }
        },
        async select(index, data) {
            const { type, keyIndex, args } = data;
            this.activeTarget = keyIndex;
            this.activeIndex = index;

            let card = this.cardList.find(c => c.keyIndex == keyIndex);
            switch (type) {
                case 'location': {
                    const sureCall = (markerLog) => {
                        if (this.editable) {
                            this.update('location', markerLog);
                        }
                    }
                    let mapList = this.editable ? this.accData.getBgPicture() : card.picture.bg;
                    edit.mapMaker({
                        mapList,
                        markerLog: _.cloneDeep(card.mark),
                        current: 0,
                        editable: this.editable,
                        sureCall,
                    });
                    break;
                }
                case 'checkitem': {
                    const sureCall = (item) => this.update('checkitem', item);
                    // 依照報告類型選預設表單
                    const defaultSet = () => {
                        // 0: 安衛, 1: 品質, 2: 技師
                        return {
                            currentForm: this.paperInfo.type,
                        }
                    }
                    let select = card.checkitem ? _.cloneDeep(card.checkitem) : defaultSet();
                    edit.selectCheckItem({
                        select,
                        sureCall,
                        getData: this.accData,
                    });
                    break;
                }
                case 'tagList': {
                    if (card.checkitem?.selectGroup) {
                        card.tagList = await this.accData.getMsg(card.checkitem.selectGroup, card.reportType);
                    }
                    break;
                }
                case 'reason': {
                    const sureCall = (list) => this.update('reason', list);

                    edit.selectReason({
                        selectList: _.cloneDeep(card.reason),
                        getData: this.accData.getReason(card.checkitem.currentForm),
                        sureCall,
                    });
                    break;
                }
                case 'danger': {
                    const sureCall = (list) => this.update('danger', list);

                    edit.selcetDangerType({
                        selectList: _.cloneDeep(card.dangerType),
                        dataList: this.accData.getDangerType(),
                        sureCall,
                    });
                    break;
                }
                case 'company':
                case 'work': {
                    const { company, work } = this.accData.getCompanyWork();
                    const sureCall = (data) => this.update('companyWork', data);

                    edit.selectWorker({
                        companyList: company,
                        workList: work,
                        company: _.cloneDeep(card.company),
                        work: _.cloneDeep(card.work),
                        sureCall,
                    })
                    break;
                }
                case 'penalty': {
                    const sureCall = (penalty) => this.update('penalty', penalty);

                    edit.selectPenalty({
                        currentSelect: _.cloneDeep(card.penalty),
                        getData: this.accData,
                        sureCall,
                    })
                    break;
                }
                case 'engineer': {
                    const sureCall = (uidArr) => this.update('engineer', uidArr);
                    edit.checkerSelect({
                        dataList: this.accData.getProjectUser(),
                        currentList: card.engineer.map(u => u.uid),
                        muiltSelect: true,
                        sureCall,
                    })
                    break;
                }
                case 'pictureAdd': {
                    const sureCall = (fileArr) => this.update('pictureAdd', fileArr);
                    let excludeList = card.pictureList.map(f => f?.uid).filter(id => id);
                    let pictureList = this.accData.getPicture(excludeList, true);

                    edit.selectPicture({
                        sureCall,
                        pictureList,
                        muiltSelect: true,
                    });
                    break;
                }
                case 'pictureChange': {
                    const sureCall = (pict) => {
                        this.update('pictureChange', pict, args[0]);
                    }
                    let excludeList = card.pictureList.map(f => f.uid);
                    let pictureList = this.accData.getPicture(excludeList, true);

                    edit.selectPicture({
                        sureCall,
                        pictureList,
                        muiltSelect: false,
                    });
                    break;
                }
                case 'pictureEdit': {
                    const sureCall = (pictObj) => {
                        this.update('pictureEdit', pictObj, args[0]);
                    }
                    // args[0]: current picture index
                    const pict = card.pictureList[args[0]];
                    edit.editPict4Record({
                        pictID: pict.uid,
                        src: pict.edit,
                        sureCall,
                    });
                    break;
                }
                default:
                    // console.warn(event);
                    break;
            }
        },
        async update(type, ...args) {
            // console.log(type, args);
            let card = this.cardList.find(c => c.keyIndex == this.activeTarget);
            switch (type) {
                case 'location':
                    card.mark = args[0];
                    break;
                case 'checkitem':
                    if (card.checkitem && card.checkitem.currentSelect != args[0].currentSelect) {
                        // clear
                        card.reason = [];
                        card.dangerType = [];
                        card.penalty = null;
                        card.fine = '';
                    }
                    card.checkitem = args[0];
                    card.tagList = await this.accData.getMsg(args[0].selectGroup, card.reportType);
                    break;
                case 'reason':
                    card.reason = args[0];
                    break;
                case 'danger':
                    card.dangerType = args[0];
                    break;
                case 'companyWork':
                    card.company = args[0].company;
                    card.work = args[0].work;
                    break;
                case 'penalty':
                    card.penalty = args[0];
                    card.fine = '';
                    break;
                case 'engineer':
                    let userList = this.accData.getProjectUser();
                    card.engineer = userList.filter(u => args[0].includes(u.uid));
                    break;
                case 'pictureAdd':
                    card.pictureList = [...card.pictureList, ...args[0]];
                    this.$refs.card[this.activeIndex].currentPict = card.pictureList.length - 1;
                    break;
                case 'pictureChange':
                case 'pictureEdit':
                    const [newFile, index] = args;
                    this.$set(card.pictureList, index, newFile);
                    break;
                default:
                    break;
            }
        },
        async improveSelect(type) {
            const target = this.improveData;

            switch (type) {
                case 'engineer': {
                    edit.engineerSelect({
                        dataList: this.userListForProject,
                        currentList: target?.engineer?.map(i => i.uid) ?? [],
                        muiltSelect: true,
                        sureCall: (arr) => target.engineer = arr,
                    });
                    break;
                }
                case 'company': {
                    edit.selectCompany({
                        dataList: this.companyListForProject,
                        currentList: [target.company.uid],
                        sureCall: ([i]) => target.company = { uid: i.uid, name: i.text },
                    });
                    break;
                }
            }
        },
        newCard(options = {}, insertIndex) {
            let defaultOption = {
                // 記錄類型
                reportType: 4,
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
                time: new Date(this.paperInfo.date),
                // 改善時間
                endTime: ((date) => {
                    let result = new Date(date);
                    result.setDate(result.getDate() + 3);
                    return result;
                })(this.paperInfo.date),
                // 會驗人員
                checkerName: this.paperInfo?.checkerName ?? [],
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
                allowRemove: true,
                allowDupicate: true,
            };
            let newCard = { ...defaultOption, ...options, keyIndex: this.keyIndex++ };

            if (insertIndex) {
                this.cardList.splice(insertIndex, 0, newCard);
            } else {
                this.cardList.push(newCard);
            }
        },
        deleteCard(keyIndex) {
            let index = this.cardList.findIndex(c => c.keyIndex == keyIndex);
            this.cardList.splice(index, 1);
        },
        dupicate(keyIndex) {
            let index = this.cardList.findIndex(c => c.keyIndex == keyIndex);
            if (index != -1) {
                let options = _.cloneDeep(this.cardList[index]);
                this.newCard(options, ++index);
            }
        },
        deleteImportCard() {
            // 移除改善中
            this.currentChangeTab = 2;
            this.middle = null;
            this.changeTabs[1].show = true;
            this.changeTabs[2].show = false;
        },
        output() {
            let content = _.cloneDeep(this.cardList.map(card => {
                return {
                    // 照片uid
                    picArr: card.pictureList.map(p => p.uid || p.src),
                    // 記錄類型
                    reportType: card.reportType,
                    // 地點
                    location: card.location,
                    // 底圖標定
                    mark: card.mark,
                    // 檢查項目
                    checkitem: card.checkitem,
                    // 缺失內容
                    context: card.context,
                    // 標籤
                    tagArr: card.tagList.filter(t => t.active).map(t => ({ uid: t.uid, name: t.name })),
                    // 工項別
                    workTypeText: card.workTypeText,
                    // 缺失原因
                    reason: card.reason,
                    // 危害類型
                    dangerType: card.dangerType,
                    // 查核時間
                    time: card.time.getTime(),
                    // 缺施工項
                    endTime: card.endTime.getTime(),
                    // 工程師
                    engineer: card.engineer,
                    // 廠商
                    company: card.company,
                    // 工種
                    work: card.work,
                    // 罰鍰
                    penalty: card.penalty,
                    // 罰金
                    fine: card.fine,
                }
            }));

            return {
                uid: this.paperID,
                content,
            }
        },
        outputForProject() {
            const processData = (card, i) => {
                let picture = [];
                card.picture.forEach((pict, j) => {
                    if (pict.file) {
                        sendFile[`sendFile[${i}][${j}]`] = pict.file;
                        picture.push('');
                    } else {
                        picture.push(pict.uid || pict.src);
                    }
                });

                let data = {
                    //照片
                    picture,
                    // 缺失內容，輸入
                    context: card.context,
                    //備註說明，輸入
                    note: card.note,
                    // 改善日期
                    endTime: card.endTime?.getTime() || 0,
                    // 責任工程師
                    engineer: card.engineer ? card.engineer.map(i => i.uid) : [],
                };

                // 協力廠商
                if (card.company) {
                    data.company = card.company.uid;
                }

                return data;
            };

            let sendFile = {};
            let sendData = {
                uid: this.paperID,
                record_id: this.recordIdArr[0],
                middle: this.middle ? processData(this.middle, 0) : [],
                after: processData(this.after, 1),
            };

            return {
                sendData,
                sendFile,
            }
        },
        async check() {
            let checkArr = this.$refs.card.map(card => card.checkUserInput());
            let ansArr = await Promise.all(checkArr);
            return !ansArr.includes(false);
        },
        checkForProject() {
            // 改善後必填寫
            //一張記錄報告內必填欄位是照片和改善說明必須擇一填寫
            const condition = (data) => data.picture?.length || data.context?.length;
            return condition(this.after);
        },
    },
}