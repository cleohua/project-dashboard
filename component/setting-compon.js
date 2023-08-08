import * as callapi from "../callAPI.js";
import edit from "../view/index.js";

import fullsizeDialog from "../../../vue/assets/fullsize-dialog-slot-compon.js";
import template from "../template/setting-temp.js";

export default {
    name: 'checklist-list-compon',
    template,
    components: {
        'full-size': fullsizeDialog,
    },
    data() {
        return {
            titleText: '檢查項目管理',
            loading: true,
            elementID: 'checklist-list',
            nextBtnShow: false,
            active: 0,
            menuShow: null,
            data: [
                {
                    name: '安衛',
                    list: [],
                    menu: [
                        {
                            name: '刪除檢查表',
                            todo: this.deleteGroup,
                        }
                    ],
                    type: 'sh'
                },
                {
                    name: '品質',
                    list: [],
                    menu: [
                        {
                            name: '修改名稱',
                            todo: this.changeName,
                        },
                        {
                            name: '刪除群組',
                            todo: this.deleteGroup,
                        }
                    ],
                    type: 'quality',
                },
                {
                    name: '技師',
                    list: [],
                    menu: [
                        {
                            name: '修改名稱',
                            todo: this.changeNam,
                        },
                        {
                            name: '刪除群組',
                            todo: this.deleteGroup,
                        }
                    ],
                    type: 'engineer'
                },
            ],
            searchText: '',
        }
    },
    computed: {
        currentList() {
            return this.data[this.active].list;
        },
        filterList() {
            if (this.searchText) {
                return this.currentList.filter(list => {
                    let keys = this.supserviseText.toLowerCase().split(' ');
                    let text = list.name.toLowerCase();
                    let search = !keys.map(k => text.includes(k)).includes(false);
                    return search;
                });
            } else {
                return this.currentList;
            }
        },
        // 安衛用
        ratioText() {
            return (ratio) => {
                return `${ratio[0]} / ${ratio[1]} / ${ratio[2]}`;
            };
        },
        listTitleText() {
            return (name, index) => {
                if(this.data[this.active].type == 'sh' && index == 0) {
                    return `${name} (當前採用)`;
                } else {
                    return name;
                }
            }
        }
    },
    methods: {
        listClick(uid) {
            if (this.active) {
                // 檢查項目
                // 1: 品質, 2: 技師
                edit.editChecklist({
                    type: this.active,
                    uid,
                    sureCall: this.refresh,
                });
            } else {
                // // 安衛自檢表
                edit.editChecklist4sh({
                    uid,
                    sureCall: this.refresh
                });
            }
        },
        insertClick() {
            if (this.active) {
                // 檢查項目
                // 1: 品質, 2: 技師
                edit.editChecklistName({ type: this.active, sureCall: this.refresh, });
            } else {
                // // 安衛自檢表
                edit.editChecklistName4sh({
                    sureCall: this.refresh,
                });
            }
        },
        menuClick(uid) {
            this.menuShow = this.menuShow == uid ? null : uid;
        },
        menuHide() {
            this.menuShow = null;
        },
        changeName(uid, name) {
            this.menuShow = null;
            edit.editChecklistName({ type: this.active, name, uid, sureCall: this.refresh });
        },
        async deleteGroup(uid) {
            this.menuShow = null;
            let rsStatus = await callapi.deleteCheckList(uid);
            floatMsgRemind(`刪除${rsStatus ? '成功' : '失敗'}`);
            if(rsStatus) this.refresh();
        },
        typeClick(index) {
            this.active = index;
            this.refresh();
        },
        async refresh() {
            this.loading = true;
            let data = await callapi.getChecklist();
            this.data[0].list = data['safetyHealth'];
            this.data[1].list = data['quality'];
            this.data[2].list = data['engineer'];

            await this.$nextTick();
            let content = this.$refs.content;
            if (content) content.scrollTop = 0;
            this.loading = false;
        },
    },
    created() {
        this.refresh();
    }
}