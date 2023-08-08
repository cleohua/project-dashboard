import config from "../config";

var template = /*html*/ `
<div
    class="examine-record-area"
>
    <div
        class="flow-bar"
    >
        <div>當前流程</div>
        <div
            class="flow-content scroll-style-gray-thin"
        >
            <template
                v-for="(event, index) in examineFlow"
            >
                <template
                    v-if="event.status == 10"
                >
                    <div class="one-user finish">結案</div>
                </template>
                <template
                    v-else
                >  
                    <div
                        class="one-user"
                        :key="index + 'a'"
                    >
                        <div>
                            <i class="fa fa-user-circle-o" aria-hidden="true"></i>
                        </div>
                        <div>
                            <div>{{event.name}}</div>
                            <div>{{event.title}}</div>
                        </div>
                    </div>
                </template>
                <div
                    v-if="event.status && event.status != 10"
                    :key="index + 'b'"
                    class="event-arrow"
                >
                    <div>
                        <span>{{eventStatusText(event.status)}}</span>
                        <i class="fa fa-arrow-right" aria-hidden="true"></i>
                    </div>
                    <div>{{event.time}}</div>
                </div>
            </template>
        </div>
    </div>
    <div
        class="history-log"
    >
        <div>辦況紀錄</div> 
        <div
            class="status-tab"
        >
            <div
                v-for="tab in statusTab"
                :key="tab.index"
                :class="{'active': tab.index == currentStatus}"
                @click="currentStatus = tab.index"
            >{{tab.name}}</div>
        </div>
        <div
            class="log-list-content"
        >
            <div
                class="scroll-style-gray-thin"
            >
                <template
                    v-if="currentHistory.length"
                >
                    <div
                        class="one-log-list"
                        v-for="log in currentHistory"
                        :key="log.keyIndex"
                    >
                        <div>{{(log.header)}}</div>
                        <div>{{log.content}}</div>
                    </div>
                </template>
                <template
                    v-else
                >
                    <div
                        class="empty-remind"
                    >無相關事件</div>
                </template>
            </div>
        </div>
    </div>
</div>
`

export default {
    name: 'examine-record-compon',
    template,
    props: {
        historyList: {
            type: Array,
            default: () => []
        },
        examineFlow: {
            type: Array,
            default: () => []
        }
    },
    data() {
        const ids = [0, 1, 3, 5, 9];
        const examine = _.cloneDeep(config.status.examine);
        return {
            statusText: examine.map(i => i.name),
            statusTab: examine.filter(i => ids.includes(i.index)),
            currentStatus: 0,
        };
    },
    computed: {
        currentHistory() {
            return this.historyList.filter(i => {
                if (this.currentStatus) {
                    return i.status == this.currentStatus;
                } else {
                    return true;
                }
            });
        },
        eventStatusText() {
            return (status) => {
                return this.statusText[status];
            };
        }
    },
}