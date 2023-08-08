import * as callapi from "../callAPI.js";
import edit from "../view/index.js";

import fullsizeDialog from "../../../vue/assets/fullsize-dialog-slot-compon.js";
import template from "../template/edit-checklist-temp.js";
import unitCompon from "./unit-compon.js";

export default {
    name: 'edit-checklist-compon',
    template,
    components: {
        'full-size': fullsizeDialog,
        'unit-compon': unitCompon,
    },
    data() {
        return {
            titleText: '項目管理',
            loading: false,
            elementID: 'edit-checklist',
            nextBtnShow: true,
            nextBtnText: '檢視',
            closeCheck: true,
            closeCheckFun: () => true,
            optionMenuShow: false,
            optionMenuTab: ['匯入新增', '下載範本'],
            keyIndex: 0,
            searchText: '',
            menuShow: null,
            editMode: false,
            uid: null,
            name: '',
            data: [],
            isPass: true,
            dataChange: false,
            onDrag: false,
        };
    },
    computed: {
        filtered() {
            return this.data.filter(l => l.show);
        }
    },
    watch: {
        name() {
            if (this.editMode && !this.dataChange) this.dataChange = true;
        },
        data: {
            handler() {
                if (this.editMode && !this.dataChange) this.dataChange = true;
            },
            deep: true,
        },
        searchText(newVal) {
            newVal = newVal.toLowerCase();

            const isShow = (l) => {
                let match = l.name.toLowerCase().includes(newVal);
                let childMatch = false;
                l.child.forEach(l => {
                    let match = isShow(l);
                    l.show = match;
                    if (match) childMatch = true;
                });
                return match || childMatch;
            };
            this.data.forEach(l => l.show = isShow(l));
        }
    },
    methods: {
        pageClick() {
            this.optionMenuShow = false;
            this.menuShow = null;
        },
        async optionMenuClick(index) {
            switch (index) {
                case 0:
                    // 匯入
                    this.$refs.fileInput.click();
                    break;
                case 1:
                    // 下載範本
                    let info = { type: 1, uid: this.uid };
                    let rsData = await callapi.getCheckListForm(info);
                    if (rsData) {
                        downloadAndRename({ name: rsData.name, path: rsData.url });
                    } else {
                        floatMsgRemind('取得下載檔案失敗');
                    }
                    break;
            }

            this.optionMenuShow = false;
        },
        async importFile(e) {
            this.loading = true;
            let file = {
                'file[0]': e.target.files[0],
            };

            let rsData = await callapi.importChecklist({ type: 1 }, file);
            if (rsData) {
                let newData = await this.toTreeData(rsData);
                this.data = [...this.data, ...newData];
                await this.$nextTick();
            } else {
                floatMsgRemind('匯入失敗');
            }

            this.$refs.fileInput.value = null;
            this.loading = false;
        },
        editName() {
            edit.editChecklistName({ vueData: this.$data });
        },
        menuClick(index) {
            this.optionMenuShow = false;
            this.menuShow = this.menuShow == index ? null : index;
        },
        newUnit() {
            this.data.push({
                name: '新項目名稱',
                type: 1,
                level: 0,
                keyIndex: ++this.keyIndex,
                show: true,
                danger: false,
                child: [],
            });
        },
        onNew(keyArr, isTans = false) {
            let target = this.data;

            keyArr.reverse().forEach((key, i) => {
                let arr = i ? target.child : target;
                let index = arr.findIndex(i => i.keyIndex == key);
                target = arr[index];
            });

            if (isTans) target.type = 0;
            target.child.push({
                name: '輸入項目名稱',
                type: 1,
                level: keyArr.length,
                keyIndex: ++this.keyIndex,
                show: true,
                danger: false,
                child: [],
            });
        },
        onTrans(keyArr) {
            this.onNew(keyArr, true);
        },
        onDelete(keyArr) {
            if (keyArr.length > 1) {
                let target = this.data;

                keyArr = keyArr.reverse();
                let keyIndex = keyArr.splice(keyArr.length - 1);
                keyArr.forEach((key, i) => {
                    let arr = i ? target.child : target;
                    let index = arr.findIndex(i => i.keyIndex == key);
                    target = arr[index];
                });
                // 移除
                let index = target.child.findIndex(i => i.keyIndex == keyIndex);
                target.child.splice(index, 1);
                // 檢查與轉換
                if (!target.child.length) target.type = 1;
            } else {
                let index = this.data.findIndex(i => i.keyIndex == keyArr[0]);
                this.data.splice(index, 1);
            }
        },
        onTagClick(uid) {
            edit.editTag({ uid, sureCall: this.refresh });
        },
        onDragStart() {
            this.menuShow = null;
        },
        dragStart() {
            this.onDrag = true;
        },
        dragEnd() {
            this.onDrag = false;
        },
        async passCheck() {
            const checkFun = async (list) => {
                for (let l of list) {
                    if (l.name.length == 0) {
                        l.danger = true;
                        isPass = false;
                    }
                    if (l.child.length) await checkFun(l.child);
                }
            };

            let isPass = true;
            if (this.data.length) {
                await checkFun(this.data);
                if (!isPass) {
                    floatMsgRemind('請補上空白項目欄位');
                }
            } else {
                isPass = false;
                floatMsgRemind('請至少建立一項項目');
            }
            return isPass;
        },
        async getData() {
            let sendObj = {
                type: this.type,
                name: this.name,
            };
            let originData = _.cloneDeep(this.data);
            let sendArr = [];

            const pushData = async (list) => {
                for (let l of list) {
                    let obj = { name: l.name, level: l.level };
                    if (l.uid) obj['uid'] = l.uid;
                    sendArr.push(obj);

                    if (l.child.length) await pushData(l.child);
                }
            };
            await pushData(originData);
            sendObj['content'] = sendArr;
            if (this.uid) sendObj['uid'] = this.uid;

            return sendObj;
        },
        async toTreeData(arrData, rootLevel = 0) {
            let treeData = [];
            let crumbs = [];
            let currentLevel = rootLevel;
            let target = treeData;

            const calTarget = () => {
                if (crumbs.length) {
                    let target = crumbs.reduce((target, val) => {
                        return target[val].child;
                    }, treeData);
                    return target;
                } else {
                    return treeData;
                }
            }

            const check = async (list) => {
                if (list.child.length) {
                    list.type = 0;
                    for (let childList of list.child) {
                        await check(childList);
                    }
                }
            }
            // to tree data
            for (let list of arrData) {
                list = {
                    ...list,
                    child: [],
                    type: 1,
                    keyIndex: this.keyIndex,
                    show: true,
                    danger: false,
                }
                this.keyIndex++;

                if (list.level != rootLevel) {
                    let count = list.level - currentLevel;
                    switch (count) {
                        case 1:
                            // 下一層
                            let num = target.length > 0 ? target.length - 1 : 0;
                            crumbs.push(num);
                            target = calTarget();
                            target.push(list);
                            currentLevel++;
                            break;
                        case -1:
                            // 上一層
                            crumbs.splice(-1, 1);
                            target = calTarget();
                            target.push(list);
                            currentLevel--;
                            break;
                        case 0:
                            // 同層
                            target.push(list);
                            break;
                        default:
                            if (count < 0 && rootLevel < list.level) {
                                // 上N層
                                crumbs.splice(count);
                                target = calTarget();
                                target.push(list);
                                currentLevel += count;
                                break;
                            } else {
                                console.warn('error', list);
                            }
                    }
                } else {
                    crumbs = [];
                    target = treeData;
                    target.push(list);
                    currentLevel = rootLevel;
                }
            }
            // 型態修正
            for (let list of treeData) {
                await check(list);
            }
            return treeData;
        },
        async refresh() {
            this.loading = true;
            let { name, list } = await callapi.getListContent(this.uid);
            this.name = name;
            this.data = await this.toTreeData(list);
            await this.$nextTick();
            this.loading = false;
        },
    },
    created() {
        if (this.uid) this.refresh();
    },
}