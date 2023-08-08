import fullsizeDialogSlotCompon from "../../../vue/assets/fullsize-dialog-slot-compon.js";
import template from "../template/select-picture-temp.js";

export default {
    name: 'select-picture-compon',
    template,
    components: {
        'full-dialog': fullsizeDialogSlotCompon,
    },
    data() {
        return {
            loading: false,
            elementID: 'select-picture-page',
            nextBtnText: '選取',
            titleText: '選擇照片',
            muiltSelect: false,
            //一行幾格
            pictGridNumber: 3,
            pictureList: [],
            currentSelect: [],
            currentType: 0,
            sureCall: () => { },
        }
    },
    computed: {
        typeArr() {
            let count = [0, 0, 0, 0, 0];
            this.pictureList.forEach(file => {
                if (file.type.length) {
                    file.type.forEach(t => count[t]++);
                } else {
                    count[0]++;
                }
            });

            return [
                `未分類(${count[0]})`,
                `缺失(${count[1]})`,
                `提醒(${count[2]})`,
                `優良(${count[3]})`,
                `現況(${count[4]})`,
            ];
        },
        currentPictList() {
            return this.pictureList.filter(f => {
                if (this.currentType) {
                    return f.type.includes(this.currentType);
                } else {
                    return f.type.length == 0;
                }
            });
        },
        selectCount() {
            return this.pictureList.filter(f => f.select).length;
        },
        checkShow() {
            return (uid) => {
                return this.currentSelect.includes(uid);
            };
        },
        gridStyle() {
            return {
                'divide-6': this.pictGridNumber == '1',
                'divide-5': this.pictGridNumber == '2',
                'divide-4': this.pictGridNumber == '3',
                'divide-3': this.pictGridNumber == '4',
                'divide-2': this.pictGridNumber == '5',
                'divide-1': this.pictGridNumber == '6',
            }
        },
        // count() {
        //     return this.currentSelect.length;
        // },
        // nextBtnText2() {
        //     return `已選 ${this.count}張`;
        // }
        imgSrc() {
            return (src = '') => {
                let img = './include/images/safety-inspect/image-icon.svg';
                if (src) {
                    if (src.slice(0, 10) === 'data:image') {
                        img = src;
                    } else {
                        img = `${imgUrl}${src}`;
                    }
                }
                return img;
            }
        }
    },
    methods: {
        typeChange(index) {
            if (this.currentType != index) {
                this.currentType = index;
                this.currentSelect = [];
            }
        },
        onClick(uid) {
            if (this.muiltSelect) {
                let index = this.currentSelect.indexOf(uid);
                if (index != -1) {
                    this.currentSelect.splice(index, 1);
                } else {
                    this.currentSelect.push(uid);
                }
            } else {
                this.currentSelect = this.currentSelect == uid ? [] : [uid];
            }
        },
        nextBtnClick() {
            if (this.currentSelect.length) {
                let output;
                if (this.muiltSelect) {
                    output = _.cloneDeep(this.pictureList.filter(f => this.currentSelect.includes(f.uid)));
                } else {
                    output = _.cloneDeep(this.pictureList.find(f => f.uid == this.currentSelect[0]));
                }
                this.sureCall(output);
                this.$refs.dialog.onDialogClose();
            } else {
                floatMsgRemind('請選擇照片');
            }
        },
    },
}