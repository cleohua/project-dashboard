import edit from "../view/index.js";
import * as callapi from "../callAPI.js";

import fullsizeDialog from "../../../vue/assets/fullsize-dialog-slot-compon.js";
import template from "../template/edit-checklist-sh-temp.js";
import shUnitCompon from "./sh-unit-compon.js";

export default {
    name: 'edit-checklist-sh-compon',
    template,
    components: {
        'full-size': fullsizeDialog,
        'unit-compon': shUnitCompon,
    },
    data() {
        return {
            elementID: 'edit-checklist-sh',
            titleText: '自檢表',
            nextBtnShow: true,
            nextBtnText: '編輯',
            closeCheck: true,
            closeCheckFun: () => true,
            loading: false,
            listName: 'OOAA自檢表',
            point: '86',
            scope_rate: ['', '', ''],
            progress_rate: ['', '', ''],
            data: [],
            showImportOption: true,
            keyIndex: 0,
            activeUnit: null,
            editMode: true,
            dataChange: false,
        };
    },
    computed: {
        limit() {
            return this.data.reduce((limit, unit, index) => {
                if (this.activeUnit != index) {
                    limit -= parseInt(unit.point);
                }
                return limit > 0 ? limit : 0;
            }, 100) + '';
        },
        // 安衛用
        ratioText() {
            return (ratio) => {
                return `${ratio[0]} / ${ratio[1]} / ${ratio[2]}`;
            };
        },
    },
    watch: {
        listName() {
            if (this.editMode && !this.dataChange) this.dataChange = true;
        },
        point() {
            if (this.editMode && !this.dataChange) this.dataChange = true;
        },
        scope_rate() {
            if (this.editMode && !this.dataChange) this.dataChange = true;
        },
        progress_rate() {
            if (this.editMode && !this.dataChange) this.dataChange = true;
        },
        data: {
            handler() {
                if (this.editMode && !this.dataChange) this.dataChange = true;
            },
            deep: true,
        }
    },
    methods: {
        async download() {
            let info = { type: 0, uid: this.uid };
            let rsData = await callapi.getCheckListForm(info);

            if (rsData) {
                downloadAndRename({ name: rsData.name, path: rsData.url });
            } else {
                floatMsgRemind('取得下載檔案失敗');
            }
        },
        importFile() {
            this.$refs.fileInput.click();
        },
        async fileUpload(e) {
            this.loading = true;
            let sendFile = {
                'file[0]': e.target.files[0],
            }
            let sendData = {
                type: 0,
                uid: this.uid
            };

            let rsData = await callapi.importChecklist(sendData, sendFile);
            if (rsData) {
                this.keyIndex = 0;
                this.data = this.formatData(rsData);
                await this.$nextTick();
            } else {
                floatMsgRemind("檔案匯入失敗");
            }

            this.$refs.fileInput.value = null;
            this.loading = false;
        },
        insertUnit() {
            this.showImportOption = false;

            let unitObj = {
                typeName: '輸入類別名稱',
                point: '0',
                list: [
                    {
                        name: '輸入新項目名稱',
                        point: '0',
                        keyIndex: 0,
                    }
                ],
                init: true,
                showList: false,
                keyIndex: this.keyIndex++,
            };
            this.data.push(unitObj);

            if (this.activeUnit != null) {
                this.$refs.unit[this.activeUnit].cancelClick();
            }
            this.activeUnit = this.data.length - 1;
        },
        onEdit(index) {
            if (this.activeUnit != null) {
                this.$refs.unit[this.activeUnit].cancelClick();
            }
            this.activeUnit = index;
        },
        onEditFinish() {
            this.showImportOption = true;
            this.activeUnit = null;
        },
        onTagClick(uid) {
            edit.editTag({ uid, sureCall: this.refresh });
        },
        removeUnit(index) {
            this.data.splice(index, 1);
            this.showImportOption = true;
            this.activeUnit = null;
        },
        editListInfo() {
            let info = _.cloneDeep({
                name: this.name,
                point: this.point,
                scope_rate: this.scope_rate,
                progress_rate: this.progress_rate,
            })
            edit.editChecklistName4sh({ info, sureCall: this.updateListInfo });
        },
        updateListInfo(info) {
            const { name, point, scope_rate, progress_rate } = info;
            this.listName = name;
            this.point = point;
            this.scope_rate = scope_rate;
            this.progress_rate = progress_rate;
        },
        passCheck() {
            return true;
        },
        getData() {
            let sendData = {
                name: this.listName,
                point: this.point,
                scope_rate: this.scope_rate,
                progress_rate: this.progress_rate,
                content: this.data,
            }
            if (this.uid) sendData['uid'] = this.uid;

            return _.cloneDeep(sendData);
        },
        formatData(data) {
            return data.map(item => {
                let index = 0;
                let list = item.list.map(l => {
                    return {
                        name: l.name,
                        point: l.point,
                        keyIndex: index++,
                        uid: l.uid,
                    };
                });
                let unitObj = {
                    typeName: item.typeName,
                    point: item.point,
                    list,
                    init: false,
                    showList: true,
                    keyIndex: this.keyIndex++,
                };
                return unitObj;
            });
        },
        async refresh() {
            this.loading = true;
            let { name, content, scope_rate, progress_rate, point } = await callapi.getListContent(this.uid);
            this.listName = name;
            this.scope_rate = scope_rate;
            this.progress_rate = progress_rate;
            this.point = point;
            this.keyIndex = 0;
            this.data = this.formatData(content);
            await this.$nextTick();
            this.loading = false;
        }
    },
    created() {
        if (this.uid) this.refresh();
    }
}