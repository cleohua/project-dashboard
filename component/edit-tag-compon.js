import * as callAPI from "../callAPI.js";

import fullsizeDialog from "../../../vue/assets/fullsize-dialog-slot-compon.js";
import template from "../template/edit-tag-temp.js";

var customFullDialog = {
    mixins: [fullsizeDialog],
    methods: {
        returnBtnClick() {
            this.$emit('close');
        }
    }
}

export default {
    name: 'edit-tag-compon',
    template,
    components: {
        'full-size': customFullDialog,
    },
    data() {
        return {
            uid: null,
            titleText: '常用細項訊息設定',
            loading: true,
            elementID: 'edit-tag',
            nextBtnShow: true,
            nextBtnText: '完成',
            optionMenuShow: false,
            edit: true,
            name: '',
            tabs: ['缺失細項說明', '提醒細項說明', '優良細項說明'],
            currentTab: 0,
            showAddBtn: true,
            tagData: {
                'missing': [],
                'notice': [],
                'excellent': [],
            },
            newTagData: {
                name: '',
                danger: false,
            },
            dataChange: false,
        }
    },
    computed: {
        currentTag() {
            let target = this.currentTab == 2 ? 'excellent' : this.currentTab == 1 ? 'notice' : 'missing';
            return this.tagData[target];
        },
    },
    watch: {
        tagData: {
            handler() {
                if (this.edit && !this.dataChange) this.dataChange = true;
            },
            deep: true,
        }
    },
    methods: {
        pageClick() {
            this.showAddBtn = true;
            this.newTagData.name = '';
            this.newTagData.danger = false;
        },
        tabClick(index) {
            if (this.edit && this.currentTab != index) {
                let check = this.checkData(this.currentTab);
                if (check) {
                    this.currentTab = index;
                } else {
                    floatMsgRemind('請完成內容輸入');
                }
            } else {
                this.currentTab = index;
            }
        },
        tagClick(tag) {
            if (this.edit && !tag.edit) {
                tag.edit = true;
                this.showAddBtn = true;
                this.newTagData.name = '';
                this.newTagData.danger = false;
            }
        },
        // 更新/刪除
        rightBtnClick(tag, index) {
            if (tag.edit) {
                // 內容確認
                if (tag.name.length) {
                    tag.edit = false;
                    tag.danger = false;
                } else {
                    tag.danger = true;
                    floatMsgRemind('請輸入內容');
                }
            } else {
                // 刪除
                let target = this.currentTab == 2 ? 'excellent' : this.currentTab == 1 ? 'notice' : 'missing';
                this.tagData[target].splice(index, 1);

                this.showAddBtn = true;
                this.newTagData.name = '';
                this.newTagData.danger = false;
            }
        },
        // 建立標籤
        newTagClick() {
            this.showAddBtn = false;
        },
        // 新增標籤
        addTagClick() {
            if (this.newTagData.name.length) {
                let target = this.currentTab == 2 ? 'excellent' : this.currentTab == 1 ? 'notice' : 'missing';

                this.tagData[target].push({
                    name: this.newTagData.name,
                    edit: false,
                    danger: false,
                });

                this.showAddBtn = true;
                this.newTagData.name = '';
                this.newTagData.danger = false;
            } else {
                this.newTagData.danger = true;
                floatMsgRemind('請輸入內容');
            }

        },
        async checkData(tab = null) {
            const empty = (list) => {
                if (list.length) {
                    return !list.map(v => {
                        if (v.edit || v.name.length == 0) {
                            v.danger = true;
                            return false;
                        } else {
                            return true;
                        }
                    }).includes(false);
                } else {
                    return true;
                }
            }

            if (tab != null) {
                let target = tab == 2 ? 'excellent' : tab == 1 ? 'notice' : 'missing';
                // 當前新增
                if (!this.showAddBtn && !this.newTagData.name.length) {
                    this.newTagData.danger = true;
                    return false;
                }
                // 既有檢查
                return empty(this.tagData[target]);
            } else {
                return !Object.values(this.tagData)
                    .map(list => empty(list))
                    .includes(false);
            }
        },
        getData() {
            let sendData = {
                uid: this.uid,  
                tag: _.cloneDeep(this.tagData),
            };
            return sendData;
        },
        async refresh() {
            this.loading = true;
            let data = await callAPI.getTagList(this.uid);
            this.name = data.name;
            const { missing, notice, excellent} = data.template;
            this.tagData['missing'] = missing.map(v => ({ ...v, edit: false, danger: false }));
            this.tagData['notice'] = notice.map(v => ({ ...v, edit: false, danger: false }));
            this.tagData['excellent'] = excellent.map(v => ({ ...v, edit: false, danger: false }));

            await this.$nextTick();
            this.loading = false;
        },
    },
    created() {
        this.refresh();
    }
}