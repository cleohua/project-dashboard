import floatDialog from "../../../vue/assets/float-dialog-slot-compon.js";
import miniSelectCompon from "./mini-select-compon.js";
import template from "../template/edit-paper-info-temp.js";
import edit from "../view/index.js";

export default {
    name: 'edit-paper-info-compon',
    template,
    components: {
        'mini-select': miniSelectCompon,
        'float-dialog': floatDialog,
    },
    data() {
        return {
            loading: true,
            elementID: 'edit-paper-info',
            titleText: '工地基本資料',
            dialogType: 2,
            showCloseBtn: false,
            bottomShow: true,
            officeList: [],
            projectList: [],
            typeList: [
                { id: 0, text: '安衛' },
                { id: 1, text: '品質' },
                { id: 2, text: '技師' },
            ],
            checkerData: {},
            office: null,
            project: null,
            // 預設
            type: { id: 0, text: '安衛' },
            checker: [],
            miniSelectShow: null,
            danger: {
                project: false,
                checker: false,
            },
            date: new Date(),
            masks: {
                input: 'YYYY年MM月DD日',
            },
            userName: userLoginInfo.userName,
        };
    },
    computed: {
        name() {
            let t = this.type?.text || '';
            let p = this.project?.text || '';
            let d = moment(this.date).format('YYYYMMDD');
            return `${t}走動管理稽查報告_${p}_${d}`;
        },
        // 停用
        officeText() {
            return this.office?.text || '請選擇工處';
        },
        projectText() {
            return this.project?.text || '請選擇工地';
        },
        typeText() {
            return this.type?.text || '請選擇類型';
        },
        checkerText() {
            let count = this.checker.length;
            return count ? `已選${count}人` : '請選擇';
        },
    },
    watch: {
        project() {
            if (this.danger.project) this.danger.project = false;
        },
        checker() {
            if (this.danger.checker && this.checker.length) this.danger.checker = false;
        },
    },
    methods: {
        pageClick() {
            this.miniSelectShow = null;
        },
        showSelect(type) {
            this.miniSelectShow = type == this.miniSelectShow ? null : type;
        },
        // 工處，停用
        officeSelect(item) {
            this.miniSelectShow = null;
        },
        // 工地
        projectSelect(item) {
            this.miniSelectShow = null;
            if (this.project != null && (this.project.id != item.id) && this.checker.length) {
                this.checker = [];
                floatMsgRemind('請重新選擇會驗人員');
            }
            this.project = item;
        },
        // 業務類型
        typeSelect(item) {
            this.miniSelectShow = null;
            this.type = item;
        },
        // 選擇會驗人
        addChecker() {
            if (this.project) {
                let userList = [];
                let id = this.project?.id ?? null;
                if (id != null && this.checkerData[id]) {
                    userList = this.checkerData[id];
                }

                edit.checkerSelect({
                    dataList: _.cloneDeep(userList),
                    currentList: _.cloneDeep(this.checker),
                    muiltSelect: true,
                    sureCall: (uidArr) => this.checker = uidArr,
                });
            } else {
                floatMsgRemind('請先選擇工地');
            }
        },
        setData([checkerData, projectData, infoData]) {
            this.checkerData = checkerData;
            this.projectList = projectData;

            if (infoData) {
                const { user, checker, typeId, projectId, paperID, date } = infoData;
                this.userName = user;
                this.checker = checker;
                this.date = new Date(date);

                let type = this.typeList.find(i => i.id == typeId);
                let project = projectData.find(i => i.id == projectId);
                if (type) this.type = type;
                if (project) this.project = project;
                if (paperID) this.paperID = paperID;
            }
        },
        getData() {
            let data = _.cloneDeep({
                project: this.project?.id,
                checker: this.checker,
                type: this.type.id,
            });
            data['date'] = moment(this.date).format('YYYYMMDD');
            return data;
        },
        check() {
            let pass = true;
            if (!this.project) {
                this.danger.project = true;
                pass = false;
            }

            // if (!this.checker.length) {
            //     console.log(this.checker.length);
            //     this.danger.checker = true;
            //     pass = false;
            // }
            if (!pass) floatMsgRemind('請填寫必要項目');
            return pass;
        },
    },
}