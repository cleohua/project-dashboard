import widgetChatCompon from "../component/widget-chart-compon.js";
import widgetListCompon from "../component/widget-list-compon.js";
import * as callapi from "../callAPI.js";

const template = /*html*/ `
<div
    class="overview-area"
>
    <h3>安保中心</h3>
    <div
        class="scroll-style-gray-thick"
    >
        <div
            class="widget-box"
            :class="sizeClass(widget.size)"
            v-for="widget in currentWidget"
            :key="widget.id"
        >
            <div>
                <div
                    class="widget-title"
                >{{widget.title}}</div>
                <div
                    class="hover-show"
                    :class="{'show': curMenuShow == widget.id}"
                    @click="menuClick(widget.id)"
                >
                    <div>
                        <i class="fa fa-cog" aria-hidden="true"></i>
                    </div>
                    <div
                        v-show="curMenuShow == widget.id"
                        class="widget-menu"
                    >
                        <div>尺寸</div>
                        <div @click="setWidth(widget, 'full')">100%</div>
                        <div @click="setWidth(widget, 'half')">50%</div>
                    </div>
                </div>
            </div>
            <widget-list
                v-if="widget.type == 'form'"
                :widget-data="widget"
                :column-data="columnData"
            ></widget-list>
            <widget-chat
                v-if="widget.type == 'chart'"
                :widget-data="widget"
            ></widget-chat>
        </div>
    </div>
</div>
`;

// widget 拖拉換位?
export default {
    name: 'overview-compon',
    components: {
        'widget-list': widgetListCompon,
        'widget-chat': widgetChatCompon,
    },
    template,
    props: {
        isproject: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            // this
            userProfile: {
                // 排序
                widgetOrder: [],
                // 使用者設定
                widgetSet: {}
            },
            curMenuShow: null,
            widgetList: [],
            columnData: {},
            isAsync: true,
        }
    },
    computed: {
        sizeClass() {
            return (size) => {
                switch (size) {
                    case 'full':
                        return 'w-100';
                    case '33':
                        return 'w-33';
                    case 'half':
                    default:
                        return 'w-50';
                }
            }
        },
        currentWidget() {
            const order = this.userProfile.widgetOrder;
            const widgetList = order.reduce((arr, id) => {
                let find = this.widgetData.find(w => w.id == id);
                if (find) arr.push(find);
                return arr;
            }, []);
            return widgetList;
        }
    },
    watch: {
        userProfile: {
            async handler() {
                await this.saveStorage(this.userProfile);
                // FIXME:
                // this.updateProfile();
            },
            deep: true,
        }
    },
    methods: {
        setWidth(widget, width) {
            widget.size = width;
            this.logCustomSet(widget.id, 'size', width);
        },
        menuClick(index) {
            this.curMenuShow = this.curMenuShow == index ? null : index;
        },
        async refresh() {
            let get1 =  callapi.getUserProfile();
            let get2 = callapi.getWidgetList();
            const [data1, data2] = await Promise.all([get1, get2]);
            const { widgetOrder, widgetSet } = data1;
            const { widget, columns } = data2;

            let widgetData = widget.map(obj => {
                let customSet = widgetSet[obj.id] || {};
                return { ...obj, ...customSet };
            });

            this.userProfile.widgetOrder = widgetOrder;
            this.widgetData = widgetData;
            this.columnData = columns;

        },
        // logCustomSet
        logCustomSet(id, key, value) {
            const widgetSet = this.userProfile.widgetSet;
            const target = widgetSet[id] ||= {};
            target[key] = value;
        },
        loadStorage() {
            let profile = localStorage.getItem('safety-inspect-overview-profile');
            return JSON.parse(profile);
        },
        async saveStorage(data) {
            console.log('saveStorage');
            if (typeof data != 'string') data = JSON.stringify(data);
            localStorage.setItem('safety-inspect-overview-profile', data);
            this.isAsync = false;
        },
        removeStorage() {
            localStorage.removeItem('safety-inspect-overview-profile');
        },
        async userProfileAsync() {
            console.log('userProfileAsync!');
            // TODO: call api
            this.isAsync = true;
            this.removeStorage();
        },
        updateProfile: _.debounce(function () {
            this.userProfileAsync;
        }, 5000),
    },
    async created() {
        const localProfile = this.loadStorage();
        // FIXME:
        if (false && localProfile) {
            this.userProfile = localProfile;
            await this.userProfileAsync();
        }
        this.refresh();

        onLoadPageCallList.push({
            funCall: () => {
                if (!this.isAsync) this.userProfileAsync();
            }, once: true
        });

        console.log(this);
    },
    destroyed() {
        if (!this.isAsync) this.userProfileAsync();
    }
}