var template = /*html*/ `
<full-size
    :elementID="elementID"
    :titleText="titleText"
    :nextBtnText="nextBtnText"
    :subMenu="subMenu"
    :subMenuArr="subMenuArr"
    @close="closeClick"
    @afterLeave="afterLeave"
    @send="nextBtnClick"
    ref="dialog"
>
    <div 
        :class="{'loading': loading}"
    >
        <div
            class="history-remind"
        >
            <i class="fa fa-history" aria-hidden="true"></i>
            <span>{{historyText}}</span>
        </div>
        <div
            class="tab-area"
        >
            <div
                v-for="(tab, index) in tabs"
                :key="index"
                :class="{'active': index == currentIndex}"
                @click="currentIndex = index"
            >{{tab}}</div>
        </div>
        <div
            class="page-area"
        >
            <div
                v-show="currentIndex == 0"
                class="summary-page"
            >
                <div>
                    <div
                        class="title-text"
                    >報告內容</div>
                    <div
                        v-for="(list, index) in summaryListA"
                        class="one-line"
                        :key="index"
                    >
                        <div>{{list.name}}</div>
                        <div>{{textString(list.text)}}</div>
                        <div
                            v-if="list.editable"
                            @click="editClick(index)"
                        >
                            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                        </div>
                    </div>
                </div>
                <div>
                    <div
                        v-for="(list, index) in summaryListB"
                        class="one-line"
                        :key="index"
                    >
                        <div>{{list.name}}</div>
                        <div>{{textString(list.text)}}</div>
                    </div>
                </div>
                <div>
                    <div
                        class="one-line"
                    >
                        <div>施工概況</div>
                        <div
                            class="text-input"
                        >
                            <textarea
                                type="text"
                                v-model="overview"
                                placeholder="請輸入施工概況"
                                :class="{'danger': danger.overview }"
                            ></textarea>
                        </div>
                    </div>
                    <div
                        class="one-line"
                    >
                        <div>稽核說明</div>
                        <div
                            class="text-input"
                        >
                            <textarea
                                type="text"
                                v-model="description"
                                placeholder="請輸入稽核說明"
                                :class="{'danger': danger.description }"
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-show="currentIndex == 1"
                class="report-page"
            >
                <div>一、現況及優良</div>
                <draggable
                    :list="uid_now"
                    class="list-group"
                    :class="{'onDrag': dragging == 'a'}"
                    drag-class="drag"
                    ghost-class="ghost"
                    group="a"
                    handle=".drap-icon"
                    @start="dragging = 'a'"
                    @end="dragging = null"
                >
                    <template
                        v-if="uid_now.length"
                    >
                        <list-compon
                            v-for="record_id in uid_now"
                            :key="record_id"
                            :data="recordData?.[record_id]"
                            :with-sub-area="false"
                            @list-click="listClick"
                        ></list-compon>
                    </template>
                    <template
                        v-else
                    >
                        <div
                            class="empty-remind"
                        >無記錄</div>
                    </template>
                </draggable>
                <div>二、缺失</div>
                <draggable
                    :list="uid_bad"
                    class="list-group"
                    :class="{'onDrag': dragging == 'b'}"
                    drag-class="drag"
                    ghost-class="ghost"
                    group="b"
                    handle=".drap-icon"
                    @start="dragging = 'b'"
                    @end="dragging = null"
                >
                    <template
                        v-if="uid_bad.length"
                    >
                        <list-compon
                            v-for="record_id in uid_bad"
                            :key="record_id"
                            :data="recordData?.[record_id]"
                            @list-click="listClick"
                        ></list-compon>
                    </template>
                    <template
                        v-else
                    >
                        <div
                            class="empty-remind"
                        >無記錄</div>
                    </template>
                </draggable>
                </draggable>
                <div>三、提醒</div>
                <draggable
                    :list="uid_remind"
                    class="list-group"
                    :class="{'onDrag': dragging == 'c'}"
                    drag-class="drag"
                    ghost-class="ghost"
                    group="c"
                    handle=".drap-icon"
                    @start="dragging = 'c'"
                    @end="dragging = null"
                >
                   <template
                        v-if="uid_remind.length"
                    >
                        <list-compon
                            v-for="record_id in uid_remind"
                            :key="record_id"
                            :data="recordData?.[record_id]"
                            :with-sub-area="false"
                            @list-click="listClick"
                        ></list-compon>
                    </template>
                    <template
                        v-else
                    >
                        <div
                            class="empty-remind"
                        >無記錄</div>
                    </template>
                </draggable>
            </div>
        </div>
    </div>
</full-size>
`;

var listTemp = /*html*/ `
<div
    class="one-list"
    @click="listClick"
>
    <div
        class="list-content"
    >
        <div>
            <img
                :src="imgSrc(data.thumbnail)"
            >
        </div>
        <div>
            <div>
                <div>
                    <span>{{data.issue}}</span>
                </div>
                <div>
                    <span>{{data.location}}</span>
                    <span
                        v-if="data.mark"
                        class="mark-icon"
                    >
                        <i aria-hidden="true" class="fa fa-map-marker"></i>
                    </span>
                </div>
                <div
                    v-if="data.checkitem"
                >
                    <span>{{data.checkitem}}</span>
                </div>
            </div>
            <div
                class="drap-icon"
            >
                <i class="fa fa-arrows-v" aria-hidden="true"></i>
            </div>
        </div>
        <div
            v-if="withSubArea"
            class="show-more-btn fa fa-angle-down"
            :class="{'fa-rotate-180': filpDown }"
            @click.stop="filpDown = !filpDown"
        ></div>
    </div>
    <div
        v-if="withSubArea"
        :class="{'flip-down': filpDown }"
        class="sub-area"
    >
        <div
            class="list-content"
            v-if="data.reply.middle"
        >
            <div>
                <img
                    :src="imgSrc(data.reply.middle.thumbnail)"
                >
            </div>
            <div>
                <div>
                    <div>
                        <span>{{data.reply.middle.issue}}</span>
                    </div>
                    <div>
                        <span>{{data.reply.middle.expectDate}}</span>
                    </div>
                    <div>
                        <span>{{data.reply.middle.finishDate}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="list-content"
        >
            <div>
                <img
                    :src="imgSrc(data.reply.finish.thumbnail)"
                >
            </div>
            <div>
                <div>
                    <div>
                        <span>{{data.reply.finish.issue}}</span>
                    </div>
                    <div>
                        <span>{{data.reply.finish.expectDate}}</span>
                    </div>
                    <div>
                        <span>{{data.reply.finish.finishDate}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;

export { template, listTemp }