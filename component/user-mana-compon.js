import * as callapi from "../callAPI.js";
import edit from "../view/index.js";

import fullsizeDialogSlotCompon from "../../../vue/assets/fullsize-dialog-slot-compon.js";
import userManaTemp from "../template/user-mana-temp.js";

export default {
    name: 'user-mana-comopn',
    template: userManaTemp,
    components: {
        'full-dialog': fullsizeDialogSlotCompon,
    },
    data() {
        return {
            elementID: 'user-mana',
            titleText: '內部人員管理',
            nextBtnShow: false,
            loading: true,
            groupList: [],
            tabShow: null,
            userList: [],
            permission: 0,
        }
    },
    computed: {
        editable() {
            return (level) => {
                return this.permission == -1 ? false : (this.permission < level);
            }
        },
        showNotificOption() {
            return this.permission != -1 && this.permission < 3;
        },
        showAddBtn() {
            return (oneGroup) => {
                if (this.permission == -1) return false;

                const { role, executor, level } = oneGroup;

                let limitList = role.map(i => i.limit);
                if (limitList.includes(-1)) {
                    return this.editable(level);
                } else {
                    let limit = limitList.reduce((sum, i) => sum + i, 0);
                    return this.editable(level) && (limit > executor.length);
                }
            }
        },
        jobTitleText() {
            return (id, group) => {
                const { level, role } = group;
                let target = role.find(r => r.id == id);
                if (target && level > 0) {
                    return target.text;
                } else {
                    return '';
                }
            }
        },
        deletable() {
            return (id, group) => {
                const { role, level } = group;

                if (!this.editable(level)) return false;

                let target = role.find(r => r.id == id);
                return target?.deletable;
            }
        }
    },
    methods: {
        async newUser(oneGroup) {
            const { role, executor } = oneGroup;
            let roleID;

            if (role.length == 1) {
                roleID = role[0].id;
            } else {
                let list = _.cloneDeep(role);
                executor.forEach(user => {
                    let target = list.find(i => user.role_id == i.id);
                    if (target && target.limit != -1) target.limit--;
                });
                roleID = await edit.selectJobType(list);
            }

            if (roleID) {
                edit.checkerSelect({
                    dataList: _.cloneDeep(this.userList),
                    sureCall: (uidArr) => {
                        this.updateUser({
                            role_id: roleID,
                            executor: uidArr[0],
                        });
                    },
                });
            }
        },
        async updateUser(info) {
            let rsStatus = await callapi.setUserJob(info);
            floatMsgRemind(`設定${rsStatus ? '成功' : '失敗'}`);
            this.refresh();
        },
        menuClick(uid) {
            this.tabShow = this.tabShow == uid ? null : uid;
        },
        userChange(user) {
            const { uid, user_id, role_id } = user;

            edit.checkerSelect({
                dataList: this.userList.filter(u => u.uid != user_id),
                sureCall: (uidArr) => {
                    this.updateUser({
                        role_id,
                        uid,
                        executor: uidArr[0],
                    });
                },
            });
        },
        async notifiClick(uid) {
            let rsStatus = await callapi.setNotific(uid);
            floatMsgRemind(`設定${rsStatus ? '成功' : '失敗'}`);
            this.refresh();
        },
        logClick(uid) {
            edit.viewJobHistroy(uid);
        },
        async deleteUser(uid) {
            let rsStatus = await callapi.deleteUserJob(uid);
            floatMsgRemind(`刪除${rsStatus ? '成功' : '失敗'}`);
            this.refresh();
        },
        async refresh() {
            this.loading = true;

            let rsData = await callapi.getProjectUserList();
            const { permission, data } = rsData;
            this.permission = permission;
            this.groupList = data;
            await this.$nextTick();

            this.loading = false;
        }
    },
    // created() {
    //     console.log(this);
    // }
}