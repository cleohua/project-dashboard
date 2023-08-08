import edit from "../view/index.js";
import editImproveCardTemp from "../template/edit-improve-card-temp.js";

export default {
    name: 'edit-improve-card-compon',
    template: editImproveCardTemp,
    props: {
        editable: {
            type: Boolean,
            default: false,
        },
        improve: {
            type: Object,
            default: () => ({
                // 照片清單
                picture: [
                    {
                        uid: 0,
                        neme: '',
                        thumbnail: '',
                        src: '',
                    },
                ],
                // 缺失內容，輸入
                context: '',
                //備註說明，輸入
                note: '',
                // 改善日期
                endTime: new Date(),
                // 改善缺失人員
                checkerName: [],
                // 責任工程師
                engineer: [],
                // 協力廠商
                company: {
                    name: '',
                    uid: 0
                },
            })
        },
        miniDate: {
            type: String,
        },
        tabIndex: {
            type: Number,
        },
        allowRemove: {
            type: Boolean,
            default: true,
        }
    },
    data() {
        return {
            currentPict: 0,
            pictMenuShow: false,
            userList: [],
            companyList: [],
            currentList: [],
            masks: {
                input: 'YYYY/MM/DD',
            },
        }
    },
    watch: {
        tabIndex() {
            this.currentPict = 0;
        }
    },
    computed: {
        pictLength() {
            return this.improve.picture.length;
        },
        imgSrc() {
            let pict = this.improve.picture?.[this.currentPict];
            return pict ? pict.src : '';
        },
        countText() {
            return `${this.currentPict + 1} / ${this.pictLength}`;
        },
        checkerText() {
            let text = this.improve.checkerName[0];
            return text || '無指定';
        },
        engineerHoverText() {
            return this.improve.engineer.map(u => u.text).join('、');
        },
        engineerText() {
            const text = this.engineerHoverText;
            return text ? text : this.editable ? '請選擇責任工程師' : '無指定';
        },
        companyText() {
            let company = this.improve.company;
            return company?.name ?? (this.editable ? '請選擇協力廠商' : '無指定');
        },
        endTimeText() {
            if (this.improve?.endTime) {
                return moment(this.improve.endTime).format('YYYY/MM/DD');
            } else {
                return '';
            }
        },
    },
    methods: {
        prevPictClick() {
            if (this.currentPict > 0) {
                this.currentPict--;
            }
        },
        nextPictClick() {
            if (this.currentPict < (this.improve.picture.length - 1)) {
                this.currentPict++;
            }
        },
        toPict(index) {
            let length = this.improve.picture.length;
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
        uploadPict(event) {
            const files = event.target.files;
            let notIamge = false;
            let newFiles = [];
            for (let f of files) {
                if (f.type.includes('image')) {
                    let fileObj = {
                        uid: null,
                        name: f.name,
                        thumbnail: '',
                        src: URL.createObjectURL(f),
                        url: '',
                        file: f,
                    };
                    newFiles.push(fileObj);
                } else {
                    notIamge = true;
                }
            };
            if (newFiles) {
                this.improve.picture = [...this.improve.picture, ...newFiles];
                this.currentPict = this.improve.picture.length - 1;
            }
            if (notIamge) {
                floatMsgRemind(files.length ? '非圖片檔案無法上傳' : '僅允許上傳圖片');
            }

            this.$refs.fileInput.value = null;
        },
        changePict(event) {
            const file = event.target.files[0];
            if (file.type.includes('image')) {
                let fileObj = {
                    uid: null,
                    name: file.name,
                    thumbnail: '',
                    src: URL.createObjectURL(file),
                    url: '',
                    file,
                };
                this.$set(this.improve.picture, this.currentPict, fileObj);
            } else {
                floatMsgRemind(`非圖片檔案無法上傳`);
            }

            this.$refs.changePictInput.value = null;
        },
        addPictClick() {
            this.$refs.fileInput.click();
            this.$refs.fileInput.value = null;
        },
        selectPictClick() {
            this.$refs.changePictInput.click();
        },
        editPictClick() {
            let pic = this.improve.picture[this.currentPict];
            const sureCall = (fileObj) => {
                this.update(fileObj, this.currentPict);
            };

            edit.editPict4Record({
                src: pic.src,
                sureCall,
            });
        },
        deletePictClick() {
            // 避免當移除最後一張照片時會觸發addPictClick
            this.pictMenuShow = false;
            let current = this.currentPict;
            if (this.improve.picture.length == (current + 1)) {
                this.currentPict--;
            }
            this.improve.picture.splice(current, 1);
        },
        selectClick(type) {
            if (this.editable) {
                this.$emit('improve-select', type);
            }
        },
        remove() {
            this.$emit('delete-card');
        },
        async update(...args) {
            const [newFile, index] = args;
            this.$set(this.improve.picture, index, newFile);
        },
    },
    // created() {
    //     console.log('improve', this);
    // }
}
