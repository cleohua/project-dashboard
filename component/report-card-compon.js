import config from "../config";

var template = /*html*/ `
<div
    class="report-card"
    @click.stop="listClick"
>
    <div
        class="thumbnail-area"
        :class="{'small-style': options.smallThumbnail}"
        v-if="options.showThumbnail"
    >
        <img
            ref="img"
            loading="lazy"
            :src="imgSrc"
        >
    </div>
    <div
        class="left"
    >
        <div
            class="header"
        >
            <div
                class="date"
                v-if="options.showDate"
            >
                <span>
                    <i class="fa fa-calendar" aria-hidden="true"></i>
                </span>
                <span>{{data.date}}</span>
            </div>
            <div
                class="snap"
                v-if="options.showSupervise"
            >
                <span>
                    <i class="fa fa-user" aria-hidden="true"></i>
                </span>
                <span>{{data.supervise.name}}</span>
                <span>({{data.according}})</span>
            </div>
        </div>
        <div
            class="title"
        >{{titleText}}</div>
        <div
            class="office"
            v-if="options.showOffice"
        >
            <div>工地：{{data.project.name}}</div>
            <div>工處別：{{data.office}}</div>
        </div>
        <div 
            class="location"
            v-if="options.showLocation"
        >
            <span>位置描述：{{data.location}}</span>
            <span
                @click.stop="markClick"
            >
                <i class="fa fa-map-marker" aria-hidden="true"></i>
            </span>
        </div>
    </div>
    <div
        class="right"
    >
        <div
            class="status"
            :class="[statusClass]"
            v-if="options.showStatus"
        >{{statusText}}</div>
        <div 
            class="delay"
            v-if="showDelay"
        >
            <div 
                class="delaystr"
            >逾期</div>
            <span 
                class="delay-status"
            >{{data.delay}}</span>
            <div
                class="delaystr"
            >天</div>
        </div>
    </div>
</div>
`

export default {
    name: 'report-card-compon',
    template,
    props: {
        data: {
            type: Object,
            default: () => { },
        },
        options: {
            type: Object,
            default: () => ({
                showThumbnail: true,
                smallThumbnail: false,
                showDate: true,
                showSupervise: true,
                showStatus: true,
                showDelay: true,
                showLocation: true,
                showOffice: false,
            }),
        },
        isproject: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            statusList: _.cloneDeep(this.isproject ? config.status.project : config.status.company),
            reportTypeList: _.cloneDeep(config.reportType),
        }
    },
    computed: {
        imgSrc() {
            if (this.data.thumbnail) {
                if (this.data.thumbnail.slice(0, 10) === 'data:image') {
                    return this.data.thumbnail;
                } else {
                    return `${imgUrl}${this.data.thumbnail}`;
                }
            } else {
                return './include/images/safety-inspect/image-icon.svg';
            }
        },
        titleText() {
            // reportType: 全部/缺失/提醒/優良/現況
            const { reportType, issue } = this.data;
            return `${this.reportTypeList[reportType].name}內容：${issue}`;
        },
        statusClass() {
            // status: 
            // 0: 無狀態, 1: 待送出, 2: 未回覆, 3: 待審核, 4: 結案
            const { reportType, status } = this.data;
            switch (reportType) {
                case 1:
                    return status == 4 ? 'finish' : 'danger';
                case 2:
                    return 'good';
                case 3:
                    return 'remind';
                case 4:
                    return 'normal';
            }
        },
        statusText() {
            const { reportType, status } = this.data;
            if (reportType == 1) {
                // 缺失
                return this.statusList[status].name;
            } else {
                // 提醒、優良、現況
                return this.reportTypeList[reportType].name;
            }
        },
        showDelay() {
            const { status, delay } = this.data;
            return (status == 2 || status == 3) && (delay > 0);
        }
    },
    methods: {
        listClick() {
            this.$emit('onreportclick', {
                paperID: this.data.uid,
                recordIdArr: [this.data.record_id],
                supervise: this.data.supervise.uid,
            });
        },
        markClick() {
            this.$emit('onmarkclick', {
                paperID: this.data.uid,
                recordID: this.data.record_id,
            });
        }
    },
}