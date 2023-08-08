import * as callapi from "./callAPI.js";

export default class accordingData {
    constructor(paperID, projectID) {
        this.paperID = paperID;
        this.projectID = projectID;
        this.bgList = [];
        this.pictList = [];
        this.SHList = [];
        this.checklistGroup = {
            quality: [],
            engineer: [],
        };
        this.companyWork = {};
        this.dangerType = [];
        this.penalty = [];
        this.reason = [];
        this.checkitemMsg = {};
        this.projectUserList = [];

        this.get = [
            this._getPicture(),
            this._checklist(),
            this._companyWork(paperID),
            this._dangerType(),
            this._reason(),
            this._projectUserData(projectID),
            this._penalty(paperID),
        ];
    }
    // 照片
    async _getPicture() {
        let rsData = await callapi.getPaperPicture(this.paperID);
        if (rsData) {
            const { picture, bg } = rsData;
            this.pictList = picture.map(f => ({ uid: f.id, src: f.thumbnail, type: f.type, url: f.url, isUsed: f.isUsed }));
            this.bgList = bg.map(f => ({ uid: f.id, src: f.thumbnail, name: f.name, url: f.url }));
        }
    };

    // 檢查項目與自檢表
    async _checklist() {
        let todo1 = callapi.getChecklist().then(checklistGroup => {
            if (checklistGroup) {
                const { quality, engineer } = checklistGroup;
                this.checklistGroup['quality'] = quality;
                this.checklistGroup['engineer'] = engineer;
            }
        });

        let todo2 = callapi.getSHScore(this.paperID).then(shData => {
            if (shData?.content) {
                shData.content.forEach((v, i) => {
                    v['show'] = true;
                    v.list.forEach(v => v['show'] = true);
                    v['keyIndex'] = i + 1;
                });
                this.SHList = shData.content;
            }
        });
        await Promise.all([todo1, todo2]);
    }

    // 廠商與工種
    async _companyWork() {
        this.companyWork = await callapi.getCompanyWork(this.paperID);
    }

    // 危害類型
    async _dangerType() {
        this.dangerType = await callapi.getDangerType();
    }

    // 缺失原因
    async _reason() {
        this.reason = await callapi.getReason();
    }

    // 專案人員
    async _projectUserData(projectID) {
        this.projectUserList = await callapi.getUser(projectID)
            .then(rsData => rsData.map(v => ({ text: v.name, uid: parseInt(v.uid) })));
    }

    // 罰則條款與金額
    async _penalty() {
        let rsData = await callapi.getPenalty(this.paperID);
        if (rsData) {
            rsData.forEach((v, i) => {
                v['show'] = true;
                v.list.forEach(v => v['show'] = true);
                v['keyIndex'] = i + 1;
            });
            this.penalty = rsData;
        }
    }

    async _toTreeData(arrData) {
        let treeData = [];
        let crumbs = [];
        let currentLevel = 0;
        let target = treeData;

        const calTarget = () => {
            if (crumbs.length) {
                let target = crumbs.reduce((target, index) => {
                    return target[index].child;
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
                // type > 0: 父層, 1: 子層
                type: 1,
                // 是否顯示
                show: true,
            }

            if (list.level) {
                switch (list.level - currentLevel) {
                    case 1:
                        crumbs.push(target.length > 0 ? target.length - 1 : 0);
                        target = calTarget();
                        target.push(list);
                        currentLevel++;
                        break;
                    case -1:
                        crumbs.splice(crumbs.length - 1, 1);
                        target = calTarget();
                        target.push(list);
                        currentLevel--;
                        break;
                    case 0:
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
                currentLevel = 0;
            }
        }
        // 型態修正
        for (let list of treeData) {
            await check(list);
        }
        return treeData;
    }

    // call
    async initialize() {
        await Promise.all(this.get);
    }

    getPicture(uidArr = [], exclude = false) {
        if (uidArr.length) {
            return _.cloneDeep(this.pictList.filter(f => {
                let include = uidArr.includes(f.uid);
                return exclude ? !include : include;
            }));
        } else {
            return _.cloneDeep(this.pictList);
        }
    };

    getBgPicture(uidArr = [], exclude = false) {
        if (uidArr.length) {
            return _.cloneDeep(this.bgList.filter(f => {
                let include = uidArr.includes(f.uid);
                return exclude ? !include : include;
            }));
        } else {
            return _.cloneDeep(this.bgList);
        }
    };
    // 指定報告類型
    getPicutreByType(type, excludeUsed = false) {
        const condition = (f) => {
            let include = f.type.includes(type);
            let exclude = excludeUsed ? f.isUsed : false;
            return include && !exclude;
        }

        return this.pictList.filter(condition)
            .map(f => ({ src: f.src, uid: f.uid }));
    }

    // 0: safetyHealth, 1: quality, 2: engineer
    getCheckListGroup(type) {
        if (type) {
            const target = type == 2 ? 'engineer' : 'quality';
            return this.checklistGroup[target].map(v => ({ text: v.name, uid: v.uid }));
        } else {
            let shList = this.SHList.map(v => ({ text: v.typeName, keyIndex: v.keyIndex }));
            return [{ text: '所有項目', keyIndex: 0 }, ...shList];
        }
    }

    // 0: safetyHealth, 1: quality, 2: engineer
    async getCheckListContent(type, uid) {
        if (type) {
            let list = this.checklistGroup[type == 2 ? 'engineer' : 'quality'];
            let target = list.find(l => l.uid == uid);
            if (target.list) {
                return _.cloneDeep(target.list);
            } else {
                let rsData = await callapi.getListContent(uid);
                if (rsData) {
                    let data = await this._toTreeData(rsData.list);
                    target.list = data;
                    return _.cloneDeep(data);
                } else {
                    return [];
                }
            }
        } else {
            return _.cloneDeep(this.SHList);
        }
    }

    // 常用訊息
    async getMsg(uidArr, type) {
        const target = type == 1 ? 'missing' : type == 2 ? 'notice' : 'excellent';

        const get = async (uid) => {
            if (this.checkitemMsg?.[uid]) {
                return _.cloneDeep(this.checkitemMsg[uid][target]);
            } else {
                let data = await callapi.getTagList(uid);
                if (data) {
                    const { template } = data;
                    const { missing, notice, excellent } = template;
                    missing.forEach(tag => tag['active'] = false);
                    notice.forEach(tag => tag['active'] = false);
                    excellent.forEach(tag => tag['active'] = false);

                    this.checkitemMsg[uid] = template;
                    return _.cloneDeep(template[target]);
                } else {
                    console.warn('failed to fetch tag data', uid);
                    return [];
                }
            }
        }
        const tagArr = await Promise.all(uidArr.map(uid => get(uid)));
        return tagArr.reduce((arr, value) => [...arr, ...value], []);
    };

    getCompanyWork() {
        return _.cloneDeep(this.companyWork);
    };

    getDangerType() {
        return _.cloneDeep(this.dangerType);
    };

    // 缺失原因
    // type > 0: 安衛, 1: 品質, 2: 技師
    async getReason(formType) {
        return _.cloneDeep(this.reason[formType]);
    }

    getProjectUser() {
        return _.cloneDeep(this.projectUserList);
    }

    getPenaltyList() {
        let penaltyList = this.penalty.map(v => ({ text: v.typeName, keyIndex: v.keyIndex }));
        return [{ text: '所有項目', keyIndex: 0 }, ...penaltyList];
    }

    getPenaltyContent() {
        return _.cloneDeep(this.penalty);
    };
}