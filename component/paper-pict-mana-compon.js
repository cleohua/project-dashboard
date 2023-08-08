import * as callapi from "../callAPI.js";

import { pictManaTemp, fileTemp } from "../template/paper-pict-mana-temp.js";
import edit from "../view/index.js";

// 排隊上傳
class uploadQueue {
    constructor(uid) {
        this.totalQueue = [];
        this.index = -1;
        this.uid = uid;
    }

    async _send(fileObj, sendFile, type) {
        let res = await callapi.addPicture(fileObj, sendFile, type, this.uid);
        fileObj.status = res ? 1 : 2;
        if (res) {
            const { url, id, thumbnail } = res;
            fileObj.uid = id;
            fileObj.url = url;
            let oldSrc = fileObj.src;
            fileObj.src = thumbnail;
            URL.revokeObjectURL(oldSrc);
        }
    }

    async _run() {
        const { queue, type } = this.totalQueue[this.index + 1];
        for (const subQueue of queue) {
            const go = subQueue.map(f => this._send(f, { 'file[0]': f.file }, type));
            await Promise.all(go);
        }
        this.index++;
        this._next();
    }

    _next() {
        const length = this.totalQueue.length;
        if (length > this.index + 1) {
            this._run();
        }

        if (length == this.index + 1) {
            this.totalQueue = [];
            this.index = -1;
        }
    }

    async addTask(list, type) {
        let queue = [];
        for (let i = 0; i < list.length; i += 5) {
            queue.push(list.slice(i, i + 5));
        }
        this.totalQueue.push({ queue, type });
        const length = this.totalQueue.length;
        if (length == 1 || length == this.index + 2) {
            this._run();
        }
    }
}

var fileCompon = {
    name: 'one-file',
    template: fileTemp,
    props: {
        file: {
            type: Object,
            default: () => ({
                name: '',
                keyIndex: 0,
                // 0: not upload, 1: finish, 2: failed,
                status: 0,
                percent: 0,
                type: 0,
                src: '',
                uid: null,
                url: '',
                abortFun: () => { },
                propress: () => { }
            }),
        },
        options: {
            type: Object,
            default: () => ({
                withTitle: false,
                editTitle: false,
                withTick: false,
                withSelect: false,
                withDelete: false,
                deletable: false,
            }),
        },
        reduce: {
            type: Function,
            default: (item) => item,
        },
        selectList: {
            type: Array,
            default: () => [],
        }
    },
    data() {
        let R = 35;
        let circumference = R * 2 * Math.PI;
        return {
            R,
            circumference,
        }
    },
    computed: {
        imgSrc() {
            let img = './include/images/safety-inspect/image-icon.svg';
            if (this.file.src) {
                const isDataUrl = this.file.src.slice(0, 10) === 'data:image';
                const isBlob = this.file.src.slice(0, 5) === 'blob:';
                if (isDataUrl || isBlob) {
                    img = this.file.src;
                } else {
                    img = `${imgUrl}${this.file.src}`;
                }
            }
            return img;
        },
        progressStyle() {
            let num = (1 - this.file.percent / 100) * this.circumference;
            return `stroke-dashoffset: ${num}; stroke-dasharray:${this.circumference}`;
        },
        isSelected() {
            return this.selectList.includes(this.reduce(this.file));
        },
        selectNum() {
            return this.selectList.indexOf(this.reduce(this.file)) + 1;
        }
    },
    methods: {
        onClick() {
            if (this.options.withSelect) this.checkClick();
        },
        checkClick() {
            if (this.file.status == 1) this.$emit('select', this.reduce(this.file));
        },
        deleteClick() {
            this.$emit('delete', this.file.keyIndex);
        },
        reUpClick() {
            this.$emit('reupload', this.file.keyIndex);
        },
        titleChange() {
            this.$emit('titlechange', this.file);
        },
    }
}

