export default /*html*/ `
<full-size
    :elementID="elementID"
    :titleText="titleText"
    :nextBtnShow="nextBtnShow"
    @afterLeave="afterLeave"

>
    <div
        :class="{'loading': loading}"
        @click="menuHide"
    >
        <div
            class="checklist-header"
        >
            <div
                class="type-select"
            >
                <div
                    v-for="(type, index) in data"
                    @click="typeClick(index)"
                    :class="{'active': index == active}"
                >
                    <span>{{type.name}}</span>
                    <span>({{type.list.length}})</span>
                </div>
            </div>
            <div>
                <div
                    class="search-area dark-theme"
                >
                    <i class="fa fa-search"></i>
                    <input
                        type="text"
                        v-model="searchText"
                        placeholder="請輸入關鍵字"
                    >
                </div>
                <div
                    class="insert-btn"
                    @click="insertClick"
                >新增{{active == 0 ? '自檢表' : '檢查工項'}}</div>
            </div>
        </div>
        <div
            class="checklist-content"
            ref="content"
        >
            <template
                v-if="currentList.length"
            >
                <div
                    class="checklist-line"
                    v-for="(list, index) in currentList"
                    :key="list.uid"
                    :type="data[active].type"
                    @click="listClick(list.uid)"
                >
                    <div
                        class="title"
                    >{{listTitleText(list.name, index)}}</div>
                    <div
                        class="points-info"
                        v-if="active == 0"
                    >
                        <div>
                            <span>基準分：</span>
                            <span>{{list.point}}</span>
                        </div>
                        <div>
                            <div>
                                <span>規模權重：</span>
                                <span>{{ratioText(list.scope_rate)}}</span>
                            </div>
                            <div>
                                <span>進度權重：</span>
                                <span>{{ratioText(list.progress_rate)}}</span>
                            </div>
                        </div>
                    </div>
                    <div
                        class="list-option"
                    >
                        <div
                            @click.stop="menuClick(list.uid)"
                        >
                            <div></div>
                        </div>
                        <div
                            class="options-menu"
                            v-show="menuShow == list.uid"
                        >
                            <div
                                v-for="(opt, index) in data[active].menu"
                                :key="index"
                                @click.stop="opt.todo(list.uid, list.name)"
                            >{{opt.name}}</div>
                        </div>
                    </div>
                </div>
            </template>
            <template
                v-else
            >
                <div
                    class="empty-remind"
                >尚無新增檢查項目</div>
            </template>
        </div>
    </div>
</full-size>
`