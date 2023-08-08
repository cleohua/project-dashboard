var pageTemp = /*html*/ `
<full-size
    :elementID="elementID"
    :titleText="titleText"
    :nextBtnShow="editMode"
    :nextBtnText="nextBtnText"
    @nextBtnClick="nextBtnClick"
    @close="closeClick"
    ref="dialog"
>
    <div 
        :class="{'loading': loading}"
        @click.stop="miniSelectShow = false"
    >
        <div
            class="sh-page-header"
        >
            <div>
                <div
                    class="title"
                >
                    <div>{{name}}</div>
                </div>
                <div
                    class="points-info"
                >
                    <div>
                        <span>評分：</span>
                        <span>{{minusText}}</span>
                    </div>
                    <div>
                        <span>總分：</span>
                        <span>{{score}}</span>
                    </div>
                    <div>
                        <div>
                            <span>規模權重：</span>
                            <span>{{scopeRateText}}</span>
                        </div>
                        <div>
                            <span>進度權重：</span>
                            <span>{{progressRateText}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div
                    @click.stop="miniSelectShow = !miniSelectShow"
                >
                    <div>{{typeText}}</div>
                    <div
                        class="triangle-icon"
                        :class="{'filp': miniSelectShow}"
                    ></div>
                    <mini-select
                        v-show="miniSelectShow"
                        :options="typeList"
                        :reduce="(t) => t.index"
                        :withsearch="false"
                        @onselect="typeSelect"
                    ></mini-select>
                </div>
                <div>
                    <input
                        type="text"
                        v-model.trim="searchText"
                        placeholder="搜尋檢查項目名稱"
                    >
                </div>
            </div>
        </div>
        <div
            class="sh-page-content"
        >
            <div
                class="one-unit"
                v-for="(unit, index) in currentUnit.filter(unit => unit.show)"
                :key="index"
            >
                <div
                >
                    <div>{{unit.typeName}}</div>
                    <div>({{unit.point}}%)</div>
                </div>
                <div
                    class="one-list one-list-title"
                >
                    <div>檢查內容</div>
                    <div
                        class="one-list-score"
                    >評分</div>
                    <div
                        class="one-list-status"
                    >總評結果</div>
                </div>
                <list-compon
                    v-for="list in unit.list.filter(i => i.show)"
                    :key="list.uid"
                    :list="list"
                    :editMode="editMode"
                    @view-record="viewRecord"
                ></list-compon>
            </div>
        </div>
    </div>
</full-size>
`;

var listTemp = /*html*/ `
<div
    class="one-list"
    :class="{'active': list.report.length}"
>
    <div
        class="list-name"
        @click="viewRecord(list.report)"
    >
        <div 
            :class="{'line-through': list.status == 2}"
        >{{list.name}}</div>
        <div
            :class="{'line-through': list.status == 2}"
        >{{listCount}}</div>
    </div>
    <div
        class="one-list-score-limit"
        v-if="editMode && list.report.length && list.status != 2"
    >
        <div></div>
        <div>扣分上限 -{{list.limit}}</div>
    </div>
    <div
        class="one-list-score"
    >
        <input
            type="number"
            v-model.number="list.point"
            @input="valueCheck"
            @blur="blur"
            :step="inputStep"
            :min="inputMini"
            :class="{'editable': inputEditable}"
            :readonly="inputReadOnly"
        >
    </div>
    <div
        @click="statusClick"
        class="one-list-status"
        :class="{'mouse-pointer': editMode}"
    >
        <div
            class="status-icon"
            :class="statusClass"
        >{{statusText}}</div>
    </div>
</div>
`;

export {pageTemp, listTemp};