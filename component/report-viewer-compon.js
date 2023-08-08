import editRecordCardCompon from "./edit-record-card-compon.js";
import edit from "../view/index.js";

var template = /*html*/ `
<div
    class="report-viewer-bg"
    @click="bgClick"
    v-if="bgShow"
>
    <transition 
        appear name="slide"
        v-on:after-leave="afterLeave"
    >
        <div
            id="report-viewer"
            v-if="dialogShow"
            @click.stop
        >
            <record-card
                v-for="card in cardList"
                :key="card.keyIndex"
                :editable="false"
                :keyIndex="card.keyIndex"
                :data="card"
                ref="card"
                @select="select"
            ></record-card>
        </div> 
    </transition>
</div>
`;

export default {
    name: 'report-viewer-compon',
    template,
    components: {
        'record-card': editRecordCardCompon,
    },
    data() {
        return {
            bgShow: true,
            dialogShow: false,
            keyIndex: 0,
            cardList: [],
        }
    },
    methods: {
        select() {
            const card = this.cardList[0];
            edit.mapMaker({
                mapList: card.picture.bg,
                markerLog: _.cloneDeep(card.mark),
                current: 0,
                editable: false,
            });
        },
        bgClick() {
            if (this.dialogShow) this.dialogShow = false;
        },
        async afterLeave() {
            this.bgShow = false;
        },
    },
}