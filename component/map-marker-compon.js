import floatDialog from "../../../vue/assets/float-dialog-slot-compon.js";
import miniSelectCompon from "./mini-select-compon.js";
import template from "../template/map-marker-temp.js";

export default {
    name: 'map-marker-compon',
    template,
    components: {
        'float-dialog': floatDialog,
        'mini-select': miniSelectCompon,
    },
    data() {
        return {
            // dialog
            elementID: 'map-marker-page',
            titleText: '底圖標定',
            type: 3,
            bottomFinishShow: false,
            bottomCancelText: '關閉全螢幕',
            bottomShow: false,
            showCloseBtn: false,
            // content
            loading: true,
            editable: true,
            miniSelectShow: false,
            mapList: [],
            markerLog: {},
            current: 0,
            fabricObj: null,
            markerColor: '#ff2727',
            offsetX: 0,
            offsetY: 0,
            lastPosX: 0,
            lastPosY: 0,
            mapMark: 'M23.731,69.108C3.715,40.092,0,37.113,0,26.449a26.449,26.449,0,1,1,52.9,0c0,10.664-3.715,13.642-23.731,42.659a3.308,3.308,0,0,1-5.436,0Z',
            zoomScroll: [0.5, 0.8, 1, 1.2, 1.5],
            currentZoom: 2,
            isDragging: false,
            onMarkerSelect: false,
            onMarkEdit: false,
            markIcon: '<div><i class="fa fa-map-marker" aria-hidden="true"></i></div>',
            onEditBackup: {
                currentZoom: 2,
                vpt: [],
                json: '',
            },
            mapList4miniSelect: [],
        }
    },
    computed: {
        currentMapText() {
            return this.mapList?.[this.current]?.name || '無底圖可供標記';
        },
        currentUrl() {
            let image = this.mapList?.[this.current];
            if (image?.url) {
                return `${imgUrl}${image.url}`;
            } else if (image?.src) {
                return image.src;
            } else {
                return '';
            }
        },
        showPinButtom() {
            return this.editable && !this.onMarkerSelect;
        },
        showEditButtom() {
            return this.editable && this.onMarkerSelect && !this.onMarkEdit;
        },
        showHeaderText() {
            return this.editable && (!this.onMarkerSelect || this.onMarkEdit);
        },
        headerText() {
            return this.onMarkEdit ? '拖動底圖決定新位置' : '拖動底圖決定標記位置';
        }
    },
    methods: {
        fabricObjAddEvent() {
            this.fabricObj.on({
                'mouse:wheel': async (opt) => {
                    let direct = opt.e.deltaY > 0 ? -1 : 1;
                    let newValue = this.currentZoom + direct;
                    if (newValue > -1 && newValue < 5) {
                        this.currentZoom = newValue;
                    }

                    const zoom = this.zoomScroll[this.currentZoom];
                    this.fabricObj.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
                    // 邊界檢查
                    await this.checkBorder();
                    // 中間標定點
                    if (this.editable) this.updatePinPosition();
                    this.fabricObj.renderAll();

                    opt.e.preventDefault();
                    opt.e.stopPropagation();
                },
                'mouse:down': (opt) => {
                    const e = opt.e;
                    if (opt.target == null) {
                        let et = e.type.includes('mouse');
                        this.lastPosX = et ? e.clientX : e.touches[0].clientX;
                        this.lastPosY = et ? e.clientY : e.touches[0].clientY;
                        this.isDragging = true;
                    }
                },
                'mouse:up': () => {
                    if (this.isDragging) {
                        this.isDragging = false;
                        // 中間標定點
                        if (this.editable) {
                            this.fabricObj.renderAll();
                        }
                    }
                },
                'mouse:move': (opt) => {
                    if (this.isDragging) {
                        const e = opt.e;
                        let vpt = this.fabricObj.viewportTransform;
                        let et = e.type.includes('mouse');
                        let clientX = et ? e.clientX : e.touches[0].clientX;
                        let clientY = et ? e.clientY : e.touches[0].clientY;
                        let moveX = clientX - this.lastPosX;
                        let moveY = clientY - this.lastPosY;
                        this.lastPosX = clientX;
                        this.lastPosY = clientY;
                        opt.e.preventDefault();
                        opt.e.stopPropagation();

                        let { left, top } = this.fabricObj.getCenter();
                        const [TL, TR, BR, BL] = this.fabricObj.getObjects()[0].getCoords();
                        left -= (moveX - 2);
                        top -= (moveY - 2);

                        if (left < TL.x || left > TR.x || top < TL.y || top > BL.y) return;

                        vpt[4] += moveX;
                        vpt[5] += moveY;
                        // 中間標定點
                        if (this.editable) this.updatePinPosition();
                        this.fabricObj.setViewportTransform(this.fabricObj.viewportTransform);
                        this.fabricObj.renderAll();
                    }
                },
                'selection:created': (opt) => {
                    this.onMarkerSelect = true;
                    this.pointerHide();

                    this.fabricObj.forEachObject(e => {
                        if (e.id == 'marker') {
                            e.set({
                                opacity: e === opt.target ? 1 : 0.5,
                            });
                        }
                    });

                    let vpt = this.fabricObj.viewportTransform;
                    let zoom = vpt[0];
                    let vpw = this.fabricObj.width;
                    let vph = this.fabricObj.height;
                    let x = (opt.target.left * zoom - vpw / 2);
                    let y = (opt.target.top * zoom - vph / 2);
                    vpt[4] = -x - (opt.target.width * zoom) / 2;
                    vpt[5] = -y - (opt.target.height * zoom);

                    this.fabricObj.setViewportTransform(this.fabricObj.viewportTransform);
                    this.fabricObj.renderAll();
                },
                'selection:updated': (opt) => {
                    this.fabricObj.forEachObject(e => {
                        if (e.id == 'marker') {
                            e.set({
                                opacity: e === opt.target ? 1 : 0.5,
                            });
                        }
                    });

                    let vpt = this.fabricObj.viewportTransform;
                    let zoom = vpt[0];
                    let vpw = this.fabricObj.width;
                    let vph = this.fabricObj.height;
                    let x = (opt.target.left * zoom - vpw / 2);
                    let y = (opt.target.top * zoom - vph / 2);
                    vpt[4] = -x - (opt.target.width * zoom) / 2;
                    vpt[5] = -y - (opt.target.height * zoom);

                    this.fabricObj.setViewportTransform(this.fabricObj.viewportTransform);
                    this.fabricObj.renderAll();
                },
                'selection:cleared': () => {
                    if (!this.onMarkEdit) {
                        this.onMarkerSelect = false;
                        this.fabricObj.forEachObject(e => {
                            if (e.id == 'marker') {
                                e.set({
                                    opacity: 1,
                                });
                            }
                        });
                    }

                    this.updatePinPosition();
                    this.pointerHide(true);
                    this.fabricObj.renderAll();

                },
            });
        },
        async mapSelect(uid) {
            this.loading = true;
            await this.clearAndSet(uid);
            this.loading = false;
        },
        clearAndSet(uid) {
            this.onMarkerSelect = false;
            this.onMarkEdit = false;
            this.miniSelectShow = false;
            this.current = this.mapList.findIndex(p => p.uid == uid);
            // 歸零
            this.currentZoom = 2;
            this.fabricObj.viewportTransform = [1, 0, 0, 1, 0, 0];
            this.fabricObj.clear();

            // 標記還原
            if (this.markerLog[uid]?.length) {
                let jsonStr = `{"objects":${this.markerLog[uid]}}`;

                return new Promise((resolve) => {
                    this.fabricObj.loadFromJSON(jsonStr, async () => {
                        await this.loadMap(this.currentUrl);
                        resolve(true);
                    });
                });
            } else {
                return this.loadMap(this.currentUrl);
            }
        },
        loadMap(url) {
            return new Promise((resolve) => {
                fabric.Image.fromURL(url, (img) => {
                    let pictH = img.getScaledHeight();
                    let pictW = img.getScaledWidth();
                    let canvasWidth = this.$refs.canvasArea.offsetWidth;
                    let canvasHeight = this.$refs.canvasArea.offsetHeight;
                    let TLL, TLT;
                    if (pictH > pictW) {
                        // 直向
                        img.scaleToHeight(canvasHeight);
                        TLL = canvasWidth / 2 - pictW * img.scaleX / 2;
                        TLT = 0;
                        // BRL = canvasWidth / 2 + pictW * img.scaleX / 2;
                        // BRT = canvasWidth;
                    } else {
                        // 橫向 or 正方
                        img.scaleToWidth(canvasWidth);
                        TLL = 0;
                        TLT = canvasHeight / 2 - pictH * img.scaleY / 2;
                        // BRL = canvasHeight;
                        // BRT = canvasHeight / 2 + pictH * img.scaleY / 2;
                    }

                    img.set({
                        id: 'bg',
                        left: this.offsetX + TLL,
                        top: this.offsetY + TLT,
                        selectable: false,
                        evented: false,
                    });

                    this.fabricObj.add(img);

                    if (this.editable) {
                        let marker = this.createMaker(canvasWidth / 2, canvasHeight / 2, false, 'gray', 'pointer');
                        this.fabricObj.add(marker);
                        this.fabricObj.moveTo(marker, 0);
                    }
                    this.fabricObj.moveTo(img, 0);
                    resolve(true);
                });
            });
        },
        createMaker(x, y, editable = true, fill, id) {
            let fabricObject = new fabric.Path(this.mapMark, {
                stroke: '#333',
                fill: fill || this.markerColor,
                strokeWidth: 2,
                left: x - (54.899 / 2),
                top: y - 72.532,
                hasControls: false,
                borderColor: 'transparent',
                selectable: editable,
                evented: editable,
                lockMovementX: true,
                lockMovementY: true,
            });
            if (id) fabricObject.set({ id });
            return fabricObject;
        },
        updatePinPosition() {
            let marker = this.fabricObj?.getObjects()?.[1];
            const { left, top } = this.fabricObj.getCenter();
            let vpt = this.fabricObj.viewportTransform;

            let calX = left / vpt[0] - vpt[4] / vpt[0];
            let calY = top / vpt[0] - vpt[5] / vpt[0];
            if (marker) {
                marker.set({
                    left: calX - (marker.width / 2),
                    top: calY - marker.height,
                });
                marker.setCoords();
            }
        },
        pointerHide(show = false) {
            this.fabricObj.forEachObject(e => {
                if (e.id == 'pointer') {
                    e.set({
                        opacity: show ? 1 : 0,
                    });
                };
            });
        },
        async checkBorder() {
            const bg = this.fabricObj.getObjects()[0];
            const [TL, TR, BR, BL] = bg.getCoords();
            let { left, top } = this.fabricObj.getCenter();

            if (left < TL.x || left > TR.x || top < TL.y || top > BL.y) {
                let vpt = this.fabricObj.viewportTransform;
                let x;
                let y;
                if (left < TL.x) {
                    x = TL.x - left;
                    vpt[4] -= (x + 5);
                }
                if (left > TR.x) {
                    x = left - TR.x;
                    vpt[4] += (x + 5);
                }
                if (top < TL.y) {
                    y = TL.y - top;
                    vpt[5] -= (y + 5);
                }
                if (top > BL.y) {
                    y = top - BL.y;
                    vpt[5] += (y + 5);
                }
                this.fabricObj.setViewportTransform(this.fabricObj.viewportTransform);
                this.fabricObj.renderAll();
            }
        },
        resizeCanvas() {
            let width = this.$refs.canvasArea.offsetWidth;
            let height = this.$refs.canvasArea.offsetHeight;
            this.fabricObj?.setDimensions({ width, height });
            if (this.editable) this.updatePinPosition();
            this.fabricObj?.renderAll();
        },
        async scrollClick(value) {
            let newVal = this.currentZoom + value;
            if (newVal > -1 && newVal < 5) {
                this.currentZoom = newVal;
                const { left, top } = this.fabricObj.getCenter();
                let vpt = this.fabricObj.viewportTransform;
                let calX = left / vpt[0] - vpt[4] / vpt[0];
                let calY = top / vpt[0] - vpt[5] / vpt[0];
                this.fabricObj.zoomToPoint({ x: calX, y: calY }, this.zoomScroll[newVal]);
                this.fabricObj.setViewportTransform(this.fabricObj.viewportTransform);

                // 邊界檢查
                await this.checkBorder();
                // 中間標定點
                if (this.editable) {
                    this.updatePinPosition();
                    this.fabricObj.renderAll();
                }
            }
        },
        pinClick() {
            // 檢查底圖範圍
            const { left, top } = this.fabricObj.getCenter();
            const [TL, TR, BR, BL] = this.fabricObj.getObjects()[0].getCoords();
            let isContain = left > TL.x && left < TR.x && top > TL.y && top < BL.y;
            if (isContain) {
                let vpt = this.fabricObj.viewportTransform;
                let Cx = left / vpt[0] - vpt[4] / vpt[0];
                let Cy = top / vpt[0] - vpt[5] / vpt[0];
                this.fabricObj.add(this.createMaker(Cx, Cy, true, '', 'marker'));

                // log
                let uid = this.mapList[this.current].uid;
                let obj = this.fabToObject();
                this.markerLog[uid] = JSON.stringify(obj.objects.slice(2));
                this.calMiniSelectList();
                return true;
            } else {
                floatMsgRemind('超出底圖範圍');
                return false;
            }
        },
        fabToObject() {
            let includesArr = [
                'id',
                'fill',
                'stroke',
                'strokeWidth',
                'selectable',
                'evented',
                'borderColor',
                'hasControls',
                'lockMovementX',
                'lockMovementY'
            ];
            return this.fabricObj.toObject(includesArr);
        },
        deleteClick() {
            let marker = this.fabricObj.getActiveObject();
            this.fabricObj.remove(marker);

            // log
            let uid = this.mapList[this.current].uid;
            let obj = this.fabToObject();
            if (obj.objects.length > 2) {
                this.markerLog[uid] = JSON.stringify(obj.objects.slice(2));
            } else {
                this.markerLog[uid] = '';
            }
            this.calMiniSelectList();
        },
        editClick() {
            this.onMarkEdit = true;
            this.onEditBackup.currentZoom = this.currentZoom;
            this.onEditBackup.vpt = this.fabricObj.viewportTransform.slice(0);
            this.onEditBackup.json = JSON.stringify(this.fabToObject());
            this.fabricObj.remove(this.fabricObj.getActiveObject());
        },
        cancelClick() {
            this.fabricObj.clear();
            this.currentZoom = this.onEditBackup.currentZoom;
            this.fabricObj.viewportTransform = this.onEditBackup.vpt;
            this.fabricObj.setViewportTransform(this.onEditBackup.vpt);
            this.fabricObj.loadFromJSON(this.onEditBackup.json, () => {
                this.onMarkEdit = false;
                this.fabricObj.forEachObject(e => {
                    if (e.id == 'marker' && e.opacity == 1) {
                        this.fabricObj.setActiveObject(e);
                    }
                });
                this.fabricObj.renderAll();
            });
        },
        sureClick() {
            if (this.pinClick()) {
                this.onMarkEdit = false;
                this.onMarkerSelect = false;
                this.fabricObj.forEachObject(e => {
                    if (e.id == 'marker') {
                        e.set({
                            opacity: 1,
                        });
                    }
                });
            }
        },
        calMiniSelectList() {
            this.mapList4miniSelect = this.mapList.map(m => {
                let length = this.markerLog?.[m.uid]?.length;
                return {
                    name: m.name,
                    uid: m.uid,
                    icon: {
                        rear: {
                            html: '<div><i class="fa fa-map-marker" aria-hidden="true"></i></div>',
                            class: length ? 'active' : '',
                        }
                    },
                }
            });
        },
        afterLeave() {
            window.removeEventListener('resize', this.resizeCanvas);
        },
        output() {
            return _.cloneDeep(this.markerLog);
        },
        nextBtnClick() {
            this.$refs.dialog.onDialogClose();
            if (this.editable && this.sureCall) this.sureCall(this.output());
        },
    },
    created() {
        this.calMiniSelectList();
    },
    async mounted() {
        this.fabricObj = new fabric.Canvas('canvas', {
            // isDrawingMode: false,
            devicePixelRatio: true,
            selection: this.editable,
        });

        this.fabricObj.setHeight(this.$refs.canvasArea.offsetHeight);
        this.fabricObj.setWidth(this.$refs.canvasArea.offsetWidth);

        let uid = Object.keys(this.markerLog)?.[0];
        let index = this.mapList.findIndex(f => f.uid == uid);
        if (uid && index != -1 && this.markerLog[uid]?.length) {
            this.current = index;
            let jsonStr = `{"objects":${this.markerLog[uid]}}`;
            this.fabricObj.loadFromJSON(jsonStr, async () => {
                await this.loadMap(this.currentUrl);
                this.loading = false;
            });
        } else {
            await this.loadMap(this.currentUrl);
            this.loading = false;
        }

        this.fabricObjAddEvent();
        window.addEventListener('resize', this.resizeCanvas, false);
        // console.log(this);
        // console.log(this.fabricObj);
    },

}