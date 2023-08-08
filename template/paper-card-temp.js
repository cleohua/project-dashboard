export default /*html*/ `
<div
    class="paper-card"
    @click="listClick"
>
    <div
        class="paper-header"
        :class="{'flip-down': flipdown}"
    >
        <div>
            <div
                class="title"
                v-if="showTitle"
            >{{data.title}}</div>
            <div
                class="date"
                v-if="showDate"
            >
                <span>時間：</span>
                <span>{{data.date}}</span>
            </div>
            <div
                class="project"
                v-if="showProject"
            >
                <span>工地：</span>
                <span>{{data.project.text}}</span>
            </div>
        </div>
        <div
            class="fault-summary"
            v-if="showFaultSummary"
        >
            <div>
                <div>
                    <div>待回</div>
                    <div>{{waitCount}}</div>
                </div>
                <div>
                    <div>逾期</div>
                    <div
                        :class="{'danger' : delagCount}"
                    >{{delagCount}}</div>
                </div>
                <div>
                    <div>待審</div>
                    <div
                        :class="{'danger': pendingCount}"
                    >{{pendingCount}}</div>
                </div>
            </div>
            <div>
               <div>
                    <div>未送</div>
                    <div>{{unsubmittedCount}}</div>
                </div>
                <div>
                    <div>完成</div>
                    <div>{{finishCount}}</div>
                </div>
                <div>
                    <div>總數</div>
                    <div>{{summaryCount}}</div>
                </div>
            </div>
        </div>
        <div
            @click.stop="flipdown = !flipdown"
            class="flip-icon-area"
        >
            <div
                class="flip-icon"
            >
                <i 
                    class="fa fa-angle-down"
                    :class="{'fa-rotate-180': flipdown}"
                ></i>
            </div>
        </div>
    </div>
    <div
        class="paper-content"
        :class="{'flip-down': flipdown}"
    >
        <div>
            <div
                v-for="(type, index) in typeList"
                @click.stop="typeClick(index)"
                :class="{'active': currentType == index}"
            >{{typeText(index)}}</div>
        </div>
        <div
            class="report-area"
        >
            <template
                v-if="currentList.length"
            >
                <report-card
                    v-for="(list, index) in currentList"
                    :data="list"
                    :key="index"
                    :options="recordOptions"
                    :isproject="isproject"
                    @onreportclick="reportClick"
                ></report-card>
            </template>
            <template
                v-else
            >
                <div
                    class="empty-remind"
                >尚無相關記錄</div>
            </template>
        </div>
    </div>
</div>
`