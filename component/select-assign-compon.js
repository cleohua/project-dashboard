import floatDialog from "../../../vue/assets/float-dialog-slot-compon.js";
import template from "../template/select-assign-temp.js";
import edit from "../view/index.js";

// 指派責任工程師及改善缺失人員
export default {
    name: 'assign-bottom-compon',
    template,
    components: {
        'float-dialog': floatDialog,
    },
    data() {
        return {
            // dialog
            elementID: 'select-assign-page',
            titleText: '指派設定',
            bottomShow: true,
            showCloseBtn: false,
            loading: true,
            // this  
            userList: [],
            checker: [],
            engineer: [],
        };
    },
    computed: {
        checkerNameText() {
            let selectChecker = this.checker.map(i => i.text);
            return selectChecker?.[0] || '請選缺失改善人員(限1位)';
        },
        engineerNameText() {
            let count = this.engineer.length;
            return count ? `已選${count}人` : '請選責任工程師(可複選)';
        },
    },
    methods: {
        // 責任工程師
        addEngineer() {
            edit.engineerSelect({
                dataList: _.cloneDeep(this.userList),
                currentList: _.cloneDeep(this.engineer.map(i => ({ uid: i.uid, text: i.name }))),
                muiltSelect: true,
                sureCall: (arr) => this.engineer = arr,
            });
        },
        // 缺失改善人員
        addChecker() {
            edit.engineerSelect({
                dataList: _.cloneDeep(this.userList),
                currentList: _.cloneDeep(this.checker.map(i => ({ uid: i.uid, text: i.name }))),
                muiltSelect: false,
                sureCall: (arr) => this.checker = arr,
            });
        },
        getData() {
            let data = _.cloneDeep({
                engineer: this.engineer,
                checker: this.checker,
            });
            return data;
        },
    },
}