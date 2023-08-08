import editRecordCardTemp from "../template/edit-record-card-temp.js";

export default {
    name: 'edit-racord-card-compon',
    template: editRecordCardTemp,
    props: {
        editable: {
            type: Boolean,
            default: false,
        },
        keyIndex: {
            type: Number,
            default: 0,
        },
        data: {
            type: Object,
            default: () => ({
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
                // 
                allowRemove: true,
                allowDupicate: true,
            })
        },
    },
    data() {
        return {
            reportTypeList: [
                {
                    name: '現況',
                    index: 4,
                },
                {
                    name: '優良',
                    index: 3,
                },
                {
                    name: '提醒',
                    index: 2,
                },
                {
                    name: '缺失',
                    index: 1,
                },
            ],
            currentPict: 0,
            pictMenuShow: false,
            danger: {
                picture: false,
                checkitem: false,
                context: false,
                reason: false,
                dangerType: false,
                fine: false,
            },
            masks: {
                input: 'YYYY/MM/DD',
            },
            checkItemTextSuffix: true,
            fineInputHolderText: '',
        }
    },
    watch: {
        'data.reportType': function (newVal) {
            if (newVal < 4) {
                this.$emit('select', { type: 'tagList', keyIndex: this.keyIndex });
            }
        },
        'data.picture': function (newVal) {
            if (this.danger.picuture && newVal.length) {
                this.danger.picture = false;
            }
        },
        'data.checkitem': function (newVal) {
            if (this.danger.checkitem && newVal != null) {
                this.danger.checkitem = false;
            }
        },
        'data.context': function (newVal) {
            if (this.danger.context && newVal.length) {
                this.danger.context = false;
            }
        },
        watchTagActive(newVal) {
            if (this.danger.context && newVal.length) {
                this.danger.context = false;
            }
        },
        'data.reason': function (newVal) {
            if (this.reason && newVal.length) {
                this.danger.reason = false;
            }
        },
        'data.dangerType': function (newVal) {
            if (this.dangerType && newVal.length) {
                this.danger.dangerType = false;
            }
        },
        'data.fine': function (newVal) {
            if (this.danger.fine && newVal.length) {
                this.danger.fine = false;
            }
        },
        'data.penalty': function (newVal) {
            let fine = newVal?.currentSelect?.fine;
            if (fine) {
                this.fineInputHolderText = moneyFormat(fine);
            }
        }
    },
    computed: {
        imgSrc() {
            let img = './include/images/safety-inspect/image-icon.svg';
            const pict = this.data.pictureList?.[this.currentPict];
            if (pict) {
                const { src = '' } = pict;
                const isBlob = src.slice(0, 5) === 'blob:';
                const isDataUrl = src.slice(0, 10) === 'data:image';
                if (isBlob || isDataUrl) {
                    img = src;
                } else {
                    img = `${imgUrl}${src}`;

                }
            }
            return img;
        },
        countText() {
            return `${this.currentPict + 1} / ${this.data.pictureList.length}`;
        },
        locateTitle() {
            return this.data.reportType < 4 ? '查核位置' : '位置記錄';
        },
        hasMark() {
            let hasMark = false;
            if (this.data.mark && Object.keys(this.data.mark).length) {
                for (let value of Object.values(this.data.mark)) {
                    if (value) hasMark = true;
                }
            }
            return hasMark;
        },
        locateClass() {
            return {
                'active': this.hasMark,
                'mouse-pointer': this.editable || (!this.editable && this.hasMark),
            }
        },
        checkItemText() {
            let text = this.data.checkitem?.currentName;
            if (text && this.checkItemTextSuffix) {
                // 缺失
                if (this.data.reportType == 1) {
                    text += '不符';
                }
                // 優良
                if (this.data.reportType == 3) {
                    text += '符合';
                }
                return text;
            } else {
                return '請選擇檢查項目';
            }
        },
        contextTitle() {
            switch (this.data.reportType) {
                case 4:
                    return '備註說明';
                case 3:
                    return '優良原因';
                case 2:
                    return '提醒原因';
                case 1:
                    return '缺失內容';
            }
        },
        currentTagList() {
            if (this.editable) {
                return this.data.tagList;
            } else {
                return this.data.tagList.filter(t => t.active);
            }
        },
        reasonText() {
            if (this.data.reason.length) {
                let text = this.data.reason.map(item => {
                    return item.uid == 0 ? `其他(${item.text})` : item.text;
                }).join('、');
                return text;
            } else if (this.editable) {
                return '選擇缺失原因';
            } else {
                return '無';
            }
        },
        dangerTypeText() {
            if (this.data.dangerType.length) {
                let text = this.data.dangerType.map(item => {
                    return item.uid == 0 ? `其他(${item.text})` : item.text;
                }).join('、');
                return text;
            } else if (this.editable) {
                return '選擇危害類型';
            } else {
                return '無';
            }
        },
        showDangerTable() {
            return this.data.reportType == 1 && this.data.checkitem?.currentForm == 0;
        },
        checkerText() {
            let text = '';
            if (this.data.checkerName) {
                text = this.data.checkerName.join('、');
            }
            return text.length ? text : '無指定';
        },
        checkerHoverText() {
            return this.data.checkerName.join('、');
        },
        engineerText() {
            if (this.data.engineer?.length) {
                return `已選擇${this.data.engineer.length}人`;
            } else if (this.editable) {
                return '請選擇人員';
            } else {
                return '無指定';
            }
        },
        engineerHoverText() {
            return this.data.engineer.map(u => u.text).join('、');
        },
        companyText() {
            if (this.data.company?.name) {
                return this.data.company.name;
            } else {
                return this.editable ? '請選擇廠商' : '無';
            }
        },
        workText() {
            if (this.data.work?.name) {
                return this.data.work.name;
            } else {
                return this.editable ? '請選擇工項' : '無';
            }
        },
        penaltyText() {
            if (this.data.penalty?.currentSelect?.name) {
                return this.data.penalty.currentSelect.name;
            } else {
                return this.editable ? '請選擇罰鍰條款' : '無';
            }
        },
        watchTagActive() {
            return this.data.tagList.filter(t => t.active);
        }
    },
    methods: {
        onlyNumber($event) {
            this.data.fine = this.moneyFormat($event.target.value);
        },
        moneyFormat(str) {
            str = str.replace(/\D/g, '');
            if (str) {
                let num = parseInt(str);
                const regex = /\B(?=(?:\d{3})+(?!\d))/g;
                return (`${num}`).replace(regex, ',');
            } else {
                return '';
            }
        },
        prevPictClick() {
            if (this.currentPict > 0) {
                this.currentPict--;
            }
        },
        nextPictClick() {
            if (this.currentPict < (this.data.pictureList.length - 1)) {
                this.currentPict++;
            }
        },
        toPict(index) {
            let length = this.data.pictureList.length;
            if (index >= 0 && index < length) {
                this.currentPict = index;
            }
        },
        pictMenuClick() {
            let width = window.innerWidth;
            if (width < 500) {
                // TODO: RWD
            } else {
                this.pictMenuShow = !this.pictMenuShow;
            }
        },
        addPictClick() {
            this.$emit('select', {
                type: 'pictureAdd',
                keyIndex: this.keyIndex,
            });
        },
        reportTypeClick(index) {
            if (this.editable) this.data.reportType = index;
        },
        selectPictClick() {
            this.$emit('select', {
                type: 'pictureChange',
                keyIndex: this.keyIndex,
                args: [this.currentPict],
            });
        },
        editPictClick() {
            this.$emit('select', {
                type: 'pictureEdit',
                keyIndex: this.keyIndex,
                args: [this.currentPict],
            });
        },
        deletePictClick() {
            // 避免當移除最後一張照片時會觸發addPictClick
            this.pictMenuShow = false;
            let current = this.currentPict;
            if (this.data.pictureList.length == (current + 1)) {
                this.currentPict--;
            }

            this.data.pictureList.splice(current, 1);
        },
        tagClick(tag) {
            if (this.editable) tag.active = !tag.active;
        },
        selectClick(type) {
            let exception = ['location'];
            if (!this.editable && type == 'location' && !this.hasMark) {
                floatMsgRemind('無標記');
                return;
            }
            if (this.editable || exception.includes(type)) {
                this.$emit('select', {
                    type,
                    keyIndex: this.keyIndex,
                });
            }
        },
        remove() {
            this.$emit('delete-card', this.keyIndex);
        },
        dupicate() {
            this.$emit('dupicate', this.keyIndex);
        },
        async checkUserInput() {
            let {
                reportType, pictureList, checkitem,
                context, tagList, reason, dangerType,
                workTypeText, penalty, fine,
            } = this.data;
            let pass = true;
            if (reportType == 4 && !pictureList.length && !context.length && !workTypeText.length) {
                this.danger.picture = true;
                pass = false;
            }
            if (reportType < 4) {
                if (checkitem == null) {
                    this.danger.checkitem = true;
                    pass = false;

                }
                // 改非必填
                // if (!context.length && !tagList.filter(t => t.active).length) {
                //     this.danger.context = true;
                //     pass = false;
                // }
                if (reportType == 1 && !reason.length) {
                    this.danger.reason = true;
                    pass = false;
                }
                // 僅安衛
                if (reportType == 1 && checkitem?.currentForm == 0 && !dangerType.length) {
                    this.danger.dangerType = true;
                    pass = false;

                }
                if (penalty?.currentSelect?.name && !fine.length) {
                    this.danger.fine = true;
                    pass = false;

                }
            }
            return pass;
        }
    },
}