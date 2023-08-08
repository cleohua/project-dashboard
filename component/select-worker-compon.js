import floatDialog from "../../../vue/assets/float-dialog-slot-compon.js";
import selectWorkerTemp from "../template/select-worker-temp.js";

// 廠商工種
export default {
    name: 'select-worker-compon',
    template: selectWorkerTemp,
    components: {
        'float-dialog': floatDialog,
    },
    data() {
        return {
            // dialog
            elementID: 'select-worker-page',
            titleText: '選擇廠商與工種',
            bottomShow: true,
            showCloseBtn: false,
            // this
            companyList: [],
            workList: [],
            company: null,
            work: null,
            companyText: '',
            workText: '',
            clickStep: [],
            // 
            sureCall: () => { },
            cancelCall: () => { },
        };
    },
    watch: {
        currentCompanyList() {
            if(this.company && !this.currentCompanyList.some(i => i.uid == this.company.uid)) {
                this.company = null;
            }
        },
        currentWorkList() {
            if (this.work && !this.currentWorkList.some(i => i.uid == this.work.uid)) {
                this.work = null;
            }
        },
    },
    computed: {
        currentCompanyList() {
            let list = this.companyList;
            if (this.work != null && this.clickStep[0] == 'work') {
                list = this.companyList.filter(v => this.work.company.includes(v.uid));
            }
            if(this.companyText.length) {
                let string = this.companyText.toLowerCase();
                return list.filter(i => i.name.toLowerCase().includes(string));
            } else {
                return list;
            }
        },
        currentWorkList() {
            let list = this.workList;
            if (this.company != null && this.clickStep[0] == 'company') {
                list = this.workList.filter(v => this.company.work.includes(v.uid));
            }
            if (this.workText.length) {
                let string = this.workText.toLowerCase();
                return list.filter(i => i.name.toLowerCase().includes(string));
            } else {
                return list;
            }
        }
    },
    methods: {
        async companyClick(select) {
            let index = this.clickStep.indexOf('company');
            if (this.company?.uid == select.uid) {
                this.company = null;
                if (index != -1) this.clickStep.splice(index, 1);
            } else {
                this.company = select;

                if (this.clickStep.length == 2 && this.clickStep[1] != 'company') {
                    this.clickStep = [];
                } 
                if (this.clickStep.length == 1 && this.clickStep[0] != 'company') {
                    this.clickStep.push('company');
                }
                if(!this.clickStep.length) {
                    this.clickStep.push('company');
                }
            }
        },
        async workClick(select) {
            let index = this.clickStep.indexOf('work');
            if (this.work?.uid == select.uid) {
                this.work = null;
                if (index != -1) this.clickStep.splice(index, 1);
            } else {
                this.work = select;

                if (this.clickStep.length == 2 && this.clickStep[1] != 'work') {
                    this.clickStep = [];
                }
                if(this.clickStep.length == 1 && this.clickStep[0] != 'work') {
                    this.clickStep.push('work');
                }
                if(!this.clickStep.length) {
                    this.clickStep.push('work');
                }
            }
        },
        getData() {
            let output = _.cloneDeep({
                company: this.company,
                work: this.work,
            });
            return output;
        },
        nextBtnClick() {
            if (!this.company && !this.work) {
                floatMsgRemind('請選擇廠商及工種');
            } else if (!this.company || !this.work) {
                floatMsgRemind(`請選擇${this.company ? '工種' : '廠商'}`)
            } else {
                this.sureCall?.(this.getData());
                this.$refs.dialog.onDialogClose();
            }
        },
    },
}