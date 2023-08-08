import fullsizeDialogSlotCompon from "../../../vue/assets/fullsize-dialog-slot-compon.js";
import { template, listTemp } from "../template/paper-confirm-temp.js";

var listCompon = {
    name: 'list-compon',
    template: listTemp,
    props: {
        data: {
            type: Object
        },
    },
    computed: {
        imgSrc() {
            let img = './include/images/safety-inspect/image-icon.svg';
            const thumbnail = this.data?.thumbnail;
            if (thumbnail) {
                if (thumbnail.slice(0, 10) === 'data:image') {
                    img = thumbnail;
                } else {
                    img = `${imgUrl}${thumbnail}`;
                }
            }
            return img;
        }
    },
    methods: {
        listClick() {
            this.data.select = !this.data.select;
        }
    }
}

export default {
    name: 'send-confirm-compon',
    template,
    components: {
        'full-size': fullsizeDialogSlotCompon,
        'list-compon': listCompon,
    },
    computed: {
    },
    data() {
        return {
            loading: true,
            elementID: 'send-confirm-page',
            titleText: '以下記錄將送至工地端',
            nextBtnText: '送出',
            returnBtnText: '取消',
            dataList: [],
            sended: false,
        }
    },
    methods: {
        nextBtnClick() { },
        closeClick() { },
        // afterLeave() { },
        listClick() { },
        output() {
            return this.dataList.filter(i => i.select)
                .map(i => i.record_id);
        }
    }
}