export default {
    name: 'paper-mana-compon',
    template: pictManaTemp,
    components: {
        'one-file': fileCompon,
    },
    props: {
        uid: {
            type: Number,
            default: 0,
        },
        editable: {
            type: Boolean,
            default: true,
        }
    },
    data() {
        return {
            //一行幾格
            pictGridNumber: 3,
            pictureList: [],
            bgList: [],
            fileInput: null,
            pictKey: 0,
            currentType: 0,
            showTypeMenu: false,
            typeMenuNum: 0,
            pictOptions: {
                withTitle: false,
                editTitle: false,
                withTick: false,
                withSelect: true,
                withDelete: false,
                deletable: false,
            },
            bgOptions: {
                withTitle: true,
                editTitle: true,
                withTick: false,
                withSelect: false,
                withDelete: true,
                deletable: true,
            },
            onSelectReduce: item => item.uid,
            curSelectList: [],
            bottomVue: null,
            popVue: null,
            uploadQueue: null,
            // 上傳拖拉
            onDraging: false,
            dragLocation: {
                pict: false,
                bg: false,
            },
            // docment上拖拉事件
            docEvents: [
                {
                    event: 'dragstart',
                    func: this.docStart,
                },
                {
                    event: 'dragenter',
                    func: this.docEnter,
                },
                {
                    event: 'dragover',
                    func: this.docOver,
                },
                {
                    event: 'dragleave',
                    func: this.docLeave,
                },
                {
                    event: 'drop',
                    func: this.docDrop,
                },
            ],
        };
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
            return this.curSelectList.length;
        },
        pictCustomOptions() {
            return (pict) => {
                return {
                    ..._.cloneDeep(this.pictOptions),
                    withTick: pict.isUsed,
                }
            }
        },
        bgCutomOptions() {
            return (bg) => {
                return {
                    ..._.cloneDeep(this.bgOptions),
                    editTitle: this.editable,
                    withDelete: this.editable,
                    deletable: bg.deletable,
                }
            }
        },
        setTypeMenu() {
            let arr = [
                {
                    text: '缺失',
                    type: 1,
                },
                {
                    text: '提醒',
                    type: 2,
                },
                {
                    text: '優良',
                    type: 3,
                },
                {
                    text: '現況',
                    type: 4,
                },
            ];
            if (this.currentType) arr.splice(this.currentType - 1, 1);
            return arr;
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
        }
    },
    watch: {
        selectCount(newVal, oldVal) {
            if (this.editable) {
                if ((oldVal > 0 && newVal == 1) || (oldVal == 1 && newVal > 1)) {
                    this.bottomVue?.toggleBtnShow(1);
                }
                if (oldVal == 0 && newVal > 0) {
                    // show bottom
                    this.bottomVueSet();
                }
                if (newVal == 0) {
                    // hide bottom
                    this.bottomVueSet(false);
                    this.showTypeMenu = false;
                    this.typeMenuNum = 0;
                }
            }
        },
    },
    methods: {
        areaClick() {
            this.showTypeMenu = false;
            this.dragLocation.pict = false;
            this.dragLocation.bg = false;
            this.onDraging = false;
        },
        newRecord() {
            // 抓出來
            const pictList = this.pictureList.reduce((arr, f) => {
                const condition = arr.length < this.curSelectList.length
                    && this.curSelectList.includes(f.uid);
                if (condition) arr.push({ uid: f.uid, src: f.src });
                return arr;
            }, []);
            // 排序
            let selectPict = new Array(this.curSelectList.length);
            pictList.forEach(f => {
                let index = this.curSelectList.indexOf(f.uid);
                selectPict[index] = f;
            });
            // let pictList = selectPict.map(f => ({ uid: f.uid, src: f.src }));
            // repotType: 缺失 > 1, 提醒 > 2, 優良 > 3, 現況 > 4
            // 未分類預設帶現況
            const idArr = [4, 1, 2, 3, 4];
            this.$emit('childevent', 'newRecord', idArr[this.currentType], { selectPict });
            this.curSelectList = [];
        },
        typeChange(index) {
            if (this.currentType != index) {
                this.currentType = index;
                this.curSelectList = [];
            }
        },
        onSelect(uid) {
            let index = this.curSelectList.indexOf(uid);
            if (index != -1) {
                this.curSelectList.splice(index, 1);
            } else {
                this.curSelectList.push(uid);
            }
        },
        onSetTypeClick(index) {
            let diff = this.typeMenuNum != index;
            if (this.showTypeMenu && diff) {
                this.typeMenuNum = index;
                return;
            }
            if (this.showTypeMenu && !diff) {
                this.showTypeMenu = false;
                return;
            }
            if (!this.showTypeMenu) {
                this.showTypeMenu = true;
                this.typeMenuNum = index;
                return;
            }
        },
        async pictDelete() {
            let picArr = this.curSelectList;
            const rsStatus = await callapi.deletePitcture({
                uid: this.uid,
                picArr,
            });

            if (rsStatus) {
                floatMsgRemind('刪除成功');
                this.curSelectList = [];
                picArr.forEach(uid => {
                    let index = this.pictureList.findIndex(pict => pict.uid == uid);
                    if (index != -1) this.pictureList.splice(index, 1);
                });
            } else {
                floatMsgRemind('刪除失敗');
            }
        },
        editPictClick() {
            const finishCall = (refresh = true) => {
                if (refresh) this.refresh();
                this.init();
            }

            this.hide();
            edit.editPicture({
                uid: this.uid,
                pictID: this.curSelectList[0],
                finishCall,
            });
            this.curSelectList = [];
        },
        // for bg-picture
        async onDelete(keyIndex) {
            let target = this.bgList.find(f => f.keyIndex == keyIndex);
            let rsStatus = await callapi.deletePitcture({
                picArr: [target.uid],
                uid: this.uid,
            });

            if (rsStatus) {
                let index = this.bgList.findIndex(f => f.keyIndex == keyIndex);
                floatMsgRemind('刪除成功');
                if (index != -1) this.bgList.splice(index, 1);
            } else {
                floatMsgRemind('刪除失敗');
            }
        },
        async onTitleChange(file) {
            let info = {
                pic: file.uid,
                name: file.name,
                uid: this.uid
            };
            let rsStatus = await callapi.editPictName(info);
            if (rsStatus) floatMsgRemind('更名成功');
        },
        downloadPict() {
            callapi.downloadPicture(this.curSelectList);
        },
        // pictType: photo or bg
        onReupload(keyIndex, pictType) {
            let target = this.pictureList.find(f => f.keyIndex == keyIndex);

            if (target) {
                target.status = 0;
                target.percent = 0;
                let sendFile = { 'file[0]': target.file };
                callapi.addPicture(target, sendFile, pictType, this.uid).then(res => {
                    target.status = res ? 1 : 2;
                    if (res) {
                        const { url, id, thumbnail } = res;
                        target.uid = id;
                        target.url = url;
                        let oldSrc = target.src;
                        target.src = thumbnail;
                        URL.revokeObjectURL(oldSrc);
                    }
                });
            }
        },
        newBgClick() {
            this.$refs.bgInput.click();
        },
        uploadPict(files, type) {
            let target = type == 'bg' ? this.bgList : this.pictureList;
            let propress = type == 'bg' ? this.propress_bg : this.propress;

            let notIamgeFile = 0;
            let list = [];
            for (let f of files) {
                // 阻擋非照片檔案
                if (!f.type.includes('image')) {
                    notIamgeFile++;
                } else {
                    let fileObj = {
                        name: f.name,
                        keyIndex: ++this.pictKey,
                        status: 0,
                        percent: 0,
                        type: [],
                        src: '',
                        uid: null,
                        url: '',
                        file: f,
                        abortFun: () => { },
                        propress,
                    };
                    target.unshift(fileObj);
                    list.push(fileObj);
                }
            };

            // error
            const length = list.length;
            if (length > 0 && notIamgeFile > 0) {
                floatMsgRemind(`非圖片檔案無法上傳`);
            } else if (notIamgeFile == 1) {
                floatMsgRemind(`僅允許上傳圖片`);
            }
            if (!length) return;

            if (!this.uploadQueue) this.uploadQueue = new uploadQueue(this.uid);
            this.uploadQueue.addTask(list, type);

            switch (type) {
                case 'bg':
                    this.$refs.bgInput.value = null;
                    break;
                case 'pict':
                    this.$refs.fileInput.value = null;
                    this.currentType = 0;
                    break;
                case 'camera':
                    this.$refs.cameraInput.value = null;
                    this.currentType = 0;
                    break;
            }
        },
        callFileInput(type) {
            if (type) {
                this.$refs.cameraInput.click();
            } else {
                this.$refs.fileInput.click();
            }
        },
        propress(keyIndex, persent) {
            if (!persent % 2 || persent == 100) return;
            let target = this.pictureList.find(f => f.keyIndex == keyIndex);
            target.percent = persent;

            if (persent > 50 && target.src == '' && target.file) {
                target.src = URL.createObjectURL(target.file);
            }
        },
        propress_bg(keyIndex, persent) {
            if (!persent % 2 || persent == 100) return;
            let target = this.bgList.find(f => f.keyIndex == keyIndex);
            target.percent = persent;

            if (persent > 50 && target.src == '' && target.file) {
                target.src = URL.createObjectURL(target.file);
            }
        },
        async setPictType(type, copy = false) {
            const rsStatus = await callapi[copy ? 'addPictType' : 'setPictType']({
                picArr: this.curSelectList,
                type,
                uid: this.uid,
            });

            if (rsStatus) {
                this.pictureList.forEach(f => {
                    if (this.curSelectList.includes(f.uid)) {
                        if (copy) {
                            f.type.push(type);
                        } else {
                            f.type = [type];
                        }
                    }
                });
                this.curSelectList = [];
                floatMsgRemind(`${copy ? '新增分類' : '設定'}完成`);
            } else {
                floatMsgRemind('設定失敗');
            }
        },
        // 上下捲動
        onPageWheel(e) {
            const sureCall = (value = 100) => {
                const el = this.$el;
                const scrollTop = el.scrollTop;
                const offsetHeight = el.offsetHeight;
                const scrollHeight = el.scrollHeight;

                let newVal = scrollTop + value;
                if (newVal < 0) newVal = 0;
                if (newVal > scrollHeight) newVal = offsetHeight;

                el.scrollTo({
                    top: newVal,
                    // behavior: 'smooth',
                });
            }
            this.$emit('wheel', e, sureCall);
        },
        // 照片拖拉上傳功能
        draglocatIn(type) {
            // console.log('draglocatIn: ', type);
            const arr = ['bg', 'pict'];
            const target = type == 'pict' ? 1 : 0;
            const nonTarget = type == 'pict' ? 0 : 1;
            this.dragLocation[arr[target]] = true;
            this.dragLocation[arr[nonTarget]] = false;
        },
        draglocatOut(e, type) {
            // console.log('draglocatOut: ', type);
            this.dragLocation[type] = false;
        },
        draglocatOver(type) {
            // console.log('draglocatOver: ', type);
            const arr = ['bg', 'pict'];
            const target = type == 'pict' ? 1 : 0;
            const nonTarget = type == 'pict' ? 0 : 1;
            this.dragLocation[arr[target]] = true;
            this.dragLocation[arr[nonTarget]] = false;
        },
        dropInPict(e) {
            this.uploadPict(e.dataTransfer.files, 'pict');
        },
        // element drag disable
        docStart(e) {
            e.preventDefault();
        },
        // file within browser
        docEnter(e) {
            e.preventDefault();
            this.onDraging = true;
        },
        docOver(e) {
            e.preventDefault();
        },
        docLeave(e) {
            e.preventDefault();
            // out of browser
            if (e.pageX == 0 && e.pageY == 0) {
                this.onDraging = false;
            }
        },
        docDrop(e) {
            // console.log('docDrop', e);
            e.preventDefault();
            this.dragLocation.pict = false;
            this.dragLocation.bg = false;
            this.onDraging = false;
        },
        docEventSet() {
            this.docEvents.forEach(e => {
                document.addEventListener(e.event, e.func);
            });
        },
        docEventRemove() {
            this.docEvents.forEach(e => {
                document.removeEventListener(e.event, e.func);
            });
        },
        bottomVueSet(show = true) {
            if (show) {
                this.bottomVue = edit.nextStep([
                    {
                        text: '刪除',
                        fnCall: this.pictDelete,
                        option: {
                            class: 'delete-btn',
                        },
                    },
                    {
                        text: '照片編輯',
                        fnCall: this.editPictClick,
                        show: this.selectCount == 1,
                        option: {
                            class: 'edit-pict-btn',
                        },
                    },
                    {
                        text: '建立管理記錄',
                        fnCall: this.newRecord,
                        option: {
                            class: 'create-btn',
                        },
                    },
                ]);
                this.popVue.addClass('content', 'upup-y');
            } else {
                this.bottomVue?.modelClose();
                this.popVue.removeClass('content', 'upup-y');
                this.bottomVue = null;
            }
        },
        hide() {
            if (this.editable) {
                this.bottomVue?.modelClose();
                this.popVue?.modelClose();
                this.docEventRemove();
            }
        },
        init() {
            if (this.editable) {
                this.popVue = edit.bottomPopover([
                    {
                        class: 'camera-icon',
                        style: '',
                        fnCall: this.callFileInput.bind(this, 1),
                    },
                    {
                        class: 'upload-icon',
                        style: '',
                        fnCall: this.callFileInput.bind(this, 0),
                    }
                ]);

                if (this.selectCount > 0) {
                    this.bottomVueSet();
                }

                this.docEventSet();
            }
        },
        async refresh() {
            let rsData = await callapi.getPaperPicture(this.uid);
            if (rsData) {
                const { bg = [], picture = [] } = rsData;
                this.pictureList = [];
                this.bgList = [];
                this.pictKey = 0;

                picture.forEach(f => {
                    let fileObj = {
                        name: f.name ?? '',
                        keyIndex: ++this.pictKey,
                        status: 1,
                        type: f.type,
                        url: f.url ?? '',
                        src: f.thumbnail ?? '',
                        uid: f.id,
                        isUsed: f.isUsed,
                    };

                    this.pictureList.push(fileObj);
                });
                bg.forEach(f => {
                    let fileObj = {
                        name: f.name ?? '',
                        keyIndex: ++this.pictKey,
                        status: 1,
                        url: f.url ?? '',
                        src: f.thumbnail ?? '',
                        uid: f.id,
                        deletable: f.deletable,
                    };

                    this.bgList.push(fileObj);

                });
            }
            await this.$nextTick();
        },
    },
    created() {
        if (this.editable) {
            onLoadPageCallList.push({
                funCall: () => {
                    this.docEvents.forEach(e => {
                        document.removeEventListener(e.event, e.func);
                    });
                }, once: true
            });
        }
    },
    destroyed() {
        if (this.editable) this.docEventRemove();
    },
}