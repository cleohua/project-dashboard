import fullsizeDialog from "../../../vue/assets/fullsize-dialog-slot-compon.js";
import { template, listTemp } from "../template/export-setting-temp.js";
import edit from "../view/index.js";

var customFullDialog = {
    mixins: [fullsizeDialog],
    methods: {
        returnBtnClick() {
            this.$emit('close');
        },
    }
}

var listCompon = {
    name: 'list-compon',
    template: listTemp,
    props: {
        data: {
            type: Object
        },
        withSubArea: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            filpDown: false,
        }
    },
    computed: {
        imgSrc() {
            return (src = '') => {
                let img = './include/images/safety-inspect/image-icon.svg';
                if (src && src.slice(0, 10) === 'data:image') {
                    img = src;
                } else if (src) {
                    img = `${imgUrl}${src}`;
                }
                return img;
            }
        }
    },
    methods: {
        listClick() {
            this.$emit('list-click', { paperID: this.data.uid, recordIdArr: [this.data.record_id] });
        }
    },
}

export default {
    name: 'export-setting-compon',
    template,
    components: {
        'full-size': customFullDialog,
        'list-compon': listCompon,
    },
    data() {
        return {
            elementID: 'export-setting',
            titleText: '匯出走動管理督導記錄表',
            nextBtnText: '更多',
            subMenu: true,
            subMenuArr: [
                {
                    text: '暫存',
                    eventText: 'send',
                    args: 0,
                },
                {
                    text: '儲存建立',
                    eventText: 'send',
                    args: 1,
                },
                {
                    text: '儲存下載',
                    eventText: 'send',
                    args: 2,
                },
            ],
            loading: true,
            tabs: ['工地概況', '督導記錄'],
            currentIndex: 0,
            exportData: {},
            recordData: {},
            summaryListA: [
                {
                    name: '套表名稱',
                    text: ['report', 'name'],
                    editable: false,
                },
                {
                    name: '工程名稱',
                    text: ['project', 'name'],
                    editable: false,
                },
                {
                    name: '工處別',
                    text: ['project', 'office'],
                    editable: false,
                },
                {
                    name: '業主單位',
                    text: ['project', 'owner'],
                    editable: false,
                },
                {
                    name: '工地負責人',
                    text: ['project', 'principal'],
                    editable: false,
                },
                {
                    name: '監造單位',
                    text: ['project', 'supervision'],
                    editable: false,
                },
            ],
            summaryListB: [
                {
                    name: '督導單位',
                    text: ['report', 'unit'],
                    editable: false,
                },
                {
                    name: '督導日期',
                    text: ['report', 'date'],
                    editable: false,
                },
                {
                    name: '督導人員',
                    text: ['report', 'user'],
                    editable: false,
                },
                {
                    name: '開工日期',
                    text: ['project', 'start_date'],
                    editable: false,
                },
                {
                    name: '預計完工日',
                    text: ['project', 'finish_date'],
                    editable: false,
                },
            ],
            overview: '',
            description: '',
            danger: {
                overview: false,
                description: false,
            },
            uid_now: [],
            uid_bad: [],
            uid_remind: [],
            dragging: null,
            historyList: [],
            getData: () => { },
        }
    },
    watch: {
        overview(newVal) {
            if (this.danger.overview && newVal.length) {
                this.danger.overview = false;
            }
        }
    },
    computed: {
        textString() {
            return (ref) => {
                let text = ref.reduce((obj, key) => {
                    return obj?.[key] || '';
                }, this.exportData);
                return text;
            }
        },
        historyText() {
            if (this.historyList.length) {
                const { time, type } = this.historyList[0];
                let timeText = moment(time).format('YYYY/MM/DD HH:mm');
                return `最後編輯： ${timeText} (${type ? '儲存' : '暫存'})`;
            } else {
                return '尚未儲存報告紀錄';
            }
        }
    },
    methods: {
        listClick(arg) {
            edit.viewRecordFloat(arg);
        },
        // check() {
        //     if (this.exportData.record.length == 0) {
        //         floatMsgRemind('無可匯出記錄');
        //         return false;
        //     }

        //     if (!this.overview) {
        //         floatMsgRemind('請填寫施工概況');
        //         this.danger.overview = true;
        //         return false;
        //     } else {
        //         return true;
        //     }
        // },
        output() {
            let output = {
                uid: this.uid,
                name: this.exportData.report.name,
                overview: this.overview,
                description: this.description,
                uidArr: _.cloneDeep([this.uid_now, this.uid_bad, this.uid_remind]),
            }
            return output;
        },
        async refresh() {
            this.loading = true;

            let rsData = await this.getData(this.uid);
            if (rsData) {
                this.exportData = rsData;
                this.historyList = rsData.history;
                this.overview = rsData.overview;
                this.description = rsData.description;

                let bad = [];
                let remind = [];
                let now = [];
                let recordObj = {};

                const pushData = async (data, index) => {
                    for (let record of data) {
                        const { record_id } = record;
                        recordObj[record_id] = record;
                        switch (index) {
                            case '1':
                                bad.push(record_id);
                                break;
                            case '2':
                                remind.push(record_id);
                                break;
                            default:
                                now.push(record_id);
                                break;
                        }
                    }
                }

                for (let index in rsData.record) {
                    await pushData(rsData.record[index], index);
                }

                this.uid_bad = bad;
                this.uid_remind = remind;
                this.uid_now = now;
                this.recordData = recordObj;
            }

            await this.$nextTick();
            this.loading = false;
        },
        nextBtnClick() { },
    },
};